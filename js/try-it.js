/* Copies the .try-it-prompt text into the clipboard when its .try-it-copy
   button is clicked, with brief "Copied!" feedback on the button itself.
   Uses innerText (not textContent) so a prompt built from <p>/<ul><li>
   (e.g. the Status Report prompt's formatting spec) copies with its line
   breaks intact instead of collapsing into one run-on line. */
(function () {
  function showCopied(btn) {
    var original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('is-copied');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('is-copied');
    }, 1800);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.try-it-copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-copy-target');
        var el = document.getElementById(targetId);
        if (!el) return;
        var text = (el.innerText || el.textContent).trim();

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            showCopied(btn);
          }, function () {
            fallbackCopy(text);
            showCopied(btn);
          });
        } else {
          fallbackCopy(text);
          showCopied(btn);
        }
      });
    });
  });
})();
