/* Toggles which worked example's content is visible on a page — currently
   product-management.html (iPod, RouteWise). Fully generic: reads whatever
   [data-pm-example] buttons and [data-example] content blocks exist in the
   DOM, so adding a new example requires no changes here. */
(function () {
  var STORAGE_KEY = 'pdr-pm-example';

  function applyExample(example) {
    document.querySelectorAll('[data-example]').forEach(function (el) {
      el.style.display = el.getAttribute('data-example') === example ? '' : 'none';
    });
    document.querySelectorAll('.example-switch button[data-pm-example]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-pm-example') === example;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    try { localStorage.setItem(STORAGE_KEY, example); } catch (e) {}
  }

  function init() {
    var switcher = document.querySelector('.example-switch');
    if (!switcher) return;
    var buttons = switcher.querySelectorAll('button[data-pm-example]');
    if (!buttons.length) return;
    var valid = Array.prototype.map.call(buttons, function (b) { return b.getAttribute('data-pm-example'); });

    var saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var initial = (saved && valid.indexOf(saved) > -1) ? saved : valid[0];
    applyExample(initial);

    switcher.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-pm-example]');
      if (!btn) return;
      applyExample(btn.getAttribute('data-pm-example'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
