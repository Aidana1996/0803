/* =========================================================================
   0803 — Shared behaviour
   Header, mobile menu, search, the reserve list (our stand-in for a cart:
   nothing is sold online, items are held for a fitting at the Santa Ana
   store), product cards, toasts and scroll reveals.
   ========================================================================= */

const ICONS = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 12h15m-5.5-6 6 6-6 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.2 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4 6.2 2 2 0 0 1 6.5 4Z"/></svg>',
  hanger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 9a2.5 2.5 0 1 1 2.5-2.5"/><path d="M12 9v2l8.2 5.4a1.6 1.6 0 0 1-.9 2.9H4.7a1.6 1.6 0 0 1-.9-2.9L12 11"/></svg>'
};

/* ------------------------------------------------------- Reserve list */
const RESERVE_KEY = '0803:reserve:v1';

const Reserve = {
  read() {
    try { return JSON.parse(localStorage.getItem(RESERVE_KEY)) || []; }
    catch (e) { return []; }
  },
  write(items) {
    try { localStorage.setItem(RESERVE_KEY, JSON.stringify(items)); } catch (e) { /* private mode */ }
    document.dispatchEvent(new CustomEvent('reserve:change', { detail: items }));
  },
  key(productId, colorId, size) { return `${productId}|${colorId}|${size}`; },
  add(productId, colorId, size, qty = 1) {
    const items = this.read();
    const k = this.key(productId, colorId, size);
    const found = items.find(i => i.key === k);
    const max = stockFor(productId, colorId, size);
    if (found) found.qty = Math.min(max, found.qty + qty);
    else items.push({ key: k, productId, colorId, size, qty: Math.min(max, qty) });
    this.write(items);
    return items;
  },
  setQty(key, qty) {
    let items = this.read();
    const item = items.find(i => i.key === key);
    if (!item) return items;
    const max = stockFor(item.productId, item.colorId, item.size);
    item.qty = Math.max(0, Math.min(max, qty));
    items = items.filter(i => i.qty > 0);
    this.write(items);
    return items;
  },
  remove(key) {
    this.write(this.read().filter(i => i.key !== key));
  },
  clear() { this.write([]); },
  count() { return this.read().reduce((n, i) => n + i.qty, 0); },
  total() {
    return this.read().reduce((sum, i) => {
      const p = productById(i.productId);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
  },
  has(productId, colorId, size) {
    return this.read().some(i => i.key === this.key(productId, colorId, size));
  }
};

/* --------------------------------------------------------------- Helpers */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const param = name => new URLSearchParams(location.search).get(name);
const imgFor = (productId, colorId) => `assets/img/products/${productId}--${colorId}.svg`;
const productUrl = (productId, colorId) => `product.html?id=${productId}${colorId ? '&color=' + colorId : ''}`;

/** Floor-level availability summary used on cards and in the drawer. */
function stockLabel(units) {
  if (units <= 0) return { cls: 'stock--out', text: 'Sold out in store' };
  if (units <= 2) return { cls: 'stock--low', text: units === 1 ? 'Last one in store' : `Only ${units} in store` };
  return { cls: 'stock--in', text: 'In stock at Santa Ana' };
}

function toast(message) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = message;
  requestAnimationFrame(() => el.classList.add('is-open'));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('is-open'), 3200);
}

/* ---------------------------------------------------------- Product card */
function productCard(product, opts = {}) {
  const color = product.colors.find(c => c.id === opts.colorId) || product.colors[0];
  const alt = product.colors[1] || product.colors[0];
  const units = totalStock(product);
  const label = stockLabel(units);
  const badge = units <= 0
    ? '<span class="card__badge card__badge--out">In store soon</span>'
    : product.badge ? `<span class="card__badge">${esc(product.badge)}</span>` : '';

  return `
  <article class="card" data-product="${product.id}">
    <a class="card__media" href="${productUrl(product.id, color.id)}" aria-label="${esc(product.name)}">
      ${badge}
      <img class="is-main" src="${imgFor(product.id, color.id)}" alt="${esc(product.name)} in ${esc(color.name)}" loading="lazy" width="1000" height="1250">
      <img class="is-alt" src="${imgFor(product.id, alt.id)}" alt="" aria-hidden="true" loading="lazy" width="1000" height="1250">
      <span class="card__quick"><span class="btn btn--sm btn--block">View piece</span></span>
    </a>
    <div class="card__body">
      <div class="card__top">
        <h3 class="card__name"><a href="${productUrl(product.id, color.id)}">${esc(product.name)}</a></h3>
        <span class="card__price">${money(product.price)}</span>
      </div>
      <span class="card__meta">${esc(product.category)} · ${product.colors.length} ${product.colors.length === 1 ? 'colour' : 'colours'}</span>
      <span class="stock ${label.cls}">${label.text}</span>
      <div class="swatches">
        ${product.colors.map(c => `
          <button class="swatch${c.id === color.id ? ' is-active' : ''}" style="background:${c.hex}"
                  data-swatch="${c.id}" title="${esc(c.name)}" aria-label="Show ${esc(c.name)}"></button>`).join('')}
      </div>
    </div>
  </article>`;
}

