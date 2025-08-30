// js/loader.js (version corrigée — remplace l'ancien)
// - injecte deux clones du template#code-template pour boucle fluide
// - colore via Prism.highlightElement (retry si Prism pas prêt)
// - n'enlève le loader QUE sur mobile (<=486px) et uniquement après window.load
// - sur desktop/tablette (>486px) le loader reste bloquant et affiche un message
// - respecte prefers-reduced-motion
(function () {
  'use strict';

  // ---------- CONFIG ----------
  const MOBILE_MAX_PX = 486;
  const PRISM_RETRY_COUNT = 30;
  const PRISM_RETRY_DELAY = 80;
  const FADE_OUT_MS = 420;         // correspondre à la transition CSS
  const SAFETY_TIMEOUT_MS = 12000; // fallback si load ne se déclenche pas
  const LOG_PREFIX = '[loader]';

  // ---------- HELPERS ----------
  function log(...args) { if (window && window.console) console.log(LOG_PREFIX, ...args); }
  function warn(...args) { if (window && window.console) console.warn(LOG_PREFIX, ...args); }

  // ---------- SELECTEURS & ETAT ----------
  const loaderEl = document.getElementById('site-loader');
  const scrollWindowEl = document.getElementById('scroll-window');
  const linesContainer = document.getElementById('lines-container');
  const templateEl = document.getElementById('code-template');
  const loaderMessage = document.getElementById('loader-message');
  const bodyEl = document.body;

  if (!loaderEl) {
    warn('#site-loader introuvable — initialisation du loader arrêtée.');
    return;
  }

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`);

  let initialized = false;
  let prismRetryTimer = null;
  let loadListener = null;
  let mqListener = null;
  let safetyTimer = null;
  let hidden = false;

  // ---------- Prism highlight avec retry ----------
  function attemptPrismHighlight(wrapper, triesLeft = PRISM_RETRY_COUNT) {
    if (!wrapper) return;
    if (window.Prism && typeof Prism.highlightElement === 'function') {
      try {
        const codes = wrapper.querySelectorAll('pre > code, code[class*="language-"]');
        codes.forEach(c => {
          try { Prism.highlightElement(c); } catch (e) { /* non fatal */ }
        });
        log('Prism highlight appliqué sur', codes.length, 'élément(s).');
      } catch (e) { /* ignore */ }
      return;
    }
    if (triesLeft <= 0) {
      warn('Prism indisponible après retries — continuer sans coloration.');
      return;
    }
    prismRetryTimer = setTimeout(() => attemptPrismHighlight(wrapper, triesLeft - 1), PRISM_RETRY_DELAY);
  }

  // ---------- Injection des lignes (A/B) ----------
  function prepareLines() {
    if (!templateEl || !linesContainer) {
      warn('template ou linesContainer manquant — injection sautée.');
      return;
    }
    if (initialized) return;

    const frag = templateEl.content.cloneNode(true);
    const pre = frag.querySelector('pre');
    if (!pre) {
      warn('template ne contient pas <pre> — vérifie le template.');
      return;
    }

    const preA = pre.cloneNode(true);
    const preB = pre.cloneNode(true);

    const wrapper = document.createElement('div');
    wrapper.className = 'lines-wrapper';
    wrapper.appendChild(preA);
    wrapper.appendChild(preB);

    linesContainer.innerHTML = '';
    linesContainer.appendChild(wrapper);

    attemptPrismHighlight(wrapper);

    if (!reducedMotion) wrapper.classList.add('animated');

    initialized = true;
    log('injection du code effectuée, animation démarrée (reducedMotion=', reducedMotion, ')');
  }

  // ---------- Cacher le loader (fade out) ----------
  function hideLoader() {
    if (hidden) return;
    hidden = true;

    if (prismRetryTimer) { clearTimeout(prismRetryTimer); prismRetryTimer = null; }
    if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }

    loaderEl.classList.add('loader-hidden');
    loaderEl.setAttribute('aria-hidden', 'true');
    bodyEl.classList.remove('loader-active');

    log('hideLoader -> classe loader-hidden ajoutée');

    // retire du flow après transition
    setTimeout(() => {
      try { loaderEl.style.display = 'none'; } catch (e) { /* ignore */ }
      log('loader retiré du flow (display:none)');
      // focus accessibilité
      const focusTarget = document.querySelector('main h1, h1, header a');
      if (focusTarget) {
        try { focusTarget.setAttribute('tabindex', '-1'); focusTarget.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      }
    }, FADE_OUT_MS + 20);
  }

  // ---------- Afficher message bloquant pour grands écrans ----------
  function showBlockingLarge() {
    // rendre visible/blocking
    loaderEl.style.display = 'flex';
    loaderEl.classList.remove('loader-hidden');
    loaderEl.setAttribute('aria-hidden', 'false');
    bodyEl.classList.add('loader-active');

    // masquer la zone de scroll si besoin (CSS may also do it)
    if (scrollWindowEl) scrollWindowEl.style.display = '';

    if (loaderMessage) {
      loaderMessage.textContent = "⚠️ Ce site n'est pas accessible sur un écran de plus de 486px (PC et Tablette). Réduis la largeur de la fenêtre puis recharge la page ou utilise un téléphone.";
      loaderMessage.setAttribute('aria-hidden', 'false');
    }

    // si un load listener était attaché pour mobile, on le détache
    if (loadListener) {
      window.removeEventListener('load', loadListener);
      loadListener = null;
    }

    log('overlay bloquant affiché pour écran large.');
  }

  // ---------- Flux mobile : préparer et cacher après load ----------
  function handleMobileFlow() {
    // rendre visible
    loaderEl.style.display = 'flex';
    loaderEl.classList.remove('loader-hidden');
    loaderEl.setAttribute('aria-hidden', 'false');
    bodyEl.classList.add('loader-active');

    if (scrollWindowEl) scrollWindowEl.style.display = '';
    if (document.querySelector('.term-title')) document.querySelector('.term-title').style.display = '';

    // injecter si possible
    prepareLines();

    // SI la page est déjà complètement chargée (script exécuté après load)
    if (document.readyState === 'complete') {
      // petite latence pour laisser l'utilisateur percevoir le loader avant disparition
      setTimeout(hideLoader, 160);
      log('document.readyState === complete -> hideLoader appelé immédiatement (mobile).');
      return;
    }

    // Sinon attacher le listener load (une seule fois)
    if (!loadListener) {
      loadListener = function onWindowLoad() {
        // sécurité: retirer le listener dès qu'il s'active
        try { window.removeEventListener('load', onWindowLoad); } catch(e) {}
        loadListener = null;
        // après load, ne cacher que si on est toujours en mobile
        if (window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`).matches) {
          // petit délai pour smooth UX / laisser Prism terminer si besoin
          setTimeout(hideLoader, 120);
          log('window.load -> hideLoader (mobile).');
        } else {
          // si l'utilisateur a redimensionné en desktop avant load terminé
          showBlockingLarge();
          log('window.load mais écran > MOBILE_MAX_PX -> showBlockingLarge.');
        }
      };
      window.addEventListener('load', loadListener);
      log('listener window.load attaché (mobile flow).');
    }
  }

  // ---------- Media handler (initial + changes) ----------
  function mediaHandler(e) {
    const isMobile = (typeof e === 'boolean') ? e : (e && typeof e.matches === 'boolean' ? e.matches : mobileQuery.matches);
    log('mediaHandler — isMobile=', isMobile);
    if (isMobile) handleMobileFlow();
    else showBlockingLarge();
  }

  // ---------- INIT ----------
  function init() {
    // warnings si éléments manquants (tolérant)
    if (!templateEl) warn('#code-template introuvable — le loader fonctionnera sans injection de code.');
    if (!linesContainer) warn('#lines-container introuvable — le loader fonctionnera sans injection de code.');

    // décision initiale
    mediaHandler(mobileQuery);

    // écouter changement de media (resize / orientation)
    if (typeof mobileQuery.addEventListener === 'function') {
      mqListener = (ev) => mediaHandler(ev.matches);
      mobileQuery.addEventListener('change', mqListener);
    } else if (typeof mobileQuery.addListener === 'function') {
      mqListener = (ev) => mediaHandler(ev.matches);
      mobileQuery.addListener(mqListener);
    }

    // Safety: forcer la suite si load ne vient pas
    safetyTimer = setTimeout(() => {
      log('safety timeout atteint');
      if (!hidden && window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`).matches) {
        log('safety: forcer hide (mobile)');
        hideLoader();
      } else if (!hidden) {
        showBlockingLarge();
      }
    }, SAFETY_TIMEOUT_MS);

    log('loader initialisé (reducedMotion=', reducedMotion, ')');
  }

  // run init dès que DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // expose petit API debug (non-enumerable)
  try {
    Object.defineProperty(window, '__siteLoader', {
      value: {
        hide: hideLoader,
        prepare: prepareLines,
        state: () => ({ initialized, hidden, reducedMotion })
      },
      writable: false,
      configurable: true,
      enumerable: false
    });
  } catch (e) { /* ignore */ }
})();
