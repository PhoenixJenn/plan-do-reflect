/* Fills in a .pi-calendar's year label, quarter month-labels, and "Today"
   marker, and wires up its Year / FY-start-month pickers so the whole
   thing recomputes for any fiscal calendar, not just a January-start one.
   Looks for #pi-calendar-year, #pi-calendar-year-select,
   #pi-calendar-fy-select, and .pi-calendar-row[data-quarter] — does
   nothing if the calendar isn't on the page. The year label's suffix
   comes from #pi-calendar-year's own data-label attribute (falls back to
   "Annual Calendar") so each page using this component can set its own
   title without editing this file. */
(function () {
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function formatQuarterLabel(year, fyStartMonth, q) {
    var startAbs = fyStartMonth + q * 3;
    var endAbs = startAbs + 2;
    var startMonth = startAbs % 12;
    var endMonth = endAbs % 12;
    var startYear = year + Math.floor(startAbs / 12);
    var endYear = year + Math.floor(endAbs / 12);

    if (fyStartMonth === 0) {
      return MONTHS[startMonth] + '–' + MONTHS[endMonth];
    }
    if (startYear === endYear) {
      return MONTHS[startMonth] + '–' + MONTHS[endMonth] + " '" + String(startYear).slice(-2);
    }
    return MONTHS[startMonth] + " '" + String(startYear).slice(-2) + '–' + MONTHS[endMonth] + " '" + String(endYear).slice(-2);
  }

  function clearTodayMarkers() {
    var markers = document.querySelectorAll('.pi-calendar-today');
    for (var i = 0; i < markers.length; i++) markers[i].parentNode.removeChild(markers[i]);
  }

  function renderCalendar(year, fyStartMonth) {
    for (var q = 0; q < 4; q++) {
      var row = document.querySelector('.pi-calendar-row[data-quarter="' + (q + 1) + '"]');
      if (!row) continue;
      var monthsEl = row.querySelector('.pi-calendar-months');
      if (monthsEl) monthsEl.textContent = formatQuarterLabel(year, fyStartMonth, q);
    }

    clearTodayMarkers();

    var now = new Date();
    var fyStart = new Date(year, fyStartMonth, 1);
    var fyEnd = new Date(year, fyStartMonth + 12, 1);
    if (now < fyStart || now >= fyEnd) return;

    var monthsSinceStart = (now.getFullYear() - year) * 12 + (now.getMonth() - fyStartMonth);
    var q = Math.floor(monthsSinceStart / 3);
    if (q < 0 || q > 3) return;

    var qStart = new Date(year, fyStartMonth + q * 3, 1);
    var qEnd = new Date(year, fyStartMonth + (q + 1) * 3, 1);
    var fraction = (now - qStart) / (qEnd - qStart);
    fraction = Math.max(0, Math.min(1, fraction));

    var row = document.querySelector('.pi-calendar-row[data-quarter="' + (q + 1) + '"]');
    var bar = row && row.querySelector('.pi-calendar-bar');
    if (!bar) return;
    var marker = document.createElement('div');
    marker.className = 'pi-calendar-today';
    marker.style.left = (fraction * 100) + '%';
    bar.appendChild(marker);
  }

  function init() {
    var yearEl = document.getElementById('pi-calendar-year');
    if (!yearEl) return;
    var label = yearEl.getAttribute('data-label') || 'Annual Calendar';

    var yearSelect = document.getElementById('pi-calendar-year-select');
    var fySelect = document.getElementById('pi-calendar-fy-select');
    var currentYear = new Date().getFullYear();

    if (fySelect && !fySelect.options.length) {
      for (var m = 0; m < 12; m++) {
        var opt = document.createElement('option');
        opt.value = m;
        opt.textContent = MONTH_NAMES[m];
        fySelect.appendChild(opt);
      }
    }

    if (yearSelect && !yearSelect.options.length) {
      for (var y = currentYear - 2; y <= currentYear + 3; y++) {
        var yOpt = document.createElement('option');
        yOpt.value = y;
        yOpt.textContent = y;
        if (y === currentYear) yOpt.selected = true;
        yearSelect.appendChild(yOpt);
      }
    }

    function currentSelection() {
      var year = yearSelect ? parseInt(yearSelect.value, 10) : currentYear;
      var fyStartMonth = fySelect ? parseInt(fySelect.value, 10) : 0;
      if (isNaN(year)) year = currentYear;
      if (isNaN(fyStartMonth)) fyStartMonth = 0;
      return { year: year, fyStartMonth: fyStartMonth };
    }

    function update() {
      var sel = currentSelection();
      yearEl.textContent = sel.year + ' ' + label;
      renderCalendar(sel.year, sel.fyStartMonth);
    }

    if (yearSelect) yearSelect.addEventListener('change', update);
    if (fySelect) fySelect.addEventListener('change', update);

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