/* Swatch hover/click swaps the card image without a page load. */
document.addEventListener('click', e => {
  const sw = e.target.closest('.card .swatch');
  if (!sw) return;
  e.preventDefault();
  const card = sw.closest('.card');
  const pid = card.dataset.product;
  const cid = sw.dataset.swatch;
  $$('.swatch', card).forEach(s => s.classList.toggle('is-active', s === sw));
  const main = $('.is-main', card);
  main.src = imgFor(pid, cid);
  $$('a[href^="product.html"]', card).forEach(a => { a.href = productUrl(pid, cid); });
});

/* ------------------------------------------------------------- Chrome */
function initHeader() {
  const header = $('.header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const path = location.pathname.split('/').pop() || 'index.html';
  const here = path + location.search;
  const links = $$('.nav__link');
  const exact = links.filter(a => (a.getAttribute('href') || '') === here);
  const marks = exact.length
    ? exact
    : links.filter(a => (a.getAttribute('href') || '') === path);
  marks.forEach(a => a.setAttribute('aria-current', 'page'));
}

function openLayer(el) {
  el.classList.add('is-open');
  $('.scrim').classList.add('is-open');
  document.body.classList.add('no-scroll');
}
function closeLayers() {
  $$('.panel, .search').forEach(el => el.classList.remove('is-open'));
  const scrim = $('.scrim');
  if (scrim) scrim.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
}

function initLayers() {
  if (!$('.scrim')) {
    const s = document.createElement('div');
    s.className = 'scrim';
    document.body.appendChild(s);
  }
  $('.scrim').addEventListener('click', closeLayers);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLayers(); });
  $$('[data-close]').forEach(b => b.addEventListener('click', closeLayers));

  const menuBtn = $('[data-open="menu"]');
  if (menuBtn) menuBtn.addEventListener('click', () => openLayer($('#menu')));

  const bagBtn = $('[data-open="reserve"]');
  if (bagBtn) bagBtn.addEventListener('click', () => { renderDrawer(); openLayer($('#reserve-drawer')); });

  const searchBtn = $('[data-open="search"]');
  if (searchBtn) searchBtn.addEventListener('click', () => {
    openLayer($('#search'));
    setTimeout(() => $('#search-input').focus(), 220);
  });
}

/* --------------------------------------------------------------- Search */
function initSearch() {
  const input = $('#search-input');
  if (!input) return;
  const out = $('#search-results');
  const render = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      const picks = PRODUCTS.filter(p => p.badge === 'Best seller').slice(0, 4);
      out.innerHTML = `<p class="eyebrow">Most looked at this week</p>
        <div class="grid grid--products">${picks.map(p => productCard(p)).join('')}</div>`;
      return;
    }
    const hits = PRODUCTS.filter(p =>
      [p.name, p.category, p.collection, p.fabric, p.tagline].join(' ').toLowerCase().includes(q) ||
      p.colors.some(c => c.name.toLowerCase().includes(q))
    );
    out.innerHTML = hits.length
      ? `<p class="eyebrow">${hits.length} ${hits.length === 1 ? 'piece' : 'pieces'}</p>
         <div class="grid grid--products">${hits.slice(0, 8).map(p => productCard(p)).join('')}</div>`
      : `<div class="empty"><p>Nothing matches “${esc(input.value)}”.</p>
         <p class="small">Try a fabric, a colour, or <a class="link" href="shop.html">browse everything</a>.</p></div>`;
  };
  input.addEventListener('input', render);
  render();
}

