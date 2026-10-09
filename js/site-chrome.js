/* Injects the shared site chrome -- top nav, footer, theme-switch, and the
   temporary title-font-picker -- into #site-topnav / #site-footer
   placeholders, so this markup lives in one file instead of being
   hand-copied across 260+ pages.

   Runs as a `defer` script, placed before theme-toggle.js and
   title-font-toggle.js in every page. `defer` guarantees the DOM is fully
   parsed before this script body runs (same guarantee DOMContentLoaded
   gives those two files internally), so the elements built here already
   exist by the time theme-toggle.js/title-font-toggle.js look for them on
   their own DOMContentLoaded handlers -- neither file needed to change.

   Deliberately NOT fetch()-based: opening a page directly via file://
   (this site's whole local-preview workflow -- no server needed) blocks
   fetch() of local files under CORS. The markup below lives as plain JS
   strings instead of a separate .html partial loaded over the network, so
   that workflow keeps working unchanged.

   Which top-nav item highlights active comes from `data-nav` on <body>
   (e.g. <body data-nav="self">), set once per page -- not guessed from
   the URL/folder, so a page can't mis-highlight just because of where it
   happens to live in the file tree. index.html has no data-nav (the
   homepage highlights nothing), matching the nav's original behavior. */
(function () {
  var NAV_ITEMS = [
    { section: 'framework', href: 'framework.html', label: 'The Framework' },
    { section: 'self', href: 'self-management.html', label: 'Self' },
    { section: 'leadership', href: 'leadership.html', label: 'Leadership' },
    { section: 'team', href: 'team.html', label: 'Team' },
    { section: 'organization', href: 'organization.html', label: 'Organization' },
    { section: 'core-skills', href: 'core-skills.html', label: 'Core Skills' },
    { section: 'references', href: 'references.html', label: 'References' }
  ];

  function buildTopnav(activeSection) {
    var items = NAV_ITEMS.map(function (item) {
      var cls = item.section === activeSection ? 'item active' : 'item';
      return '<a class="' + cls + '" href="' + item.href + '">' + item.label + '</a>';
    }).join('\n    ');
    return '<header class="topnav">\n' +
      '  <a class="logo" href="index.html">Plan·Do·Reflect</a>\n' +
      '  <nav class="topnav-items">\n    ' + items + '\n  </nav>\n' +
      '</header>';
  }

  function buildFooter() {
    return [
      '<footer class="site-footer">',
      '  <p>&copy; 2026 Plan-Do-Reflect. <a href="references.html">References &amp; further reading</a></p>',
      '</footer>',
      '',
      '<div class="theme-switch" role="group" aria-label="Style direction">',
      '  <button data-theme="a" title="Kinetic Signal — black &amp; yellow"></button>',
      '  <button data-theme="b" title="Studio Ledger — dusty rose"></button>',
      '  <button data-theme="c" title="Bright Margin — lime"></button>',
      '  <a class="icon-lib-link" href="icon-library.html" title="Style Guide (internal reference)">',
      '    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">',
      '      <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/>',
      '      <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor"/>',
      '      <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor"/>',
      '      <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor"/>',
      '    </svg>',
      '  </a>',
      '  <a class="icon-lib-link" href="notes.html" title="Notes (working drafts)">',
      '    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">',
      '      <rect x="2" y="1" width="10" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/>',
      '      <line x1="4.5" y1="5" x2="9.5" y2="5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
      '      <line x1="4.5" y1="7.5" x2="9.5" y2="7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
      '      <line x1="4.5" y1="10" x2="7.5" y2="10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
      '    </svg>',
      '  </a>',
      '  <a class="icon-lib-link" href="sitemap.html" title="Sitemap (working draft)">',
      '    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">',
      '      <circle cx="7" cy="2.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.3"/>',
      '      <circle cx="3" cy="11" r="1.8" fill="none" stroke="currentColor" stroke-width="1.3"/>',
      '      <circle cx="11" cy="11" r="1.8" fill="none" stroke="currentColor" stroke-width="1.3"/>',
      '      <path d="M7 4.3 L7 7 M7 7 L3 9.5 M7 7 L11 9.5" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/>',
      '    </svg>',
      '  </a>',
      '</div>',
      '',
      '<div class="title-font-picker">',
      '  <label for="title-font-select">Title font</label>',
      '  <button type="button" id="title-font-prev" class="title-font-nav" aria-label="Previous title font">‹</button>',
      '  <select id="title-font-select">',
      '    <optgroup label="Round 1 — headline character">',
      '      <option value="gabarito">Gabarito</option>',
      '      <option value="chivo">Chivo</option>',
      '    </optgroup>',
      '    <optgroup label="Round 2 — Calibri-adjacent">',
      '      <option value="golos-text">Golos Text</option>',
      '    </optgroup>',
      '    <option value="default">Theme default</option>',
      '  </select>',
      '  <button type="button" id="title-font-next" class="title-font-nav" aria-label="Next title font">›</button>',
      '</div>'
    ].join('\n');
  }

  var topnavEl = document.getElementById('site-topnav');
  if (topnavEl) topnavEl.outerHTML = buildTopnav(document.body.getAttribute('data-nav'));

  var footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.outerHTML = buildFooter();
})();
