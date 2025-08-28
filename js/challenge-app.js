// challenge-app.js
// Version : pastille rouge ONLY (apparition/disparition selon challenges actifs)
// Conserve rendu inverse, countdowns, injection solution, copy button, Prism, debug API.
import { CHALLENGES, PARTICIPANTS } from "./challenge.js";

/* ===========================
   Données sûres
   =========================== */
const _CHALLENGES = Array.isArray(CHALLENGES) ? CHALLENGES : [];
const _PARTICIPANTS = Array.isArray(PARTICIPANTS) ? PARTICIPANTS : [];

/* ===========================
   UTILITAIRES
   =========================== */
function formatRemaining(ms) {
  if (ms <= 0) return null;

  let s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400); s %= 86400;
  const hours = Math.floor(s / 3600); s %= 3600;
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;

  const pad = n => n.toString().padStart(2, '0');

  if (days > 0) {
    const label = days === 1 ? "jour" : "jours";
    return `${days} ${label} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatLocalDate(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d)) return escapeHtml(String(iso));
    return d.toLocaleString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/^\w/, c => c.toUpperCase());
  } catch (e) {
    return escapeHtml(String(iso));
  }
}

/* ===========================
   COPY BUTTON
   =========================== */
function createCopyButton(textOrNode) {
  const copySVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>';
  const okSVG   = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.innerHTML = `${copySVG} Copier`;

  btn.addEventListener('click', async () => {
    const textToCopy = (typeof textOrNode === 'string')
      ? textOrNode.trim()
      : (textOrNode && textOrNode.innerText) ? String(textOrNode.innerText).trim() : '';

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const ta = document.createElement('textarea');
        ta.value = textToCopy;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      btn.classList.add('copied');
      btn.innerHTML = `${okSVG} Copié !`;
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = `${copySVG} Copier`;
      }, 1600);
    } catch (err) {
      console.error('Copy failed', err);
      btn.classList.add('error');
      setTimeout(() => btn.classList.remove('error'), 1600);
    }
  });

  return btn;
}

/* ===========================
   DOM REFERENCES (optionnels)
   =========================== */
const challengeListEl = document.getElementById('challenge-list');     // peut être absent sur index
const participantListEl = document.getElementById('participant-list'); // peut être absent sur index

/* ===========================
   CREATE CHALLENGE CARD
   =========================== */
function createChallengeCard(ch) {
  const card = document.createElement('article');
  card.className = 'card challenge-item';
  card.dataset.id = String(ch.id);

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `<div class="title">${escapeHtml(ch.title)}</div><div class="step">${escapeHtml(ch.difficulty)}</div>`;

  const sample = document.createElement('div');
  sample.className = 'sample';
  sample.textContent = ch.description || '';

  const moduleList = document.createElement('div');
  moduleList.className = 'module-list';
  moduleList.innerHTML = `<p><strong>Temps restant </strong> <span class="countdown-value" aria-live="polite">—</span></p>
                          <p class="muted"><strong>Fin :</strong> ${formatLocalDate(ch.deadline)}</p>`;

  const solutionContainer = document.createElement('div');
  solutionContainer.className = 'solution';
  solutionContainer.setAttribute('aria-live', 'polite');

  card.appendChild(meta);
  card.appendChild(sample);
  card.appendChild(moduleList);
  card.appendChild(solutionContainer);

  return card;
}

/* ===========================
   RENDER ALL
   =========================== */
function renderAll() {
  if (challengeListEl) {
    challengeListEl.innerHTML = '';
    const challenges = Array.from(_CHALLENGES).reverse();
    for (const ch of challenges) {
      challengeListEl.appendChild(createChallengeCard(ch));
    }
  }

  if (participantListEl) {
    participantListEl.innerHTML = '';
    const sorted = Array.from(_PARTICIPANTS).sort((a, b) => (b.score || 0) - (a.score || 0));
    sorted.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = `student-card ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : ''}`;
      card.innerHTML = `
        <div class="position-bubble"><span class="pos-number">${idx + 1}</span></div>
        <img src="${escapeHtml(p.avatar)}" alt="${escapeHtml(p.name)}" onerror="this.style.opacity=.5;this.src='img/placeholder.png'">
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="note"><span class="score">${escapeHtml(String(p.score || 0))} pts</span></div>
      `;
      participantListEl.appendChild(card);
    });
  }
}

/* ===========================
   SOLUTION INJECTION
   =========================== */
function injectSolutionInto(cardEl, challengeData) {
  if (!cardEl || !challengeData) return;
  if (cardEl.dataset.solutionShown === 'true') return;

  const solContainer = cardEl.querySelector('.solution');
  if (!solContainer) return;

  const solBlock = document.createElement('div');
  solBlock.className = 'solution-block';
  solBlock.style.margin = '0.2rem';
  solBlock.style.padding = '0rem';
  solBlock.style.position = 'relative';
  solBlock.style.background = 'var(--code-bg, #1e1e2e)';
  solBlock.style.border = '1px solid rgba(255,255,255,0.04)';
  solBlock.style.borderRadius = '8px';
  solBlock.style.overflowX = 'auto';

  const pre = document.createElement('pre');
  pre.className = 'cmd language-python';
  pre.style.margin = '0';
  const code = document.createElement('code');
  code.className = 'language-python';
  const solutionText = (typeof challengeData.solution === 'string') ? challengeData.solution : (challengeData.solution || '— solution non fournie —');
  code.textContent = solutionText;
  pre.appendChild(code);
  solBlock.appendChild(pre);

  const copyBtn = createCopyButton(code);
  copyBtn.style.position = 'absolute';
  copyBtn.style.top = '8px';
  copyBtn.style.right = '10px';
  copyBtn.style.zIndex = '4';
  solBlock.appendChild(copyBtn);

  solContainer.appendChild(solBlock);

  try {
    if (window.Prism && typeof Prism.highlightElement === 'function') {
      Prism.highlightElement(code);
    } else if (window.Prism && typeof Prism.highlightAll === 'function') {
      Prism.highlightAll();
    }
  } catch (e) {
    // ignore Prism errors
  }

  cardEl.dataset.solutionShown = 'true';
  cardEl.classList.add('finished');
}

/* ===========================
   Pastille rouge (attach / show/hide)
   =========================== */
function findChallengeNavLink() {
  return document.querySelector('.simple-link[aria-label="Challenge"]')
    || document.querySelector('a[href$="challenge.html"]')
    || document.querySelector('a[href*="challenge"]');
}

function ensureDotAttached(link) {
  if (!link) return null;
  const box = link.querySelector('.icon-box') || link;
  let dot = box.querySelector('.challenge-dot');
  if (!dot) {
    dot = document.createElement('span');
    dot.className = 'challenge-dot';
    dot.hidden = true;
    dot.setAttribute('aria-hidden', 'true');
    box.appendChild(dot);
  }
  return dot;
}

/* ===========================
   updateCountdowns() - red dot logic only
   =========================== */
function updateCountdowns() {
  const now = Date.now();

  // update countdowns
  const nodes = Array.from(document.querySelectorAll('.challenge-item'));
  for (const node of nodes) {
    const id = node.dataset.id;
    const ch = _CHALLENGES.find(c => String(c.id) === String(id));
    const span = node.querySelector('.countdown-value');

    if (!ch || !ch.deadline) {
      if (span) span.textContent = '—';
      continue;
    }

    const end = new Date(ch.deadline).getTime();
    if (isNaN(end)) {
      if (span) span.textContent = 'Date invalide';
      continue;
    }

    const remaining = end - now;
    if (remaining <= 0) {
      if (span) span.textContent = 'Terminé';
      injectSolutionInto(node, ch);
    } else {
      if (span) span.textContent = formatRemaining(remaining);
      node.classList.remove('finished');
    }
  }

  // manage red dot: show if at least one active, hide if none
  const link = findChallengeNavLink();
  if (!link) return;
  const dot = ensureDotAttached(link);
  if (!dot) return;

  const hasActive = _CHALLENGES.some(ch => {
    const t = new Date(ch.deadline).getTime();
    return !isNaN(t) && t > now;
  });

  if (hasActive) {
    dot.hidden = false;
    dot.classList.add('red');
  } else {
    dot.classList.remove('red'); // remove class to keep clean
    dot.hidden = true;
  }
}

/* ===========================
   INIT
   =========================== */
function init() {
  renderAll();
  updateCountdowns();
  const intervalId = setInterval(updateCountdowns, 1000);

  // no green logic, so no localStorage handling here
  // debug API
  try {
    Object.defineProperty(window, '__chApp', {
      value: {
        render: renderAll,
        update: updateCountdowns,
        stop: () => clearInterval(intervalId),
        state: () => ({ challenges: _CHALLENGES.length, participants: _PARTICIPANTS.length })
      },
      configurable: true,
      enumerable: false,
      writable: false
    });
  } catch (e) { /* ignore */ }
}

/* run on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}