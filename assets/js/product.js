/* Product detail: gallery, colourway + size selection against live floor stock. */
(function () {
  let product, color, size = null;

  function setColor(id) {
    color = product.colors.find(c => c.id === id) || product.colors[0];
    renderGallery();
    renderSwatches();
    if (size && stockFor(product.id, color.id, size) <= 0) size = null;
    renderSizes();
    renderCta();
    const q = new URLSearchParams(location.search);
    q.set('color', color.id);
    history.replaceState(null, '', `?${q}`);
  }

  function renderGallery() {
    $('#gallery').innerHTML = `
      <figure><img src="${imgFor(product.id, color.id)}" alt="${esc(product.name)} in ${esc(color.name)}" width="1000" height="1250"></figure>
      <figure><img src="assets/img/products/${product.id}--detail.svg" alt="${esc(product.fabric)} fabric detail" width="1000" height="1250" loading="lazy"></figure>
      <figure><img src="${imgFor(product.id, (product.colors[1] || product.colors[0]).id)}" alt="${esc(product.name)} alternate colourway" width="1000" height="1250" loading="lazy"></figure>`;
  }

  function renderSwatches() {
    $('#colour-name').textContent = color.name;
    $('#swatches').innerHTML = product.colors.map(c => `
      <button class="swatch-lg${c.id === color.id ? ' is-active' : ''}" style="background:${c.hex}"
              data-color="${c.id}" title="${esc(c.name)}" aria-label="${esc(c.name)}"
              aria-pressed="${c.id === color.id}"></button>`).join('');
  }

  function renderSizes() {
    $('#sizes').innerHTML = product.sizes.map(s => {
      const units = stockFor(product.id, color.id, s);
      const cls = units <= 0 ? '' : units <= 2 ? 'var(--low)' : 'var(--ok)';
      return `<button class="size-btn${s === size ? ' is-active' : ''}" data-size="${esc(s)}" ${units <= 0 ? 'disabled' : ''}
                title="${units <= 0 ? 'Not on the floor today' : units + ' in store'}">
                ${esc(s)}${units > 0 ? `<span class="dot" style="background:${cls}"></span>` : ''}
              </button>`;
    }).join('');

    const anyStock = product.sizes.some(s => stockFor(product.id, color.id, s) > 0);
    $('#size-note').innerHTML = anyStock
      ? `<span class="small muted">Dots show what is hanging in Santa Ana right now.</span>`
      : `<span class="stock stock--out">This colourway is off the floor — ask us to hold the next one.</span>`;
  }

  function renderCta() {
    const btn = $('#add-btn');
    const units = size ? stockFor(product.id, color.id, size) : 0;
    if (!size) {
      btn.textContent = 'Select a size';
      btn.disabled = true;
    } else {
      btn.disabled = false;
      btn.textContent = Reserve.has(product.id, color.id, size) ? 'In your fitting room — add another' : 'Hold this in my size';
    }
    const info = $('#stock-line');
    if (!size) {
      const total = totalStock(product);
      const l = stockLabel(total);
      info.className = `stock ${l.cls}`;
      info.textContent = total > 0 ? `${total} pieces across sizes at Santa Ana` : l.text;
    } else {
      const l = stockLabel(units);
      info.className = `stock ${l.cls}`;
      info.textContent = `Size ${size} · ${units > 0 ? `${units} on the floor` : 'not on the floor today'}`;
    }
  }

  function renderRelated() {
    const pool = PRODUCTS.filter(p => p.id !== product.id);
    const same = pool.filter(p => p.collection === product.collection);
    const list = (same.length >= 4 ? same : same.concat(pool)).slice(0, 4);
    $('#related').innerHTML = list.map(p => productCard(p)).join('');
  }

  function bind() {
    $('#swatches').addEventListener('click', e => {
      const b = e.target.closest('[data-color]');
      if (b) setColor(b.dataset.color);
    });
    $('#sizes').addEventListener('click', e => {
      const b = e.target.closest('[data-size]');
      if (!b || b.disabled) return;
      size = b.dataset.size;
      renderSizes();
      renderCta();
    });
    $('#add-btn').addEventListener('click', () => {
      if (!size) return;
      const held = Reserve.read().find(i => i.key === Reserve.key(product.id, color.id, size));
      if (held && held.qty >= stockFor(product.id, color.id, size)) {
        toast('That is every one we have in this size.');
        return;
      }
      Reserve.add(product.id, color.id, size);
      toast(`${product.name} · ${color.name} · ${size} held for 48 hours.`);
      renderCta();
      openLayer($('#reserve-drawer'));
    });
    window.onReserveChange = renderCta;
  }

  window.pageInit = function () {
    product = productById(param('id')) || PRODUCTS[0];
    color = product.colors.find(c => c.id === param('color')) || product.colors[0];

    document.title = `${product.name} — 0803`;
    $('#crumb-collection').textContent = collectionById(product.collection).name;
    $('#crumb-collection').href = `shop.html?collection=${product.collection}`;
    $('#crumb-name').textContent = product.name;
    $('#p-category').textContent = product.category;
    $('#p-name').textContent = product.name;
    $('#p-price').textContent = money(product.price);
    $('#p-tagline').textContent = product.tagline;
    $('#p-description').textContent = product.description;
    $('#p-fabric').textContent = product.fabric;
    $('#p-rise').textContent = product.rise;
    $('#p-care').textContent = product.care;
    $('#p-details').innerHTML = product.details.map(d => `<li>${esc(d)}</li>`).join('');
    if (product.badge) {
      $('#p-badge').textContent = product.badge;
      $('#p-badge').hidden = false;
    }

    renderGallery();
    renderSwatches();
    renderSizes();
    renderCta();
    renderRelated();
    bind();
    initAccordions();
    initReveal();
  };
})();
