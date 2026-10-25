/* Injects a copy button into every .code-block on the page (course lesson
   pages) and copies that block's <code> text to the clipboard on click.
   Generated per block at runtime instead of written in markup, so a new
   code block never needs its own button added by hand. */
(function () {
  var COPY_ICON = '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="10" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 13V5.5A1.5 1.5 0 0 1 7 4h7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  var CHECK_ICON = '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5 L8 14.5 L16 5.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function showCopied(btn) {
    btn.innerHTML = CHECK_ICON;
    btn.classList.add('is-copied');
    setTimeout(function () {
      btn.innerHTML = COPY_ICON;
      btn.classList.remove('is-copied');
    }, 1500);
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

  // Text to copy: the block's code minus any .code-nocopy spans (shell
  // comments that would error if pasted into zsh), trailing spaces trimmed.
  function copyText(codeEl) {
    var clone = codeEl.cloneNode(true);
    clone.querySelectorAll('.code-nocopy').forEach(function (el) { el.remove(); });
    return clone.textContent.replace(/[ \t]+$/gm, '').trim();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.code-block').forEach(function (block) {
      var codeEl = block.querySelector('code');
      if (!codeEl) return;

      if (!copyText(codeEl)) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = COPY_ICON;
      block.appendChild(btn);

      btn.addEventListener('click', function () {
        var text = copyText(codeEl);
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
