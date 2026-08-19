/* Wires up .framework-item.is-accordion sections (used on content-dense
   pages like project-program-management.html) — click a .fw-toggle to
   show/hide its .fw-body. Jumping straight to a section via URL hash or
   a sidebar anchor auto-expands it, so the target isn't hidden collapsed —
   including when the hash targets a sub-section anchor nested inside a
   merged item (e.g. #critical-path inside "The Project Plan"), which
   climbs to the nearest .framework-item ancestor before opening it.
   Also wires up standalone .try-it-inline-toggle buttons (a nested Try It
   prompt inside a section, e.g. Project Charter) and the generic
   .inline-toggle (any other optional/deeper content tucked away by
   default, e.g. the enterprise risk framework inside Risk Management) —
   both collapse independently of the parent section's own open/closed
   state, sharing the same toggle handler.
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

    var collapseAllBtn = document.querySelector('.collapse-all-btn');
    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', function () {
        items.forEach(function (item) { setOpen(item, false); });
      });
    }

    var inlineToggles = Array.prototype.slice.call(document.querySelectorAll('.try-it-inline-toggle, .inline-toggle'));
    inlineToggles.forEach(function (btn) {
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
      if (!target) return;
      // The hash target may be a sub-section anchor nested inside a
      // merged framework-item (e.g. #critical-path inside "The Project
      // Plan") rather than a framework-item itself — climb to the
      // nearest one so its parent section opens too.
      var item = target.classList.contains('framework-item') ? target : target.closest('.framework-item');
      if (item) setOpen(item, true);
      // The hash target may also be a collapse itself (e.g. a page-level
      // "Try It" quicklink pointing straight at #charter-try-it-collapse) —
      // open it directly instead of leaving it collapsed under its toggle.
      if (target.classList.contains('try-it-collapse') || target.classList.contains('inline-collapse')) {
        target.classList.add('is-open');
        var toggleBtn = document.querySelector('[aria-controls="' + target.id + '"]');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      }
      target.scrollIntoView();
    }

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  });
})();
