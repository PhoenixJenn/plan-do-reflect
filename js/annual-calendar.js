/* Fills in a .pi-calendar's year label and "Today" marker from the
   visitor's own clock, so the calendar always shows the current year
   instead of a hardcoded one. Looks for #pi-calendar-year and
   .pi-calendar-row[data-quarter], does nothing if neither exists. The
   label suffix comes from #pi-calendar-year's own data-label attribute
   (falls back to "Annual Calendar") so each page using this component
   can set its own title without editing this file. */
(function () {
  function init() {
    var yearEl = document.getElementById('pi-calendar-year');
    var now = new Date();
    var year = now.getFullYear();
    if (!yearEl) return;
    var label = yearEl.getAttribute('data-label') || 'Annual Calendar';
    yearEl.textContent = year + ' ' + label;

    var month = now.getMonth();
    var quarterIndex = Math.floor(month / 3);
    var quarterStart = new Date(year, quarterIndex * 3, 1);
    var quarterEnd = new Date(year, quarterIndex * 3 + 3, 1);
    var fraction = (now - quarterStart) / (quarterEnd - quarterStart);
    fraction = Math.max(0, Math.min(1, fraction));

    var row = document.querySelector('.pi-calendar-row[data-quarter="' + (quarterIndex + 1) + '"]');
    var bar = row && row.querySelector('.pi-calendar-bar');
    if (!bar) return;
    var marker = document.createElement('div');
    marker.className = 'pi-calendar-today';
    marker.style.left = (fraction * 100) + '%';
    bar.appendChild(marker);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
