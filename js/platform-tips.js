// Hover/focus cards for .platform-tip. The card is position: fixed so the
// table wrapper's overflow can't clip it.
(function () {
  var tips = document.querySelectorAll('.platform-tip');

  function show(tip) {
    var card = tip.querySelector('.platform-tip-card');
    if (!card) return;
    card.classList.add('is-open');
    var r = tip.getBoundingClientRect();
    var w = card.offsetWidth;
    var h = card.offsetHeight;
    var left = Math.min(Math.max(12, r.left), window.innerWidth - w - 12);
    var top = r.bottom + 8;
    if (top + h > window.innerHeight - 12) top = Math.max(12, r.top - h - 8);
    card.style.left = left + 'px';
    card.style.top = top + 'px';
  }

  function hide(tip) {
    var card = tip.querySelector('.platform-tip-card');
    if (card) card.classList.remove('is-open');
  }

  tips.forEach(function (tip) {
    tip.addEventListener('mouseenter', function () { show(tip); });
    tip.addEventListener('mouseleave', function () { hide(tip); });
    tip.addEventListener('focus', function () { show(tip); });
    tip.addEventListener('blur', function () { hide(tip); });
  });

  window.addEventListener('scroll', function () {
    tips.forEach(hide);
  }, { passive: true });
})();
