document.addEventListener('DOMContentLoaded', () => {
      // SVG icons
      const copySVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>';
      const okSVG   = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';

      // 1) Wrap pre.cmd into .cmd-row when needed & add a single copy button
      document.querySelectorAll('pre.cmd').forEach(pre => {
        const codeEl = pre.querySelector('code') || pre;
        let wrapper = pre.parentElement;
        if (!wrapper || !wrapper.classList || !wrapper.classList.contains('cmd-row')) {
          wrapper = document.createElement('div');
          wrapper.className = 'cmd-row';
          pre.parentNode.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);
        }
        // avoid duplicates
        if (wrapper.querySelector('.copy-btn')) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.innerHTML = copySVG + ' Copier';
        wrapper.appendChild(btn);

        btn.addEventListener('click', async () => {
          const text = (codeEl.innerText || codeEl.textContent || '').trim();
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(text);
            } else {
              const ta = document.createElement('textarea');
              ta.value = text;
              ta.style.position = 'fixed';
              ta.style.left = '-9999px';
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
            }
            btn.classList.add('copied');
            btn.innerHTML = okSVG + ' Copié !';
            setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = copySVG + ' Copier'; }, 1600);
          } catch (err) {
            console.error('Copy failed', err);
          }
        });
      });

      // 2) Now highlight all code blocks using 
Prism
      if (window.Prism && typeof Prism.highlightAll === 'function') {
        Prism.highlightAll();
      } else {
        console.warn('Prism not available or highlightAll missing');
      }
    });