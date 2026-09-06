/* The reserve page: a printable hold list for the Santa Ana floor. */
(function () {
  function render() {
    const items = Reserve.read();
    const list = $('#res-list');
    const summary = $('#res-summary');

    if (!items.length) {
      list.innerHTML = `<div class="empty">${ICONS.hanger}
        <p>Nothing held yet.</p>
        <p class="small">Pick a size on any piece and it will appear here, ready for a fitting room.</p>
        <p style="margin-top:1.6rem"><a class="btn btn--ghost btn--sm" href="shop.html">Browse the floor</a></p></div>`;
      summary.hidden = true;
      $('#res-split').classList.add('is-empty');
      return;
    }
    summary.hidden = false;
    $('#res-split').classList.remove('is-empty');
    list.innerHTML = items.map(reserveLineHtml).join('');
    $('#res-count').textContent = `${Reserve.count()} ${Reserve.count() === 1 ? 'piece' : 'pieces'}`;
    $('#res-total').textContent = money(Reserve.total());

    $('#res-plain').value = items.map(i => {
      const p = productById(i.productId);
      const c = p.colors.find(x => x.id === i.colorId);
      return `${i.qty} × ${p.name} — ${c.name}, size ${i.size} (${money(p.price)})`;
    }).join('\n') + `\n\nTotal: ${money(Reserve.total())}\nHold at 0803, ${STORE.address}`;
  }

  window.pageInit = function () {
    render();
    window.onReserveChange = render;

    $('#res-print').addEventListener('click', () => window.print());

    $('#res-copy').addEventListener('click', async () => {
      const text = $('#res-plain').value;
      try {
        await navigator.clipboard.writeText(text);
        toast('List copied. Text or email it to yourself.');
      } catch (e) {
        $('#res-plain').hidden = false;
        $('#res-plain').select();
        toast('Select and copy the list below.');
      }
    });

    $('#res-clear').addEventListener('click', () => {
      if (!Reserve.count()) return;
      Reserve.clear();
      toast('Fitting room emptied.');
    });

    $('#hold-form').addEventListener('submit', e => {
      e.preventDefault();
      if (!Reserve.count()) { toast('Add a piece first.'); return; }
      const name = $('#hold-name').value.trim();
      $('#hold-form').hidden = true;
      $('#hold-done').hidden = false;
      $('#hold-done-name').textContent = name ? name.split(' ')[0] : 'you';
      $('#hold-done-until').textContent = new Date(Date.now() + 48 * 3600 * 1000)
        .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      window.scrollTo({ top: $('#hold-done').getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
    });
  };
})();
