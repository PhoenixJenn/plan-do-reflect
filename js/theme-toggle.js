/* Wires up the .theme-switch swatch buttons. The initial theme is
   already applied by the inline script in <head> (before CSS loads,
   to avoid a flash of the wrong theme) — this file just handles
   clicks after the page is interactive. */
(function () {
  var THEMES = ['a', 'b', 'c'];

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-switch button').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-theme') === theme);
    });
    try {
      localStorage.setItem('pdr-theme', theme);
    } catch (e) {
      /* private browsing / storage disabled — theme just won't persist */
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'a';
    applyTheme(current);

    document.querySelectorAll('.theme-switch button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.getAttribute('data-theme'));
      });
    });
  });
})();
