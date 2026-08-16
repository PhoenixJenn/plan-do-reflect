/* Wires up the Why / What / How / When tab group in the homepage's
   explainer section (.explainer-tabs + .explainer-panels). Click a tab
   to swap in its panel; left/right arrow keys move between tabs too,
   per the standard ARIA tabs keyboard pattern. Homepage-only — this
   markup doesn't exist on other pages, so the selector queries just
   return nothing there and the script no-ops. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.explainer-tab'));
    if (!tabs.length) return;

    function activate(tab) {
      tabs.forEach(function (t) {
        var isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        t.setAttribute('tabindex', isActive ? '0' : '-1');
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !isActive;
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activate(tab);
      });

      tab.addEventListener('keydown', function (e) {
        var next;
        if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (next) {
          e.preventDefault();
          next.focus();
          activate(next);
        }
      });
    });
  });
})();
