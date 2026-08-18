/* Wires up .framework-item.is-accordion sections (used on content-dense
   pages like project-program-management.html) — click a .fw-toggle to
   show/hide its .fw-body. Jumping straight to a section via URL hash or
   a sidebar anchor auto-expands it, so the target isn't hidden collapsed.
   Also wires up standalone .try-it-inline-toggle buttons (a nested Try It
   prompt inside a section, e.g. Project Charter) — collapsed independently
   of the parent section's own open/closed state.
   No-ops on pages without this markup. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.framework-item.is-accordion'));
    if (!items.length) return;

    function setOpen(item, open) {
      item.classList.toggle('is-open', open);
      var btn = item.querySelector('.fw-toggle');
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    items.forEach(function (item) {
      var btn = item.querySelector('.fw-toggle');
      if (!btn) return;
      btn.addEventListener('click', function () {
        setOpen(item, !item.classList.contains('is-open'));
      });
    });

    var tryItToggles = Array.prototype.slice.call(document.querySelectorAll('.try-it-inline-toggle'));
    tryItToggles.forEach(function (btn) {
      var collapse = document.getElementById(btn.getAttribute('aria-controls'));
      if (!collapse) return;
      btn.addEventListener('click', function () {
        var open = !collapse.classList.contains('is-open');
        collapse.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    function openFromHash() {
      var hash = window.location.hash;
      if (!hash) return;
      var target;
      try { target = document.querySelector(hash); } catch (e) { return; }
      if (target && target.classList.contains('framework-item')) {
        setOpen(target, true);
        target.scrollIntoView();
      }
    }

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  });
})();
