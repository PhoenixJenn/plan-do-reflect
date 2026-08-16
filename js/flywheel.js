/* Wires up the Plan / Do / Reflect buttons under the homepage's flywheel
   graphic (.flywheel-stages + #flywheel-caption). Clicking a stage dims every
   other [data-stage] group inside whichever style-direction SVG is currently
   showing and brings the clicked one to full opacity, then swaps in a
   one-line caption. Works no matter which theme is active or gets switched
   to afterward, since all three SVGs carry the same [data-stage] markers and
   this just toggles a class on all matches at once.

   The small dot orbiting the ring is a separate, always-on effect (native SVG
   animateTransform in the markup itself) — this file doesn't touch it. */
(function () {
  var CAPTIONS = {
    plan: 'Set your direction and define what success looks like before you start.',
    do: 'Execute with intention. Notice what is actually happening, not what you assumed would happen.',
    reflect: 'Pause and ask what worked, what did not, and what to change next time around.'
  };

  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.flywheel-interactive');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.flywheel-stage'));
    var caption = document.getElementById('flywheel-caption');
    if (!wrap || !buttons.length || !caption) return;

    function select(stage) {
      buttons.forEach(function (btn) {
        var isActive = btn.getAttribute('data-stage') === stage;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      document.querySelectorAll('.fw-wedge').forEach(function (el) {
        el.classList.toggle('is-highlighted', el.getAttribute('data-stage') === stage);
      });
      if (CAPTIONS[stage]) caption.textContent = CAPTIONS[stage];
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        select(btn.getAttribute('data-stage'));
      });
    });

    select('plan');
    /* Only start dimming non-selected wedges once JS has actually run, so a
       failed/slow script load never leaves every wedge stuck half-opacity
       with nothing highlighted. */
    wrap.classList.add('is-ready');
  });
})();
