/* Progressive enhancement for references.html. Without JS the page is a plain, fully linked list. */
(function () {
  'use strict';
  var cats = [].slice.call(document.querySelectorAll('.rf-cat'));
  var research = document.getElementById('research');
  var navItems = [].slice.call(document.querySelectorAll('.rf-nav-item'));
  var q = document.getElementById('rf-q'), sortSel = document.getElementById('rf-sort');
  var status = document.getElementById('rf-status'), empty = document.getElementById('rf-empty');
  var active = 'all';

  /* covers: use the locally saved file; fall back to the remote image once if it has not been downloaded yet */
  [].forEach.call(document.querySelectorAll('img.rf-cover'), function (img) {
    img.addEventListener('error', function () {
      var r = img.getAttribute('data-remote');
      if (r && img.src.indexOf(r) === -1) { img.src = r; } else { img.style.visibility = 'hidden'; }
    });
  });

  /* description clamp: only offer "Read more" when the text is actually cut off */
  function setupMore() {
    [].forEach.call(document.querySelectorAll('.rf-desc'), function (d) {
      var p = d.querySelector('p'), b = d.querySelector('.rf-more');
      if (!p || !b || d.offsetParent === null) return;
      b.hidden = !(d.classList.contains('open') || p.scrollHeight > p.clientHeight + 2);
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.rf-more'); if (!b) return;
    var d = b.closest('.rf-desc'); d.classList.toggle('open');
    b.textContent = d.classList.contains('open') ? 'Show less' : 'Read more';
  });

  function sortCards() {
    var mode = sortSel.value;
    cats.forEach(function (sec) {
      var grid = sec.querySelector('.rf-grid');
      if (!grid.__orig) grid.__orig = [].slice.call(grid.children);
      var list = grid.__orig.slice();
      if (mode === 'rating') list.sort(function (a, b) { return (+b.dataset.rating) - (+a.dataset.rating); });
      else if (mode === 'title') list.sort(function (a, b) { return a.dataset.title.localeCompare(b.dataset.title); });
      else if (mode === 'year') list.sort(function (a, b) { return (+b.dataset.year || 0) - (+a.dataset.year || 0); });
      list.forEach(function (c) { grid.appendChild(c); });
    });
  }

  function apply() {
    var term = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
    cats.forEach(function (sec) {
      var inCat = active === 'all' || active === sec.dataset.cat, any = 0;
      [].forEach.call(sec.querySelectorAll('.rf-card'), function (card) {
        var ok = term.every(function (t) { return card.dataset.text.indexOf(t) > -1; });
        card.hidden = !ok; if (ok) any++;
      });
      sec.hidden = !inCat || !any;
      if (inCat) shown += any;
    });
    research.hidden = !(active === 'all' || active === 'research') || term.length > 0;
    empty.hidden = shown > 0 || active === 'research';
    status.textContent = active === 'research' ? '' : shown + (shown === 1 ? ' book' : ' books');
    navItems.forEach(function (n) { n.classList.toggle('active', n.dataset.cat === active); });
    setupMore();
  }

  function go(cat, scroll) {
    active = cat; apply();
    if (scroll) { var top = document.querySelector('.rf-main'); if (top) top.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  navItems.forEach(function (n) {
    n.addEventListener('click', function (e) { e.preventDefault(); history.replaceState(null, '', '#' + (n.dataset.cat === 'all' ? 'all' : (n.dataset.cat === 'research' ? 'research' : 'cat-' + n.dataset.cat))); go(n.dataset.cat, true); });
  });
  q.addEventListener('input', apply);
  sortSel.addEventListener('change', function () { sortCards(); apply(); });
  window.addEventListener('resize', setupMore);

  var h = location.hash.replace('#', '');
  if (h.indexOf('cat-') === 0) active = h.slice(4); else if (h === 'research') active = 'research';
  apply();
  window.addEventListener('load', setupMore);
})();
