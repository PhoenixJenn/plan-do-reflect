/* Wires up the .title-font-picker: the <select> and the ‹ › cycle buttons.
   Temporary — for brainstorming the main h1's font only, independent of
   the theme-switch. The initial choice is already applied by the inline
   script in <head> (before CSS loads, to avoid a flash) — this file just
   handles interaction after the page is interactive, and keeps all three
   controls (select, prev, next) in sync with each other.

   'golos-text' is the current default for first-time visitors (set by the
   inline <head> script) — 'default' now means "explicitly fall back to the
   theme's own heading font" and sits last in both the dropdown and this
   cycle order, rather than being the fallback itself.

   Remove this file, its <script> tag, the .title-font-picker markup, the
   "title-font experiment" CSS block in main.css, and the extra Google
   Fonts <link> in <head> once a title font is chosen and folded into
   tokens.css as --font-heading properly. */
(function () {
  var VALID_IDS = [
    'gabarito', 'chivo',
    'golos-text',
    'default'
  ];

  function currentId() {
    var attr = document.documentElement.getAttribute('data-title-font') || 'default';
    return VALID_IDS.indexOf(attr) > -1 ? attr : 'default';
  }

  function applyTitleFont(id) {
    if (VALID_IDS.indexOf(id) === -1) id = 'default';

    if (id === 'default') {
      document.documentElement.removeAttribute('data-title-font');
    } else {
      document.documentElement.setAttribute('data-title-font', id);
    }
    try {
      localStorage.setItem('pdr-title-font', id);
    } catch (e) {
      /* private browsing / storage disabled — choice just won't persist */
    }

    var select = document.getElementById('title-font-select');
    if (select && select.value !== id) select.value = id;
  }

  function step(delta) {
    var idx = VALID_IDS.indexOf(currentId());
    var next = (idx + delta + VALID_IDS.length) % VALID_IDS.length;
    applyTitleFont(VALID_IDS[next]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var select = document.getElementById('title-font-select');
    var prevBtn = document.getElementById('title-font-prev');
    var nextBtn = document.getElementById('title-font-next');

    applyTitleFont(currentId()); // sync select to whatever the inline <head> script already applied

    if (select) {
      select.addEventListener('change', function () {
        applyTitleFont(select.value);
      });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });
  });
})();
