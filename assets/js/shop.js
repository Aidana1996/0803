/* Shop grid: filtering, sorting and URL state. */
(function () {
  const state = {
    collections: new Set(),
    categories: new Set(),
    sizes: new Set(),
    colors: new Set(),
    inStockOnly: false,
    sort: 'featured'
  };

  const ALL_CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))].sort();
  const ALL_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'S/M', 'L/XL'];
  const ALL_COLORS = (() => {
    const map = new Map();
    PRODUCTS.forEach(p => p.colors.forEach(c => { if (!map.has(c.id)) map.set(c.id, c); }));
    return [...map.values()];
  })();

  function readUrl() {
    const q = new URLSearchParams(location.search);
    (q.get('collection') || '').split(',').filter(Boolean).forEach(v => state.collections.add(v));
    (q.get('category') || '').split(',').filter(Boolean).forEach(v => state.categories.add(v));
    (q.get('size') || '').split(',').filter(Boolean).forEach(v => state.sizes.add(v));
    (q.get('color') || '').split(',').filter(Boolean).forEach(v => state.colors.add(v));
    if (q.get('instock') === '1') state.inStockOnly = true;
    if (q.get('sort')) state.sort = q.get('sort');
  }

  function writeUrl() {
    const q = new URLSearchParams();
    if (state.collections.size) q.set('collection', [...state.collections].join(','));
    if (state.categories.size) q.set('category', [...state.categories].join(','));
    if (state.sizes.size) q.set('size', [...state.sizes].join(','));
    if (state.colors.size) q.set('color', [...state.colors].join(','));
    if (state.inStockOnly) q.set('instock', '1');
    if (state.sort !== 'featured') q.set('sort', state.sort);
    const qs = q.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }

  function matches(p) {
    if (state.collections.size && !state.collections.has(p.collection)) return false;
    if (state.categories.size && !state.categories.has(p.category)) return false;
    if (state.colors.size && !p.colors.some(c => state.colors.has(c.id))) return false;
    if (state.sizes.size) {
      const has = p.sizes.some(s => state.sizes.has(s) &&
        p.colors.some(c => stockFor(p.id, c.id, s) > 0));
      if (!has) return false;
    }
    if (state.inStockOnly && totalStock(p) <= 0) return false;
    return true;
  }

  const RANK = { 'Best seller': 0, 'New': 1 };
  function sorted(list) {
    const out = list.slice();
    switch (state.sort) {
      case 'price-asc':  out.sort((a, b) => a.price - b.price); break;
      case 'price-desc': out.sort((a, b) => b.price - a.price); break;
      case 'new':        out.sort((a, b) => (a.badge === 'New' ? 0 : 1) - (b.badge === 'New' ? 0 : 1)); break;
      case 'popular':    out.sort((a, b) => (a.badge === 'Best seller' ? 0 : 1) - (b.badge === 'Best seller' ? 0 : 1)); break;
      case 'stock':      out.sort((a, b) => totalStock(b) - totalStock(a)); break;
      default:           out.sort((a, b) => (RANK[a.badge] ?? 2) - (RANK[b.badge] ?? 2));
    }
    return out;
  }

  function countFor(predicate) {
    return PRODUCTS.filter(predicate).length;
  }

  function renderFilters() {
    const groups = [
      { key: 'collections', title: 'Collection', items: COLLECTIONS.map(c => ({ v: c.id, label: c.name, n: countFor(p => p.collection === c.id) })) },
      { key: 'categories', title: 'Category', items: ALL_CATEGORIES.map(c => ({ v: c, label: c, n: countFor(p => p.category === c) })) },
      { key: 'sizes', title: 'Size', items: ALL_SIZES.filter(s => PRODUCTS.some(p => p.sizes.includes(s))).map(s => ({ v: s, label: s, n: countFor(p => p.sizes.includes(s)) })) },
      { key: 'colors', title: 'Colour', items: ALL_COLORS.map(c => ({ v: c.id, label: c.name, n: countFor(p => p.colors.some(x => x.id === c.id)), hex: c.hex })) }
    ];
    $('#filter-body').innerHTML = `
      <div class="filter-group">
        <h4>Availability</h4>
        <label class="check"><input type="checkbox" data-instock ${state.inStockOnly ? 'checked' : ''}>
          <span>On the floor today</span></label>
      </div>
      ${groups.map(g => `
      <div class="filter-group">
        <h4>${g.title}</h4>
        ${g.items.map(i => `
          <label class="check">
            <input type="checkbox" data-group="${g.key}" value="${esc(i.v)}" ${state[g.key].has(i.v) ? 'checked' : ''}>
            ${i.hex ? `<span class="swatch" style="background:${i.hex};pointer-events:none"></span>` : ''}
            <span>${esc(i.label)}</span><span class="count">${i.n}</span>
          </label>`).join('')}
      </div>`).join('')}`;
  }

  function renderChips() {
    const active = [
      ...[...state.collections].map(v => ({ group: 'collections', v, label: (collectionById(v) || {}).name || v })),
      ...[...state.categories].map(v => ({ group: 'categories', v, label: v })),
      ...[...state.sizes].map(v => ({ group: 'sizes', v, label: `Size ${v}` })),
      ...[...state.colors].map(v => ({ group: 'colors', v, label: (ALL_COLORS.find(c => c.id === v) || {}).name || v }))
    ];
    if (state.inStockOnly) active.push({ group: 'instock', v: '1', label: 'On the floor today' });
    const box = $('#active-chips');
    box.innerHTML = active.length
      ? active.map(a => `<button class="chip is-active" data-remove-chip data-group="${a.group}" data-value="${esc(a.v)}">${esc(a.label)} ✕</button>`).join('')
        + '<button class="chip chip--clear" data-clear-all>Clear all</button>'
      : '';
  }

  function render() {
    const list = sorted(PRODUCTS.filter(matches));
    const grid = $('#shop-grid');
    grid.innerHTML = list.length
      ? list.map(p => productCard(p)).join('')
      : `<div class="empty" style="grid-column:1/-1">
           <p>Nothing on the floor matches that combination.</p>
           <p class="small">Loosen a filter, or <a class="link" href="visit.html#appointments">ask us to source it</a>.</p>
         </div>`;
    $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
    renderChips();
    writeUrl();
    const title = state.collections.size === 1 ? collectionById([...state.collections][0]) : null;
    if (title) {
      $('#shop-title').textContent = title.name;
      $('#shop-lede').textContent = title.description;
      $('#shop-eyebrow').textContent = title.tagline;
    }
  }

  function bind() {
    $('#filter-body').addEventListener('change', e => {
      const cb = e.target;
      if (cb.dataset.instock !== undefined) { state.inStockOnly = cb.checked; render(); return; }
      const g = cb.dataset.group;
      if (!g) return;
      cb.checked ? state[g].add(cb.value) : state[g].delete(cb.value);
      render();
    });

    $('#active-chips').addEventListener('click', e => {
      const clear = e.target.closest('[data-clear-all]');
      if (clear) {
        state.collections.clear(); state.categories.clear();
        state.sizes.clear(); state.colors.clear();
        state.inStockOnly = false;
        renderFilters(); render(); return;
      }
      const chip = e.target.closest('[data-remove-chip]');
      if (!chip) return;
      if (chip.dataset.group === 'instock') state.inStockOnly = false;
      else state[chip.dataset.group].delete(chip.dataset.value);
      renderFilters(); render();
    });

    $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });

    $$('[data-quick-collection]').forEach(btn => btn.addEventListener('click', () => {
      const v = btn.dataset.quickCollection;
      state.collections.clear();
      if (v) state.collections.add(v);
      renderFilters(); render();
      $('#shop-title').textContent = v ? collectionById(v).name : 'Everything';
      $('#shop-lede').textContent = v ? collectionById(v).description
        : 'The full floor at 2590 Red Hill Avenue — every piece, every colourway, with what is physically in stock today.';
      $('#shop-eyebrow').textContent = v ? collectionById(v).tagline : 'The whole rack';
      $$('[data-quick-collection]').forEach(b => b.classList.toggle('is-active', b === btn));
    }));

    $('[data-open="filters"]').addEventListener('click', () => openLayer($('#filters')));
  }

  window.pageInit = function () {
    readUrl();
    renderFilters();
    bind();
    $('#sort').value = state.sort;
    if (state.collections.size === 1) {
      const active = $(`[data-quick-collection="${[...state.collections][0]}"]`);
      if (active) { $$('[data-quick-collection]').forEach(b => b.classList.remove('is-active')); active.classList.add('is-active'); }
    }
    render();
  };
})();