/* ------------------------------------------------------- Reserve drawer */
function reserveLineHtml(item) {
  const p = productById(item.productId);
  if (!p) return '';
  const color = p.colors.find(c => c.id === item.colorId) || p.colors[0];
  const units = stockFor(p.id, color.id, item.size);
  const label = stockLabel(units);
  return `
  <div class="res-item" data-key="${item.key}">
    <a href="${productUrl(p.id, color.id)}"><img src="${imgFor(p.id, color.id)}" alt="${esc(p.name)}" width="78" height="98" loading="lazy"></a>
    <div>
      <div class="res-item__top">
        <span class="res-item__name"><a href="${productUrl(p.id, color.id)}">${esc(p.name)}</a></span>
        <span class="card__price">${money(p.price * item.qty)}</span>
      </div>
      <div class="res-item__meta">${esc(color.name)} · Size ${esc(item.size)}</div>
      <div class="res-item__meta"><span class="stock ${label.cls}">${label.text}</span></div>
      <div class="res-item__actions">
        <span class="qty">
          <button data-qty="-1" aria-label="Reduce quantity">−</button>
          <span>${item.qty}</span>
          <button data-qty="1" aria-label="Increase quantity">+</button>
        </span>
        <button data-remove>Remove</button>
      </div>
    </div>
  </div>`;
}

function renderDrawer() {
  const body = $('#reserve-body');
  const foot = $('#reserve-foot');
  if (!body) return;
  const items = Reserve.read();
  if (!items.length) {
    body.innerHTML = `<div class="empty">${ICONS.hanger}
      <p>Your fitting room is empty.</p>
      <p class="small">Add pieces here and we will have them hanging in a room when you arrive.</p>
      <p style="margin-top:1.4rem"><a class="btn btn--ghost btn--sm" href="shop.html">Browse the floor</a></p></div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(reserveLineHtml).join('');
  foot.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:.35rem">
      <span class="tiny">Estimated total</span><span>${money(Reserve.total())}</span>
    </div>
    <p class="small muted" style="margin-bottom:1rem">Paid in store. Nothing is charged here.</p>
    <a class="btn btn--block" href="reserve.html">Hold these at Santa Ana</a>`;
}

document.addEventListener('click', e => {
  const row = e.target.closest('.res-item');
  if (!row) return;
  const key = row.dataset.key;
  if (e.target.closest('[data-remove]')) { Reserve.remove(key); return; }
  const q = e.target.closest('[data-qty]');
  if (q) {
    const item = Reserve.read().find(i => i.key === key);
    if (!item) return;
    const next = item.qty + Number(q.dataset.qty);
    if (next > item.qty && next > stockFor(item.productId, item.colorId, item.size)) {
      toast('That is everything we have on the floor in this size.');
      return;
    }
    Reserve.setQty(key, next);
  }
});

function syncBagCount() {
  const n = Reserve.count();
  $$('[data-bag-count]').forEach(el => {
    el.textContent = n;
    el.hidden = n === 0;
  });
}

document.addEventListener('reserve:change', () => {
  syncBagCount();
  renderDrawer();
  if (typeof window.onReserveChange === 'function') window.onReserveChange();
});

/* -------------------------------------------------------- Scroll reveal */
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach(el => io.observe(el));
}

/* ------------------------------------------------------------ Store bits */
function initStoreBits() {
  const today = new Date().getDay(); // 0 = Sunday
  const rowFor = d => (d === 0 ? 2 : d >= 5 ? 1 : 0);
  $$('[data-hours] tr').forEach((tr, i) => tr.classList.toggle('is-today', i === rowFor(today)));

  $$('[data-store-address]').forEach(el => { el.textContent = STORE.address; });
  $$('[data-store-phone]').forEach(el => { el.textContent = STORE.phone; el.href = STORE.phoneHref; });
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  $$('form[data-signup]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = $('input', form);
      if (!input.value.includes('@')) { toast('That email does not look right.'); return; }
      form.reset();
      toast('You are on the list. Look out for the opening invitation.');
    });
  });
}

/* ------------------------------------------------------------ Accordion */
function initAccordions() {
  $$('.acc__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc__item');
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initLayers();
  initSearch();
  initReveal();
  initStoreBits();
  initAccordions();
  syncBagCount();
  renderDrawer();
  if (typeof window.pageInit === 'function') window.pageInit();
});
