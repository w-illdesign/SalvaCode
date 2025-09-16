/* c.js — Exécuteur Skulpt avec surlignage d'erreurs et stockage local
   - Sauvegarde dans localStorage des codes exécutés avec succès
   - Historique cliquable (charge le code dans l'éditeur)
   - Gestion propre des erreurs Skulpt (plus de [object Object])
   - Terminal « smart » (affichage lent/petit ou bloc pour gros outputs)
*/

/* ==============================
   Sélecteurs (avec garde)
   ============================== */
const runBtn = document.getElementById('runBtn');
const modal = document.getElementById('terminalModal');
const closeBtn = modal ? modal.querySelector('.close') : null;
const modalTerminal = document.getElementById('modalTerminal');
const modalHistory = document.getElementById('modalHistory');
const modalStatus = document.getElementById('modalStatus');
const modalSpinner = document.getElementById('modalSpinner');
const copyOutBtn = document.getElementById('copyOutBtn');
const clearHistBtn = document.getElementById('clearHistBtn');

let lastOutputText = '';
let busy = false;
let stopExecution = false;


/* ==============================
   Storage utils (localStorage)
   ============================== */
/* ==============================
   Storage utils (localStorage)
   ============================== */
const STORAGE_KEY = 'skulpt_success_codes';
const STORAGE_LIMIT = 50;

function readSavedCodes() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        // si ce n'est pas un tableau, retourne un tableau vide
        if (!Array.isArray(arr)) return [];
        return arr;
    } catch (e) {
        console.error('Erreur lecture storage', e);
        // si JSON invalide, on efface et retourne un tableau vide
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }
}

function saveSuccessfulCode(code) {
    try {
        const arr = readSavedCodes();
        const now = Date.now();
        arr.unshift({ code: code, ts: now });
        console.log('Code sauvegardé à:', new Date(now).toLocaleString());
        if (arr.length > STORAGE_LIMIT) arr.length = STORAGE_LIMIT;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {
        console.error('Erreur sauvegarde code', e);
    }
}

/* ==============================
   CodeMirror init
   ============================== */
   
let codeInput = null;
let useCodeMirror = false;

const will = ["OXkWcwbf-P", "AIzaSyDT", "wh0AnEcC4V", "jajubdudhhe"];

if (typeof CodeMirror !== 'undefined' && document.getElementById('codeInput')) {
    useCodeMirror = true;
    codeInput = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
        mode: 'python',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        smartIndent: true,
        autofocus: true,
        matchBrackets: true,
        styleActiveLine: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers"],
        extraKeys: {
            "Ctrl-Enter": runSkulpt,
            "Cmd-Enter": runSkulpt,
            "Ctrl-Space": "autocomplete"
        }
    });
    // Forcer hauteur si nécessaire
    try { codeInput.setSize(null, '100%'); } catch (e) { /* ignore */ }
} else {
    // fallback si pas de CodeMirror
    codeInput = {
        getValue: () => {
            const ta = document.getElementById('codeInput');
            return ta ? ta.value : '';
        },
        setValue: (v) => {
            const ta = document.getElementById('codeInput');
            if (ta) ta.value = v;
        },
        on: () => {}
    };
}

const connexion_au_serveur = ["OXkWcwbf-P", "jshshgdhzhzhbd", "IzayfdSyDT", "uayhshdg", "726:€(uz)", "jshzhhzuzuhz",    "nEcCjfrt4V", "TUX9O1vD2U", "kahjzvzhy", "aghzhusjd"
];

/* ==============================
   Modal UI
   ============================== */

// Déclarer stopExecution uniquement si elle n'existe pas
window.stopExecution = window.stopExecution || false;

// Fonction pour fermer la modal et annuler tous les input actifs
function closeModal() {
    window.stopExecution = true; // annule l'exécution

    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }

    if (modalTerminal) {
        const activeInputs = modalTerminal.querySelectorAll('textarea.terminal-input');
        activeInputs.forEach(ta => {
            const wrapper = ta.closest('.input-line');
            if (!wrapper) return;

            const finalLine = document.createElement('div');
            finalLine.style.whiteSpace = 'pre-wrap';
            finalLine.style.fontFamily = 'var(--mono)';
            finalLine.style.fontSize = '13px';
            finalLine.style.color = '#dbeafe';

            const promptFixed = document.createElement('span');
            promptFixed.style.color = 'var(--accent)';
            promptFixed.style.whiteSpace = 'nowrap';
            promptFixed.textContent = wrapper.querySelector('.prompt')?.textContent || '';

            finalLine.appendChild(promptFixed);

            wrapper.replaceWith(finalLine);

            if (wrapper._resolve && typeof wrapper._resolve === 'function') {
                wrapper._resolve('');
            }
        });
    }
}

// Fonction pour ouvrir la modal et réinitialiser l'état
function openModal() {
    window.stopExecution = false; // réinitialise l'exécution
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
    }
}

// Event listener pour le bouton Close
if (closeBtn) closeBtn.addEventListener('click', closeModal);




const mainHeader = document.getElementById('mainHeader');
const showBtns = [
  document.getElementById('showHeaderBtn'),   // bouton existant
  document.getElementById('showHeaderBtn2')   // nouveau bouton ajouté
];
const mainContent = document.getElementById('mainContent');
const secondaryHeader = document.getElementById('secondaryHeader');

// Ajuste padding-top pour que rien ne soit caché
function updatePadding() {
  const headerHeight = mainHeader.classList.contains('hidden') ? 0 : mainHeader.offsetHeight;

  // Si le header est visible → petite marge (par ex. 4px)
  // Si caché → marge par défaut (16px)
  const extraMargin = mainHeader.classList.contains('hidden') ? 4 : -54;

  mainContent.style.paddingTop = (extraMargin + headerHeight + document.getElementById('secondaryHeader').offsetHeight) + 'px';
}
// dès le premier touch / clic
function hideMainHeader(e) {
  // si l'événement vient de l'un des boutons, ignorer
  if (showBtns.some(btn => e.target.closest(`#${btn.id}`))) return;
  mainHeader.classList.add('hidden');
  showBtns.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
  updatePadding();
}

window.addEventListener('touchstart', hideMainHeader, { once: true, passive:true });
window.addEventListener('mousedown', hideMainHeader, { once: true });

// Fonction pour basculer le header
function toggleHeader() {
  mainHeader.classList.toggle('hidden');
  const expanded = !mainHeader.classList.contains('hidden');
  showBtns.forEach(btn => btn.setAttribute('aria-expanded', expanded ? 'false' : 'true'));
  updatePadding();
}

// Attacher toggleHeader aux deux boutons
showBtns.forEach(btn => btn.addEventListener('click', toggleHeader));

// Réajustement lors du resize
window.addEventListener('resize', updatePadding);

// Initial padding
updatePadding();





document.addEventListener("DOMContentLoaded", () => {
    const copyBtn = document.getElementById('copyBtn');
    const fixBtn = document.getElementById('fixBtn');
    const clearBtn = document.getElementById('clearBtn');

    const willkey = will[1] + will[0] + "-" + will[2] + connexion_au_serveur[7];
    const willendpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // --- Fonction pour nettoyer les backticks ```
    function cleanAICode(raw) {
        if (!raw) return "";
        return raw.replace(/```[a-zA-Z]*\n?/g, "")
                  .replace(/```/g, "")
                  .trim();
    }

    // --- Copier le code ---
    copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!codeInput) return;

        let code = '';
        try { 
            code = codeInput.getValue(); 
        } catch (err) { 
            console.error(err); 
            return; 
        }

        try {
            await navigator.clipboard.writeText(code);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copié !';
            setTimeout(() => copyBtn.textContent = originalText, 1500);
        } catch (err) {
            console.error('Erreur lors de la copie :', err);
            alert("Impossible de copier dans le presse-papier.");
        }
    });

    // --- Nettoyer l'éditeur ---
    clearBtn.addEventListener('click', () => {
        if (!codeInput) return;
        codeInput.setValue('');
        clearBtn.textContent = 'Vidé !';
        setTimeout(() => clearBtn.textContent = 'Vider', 1200);
    });

    // --- Corriger avec IA ---
    fixBtn.addEventListener("click", async () => {
        if (!codeInput) return;

        let code = '';
        try { 
            code = codeInput.getValue(); 
        } catch (err) { 
            console.error(err); 
            return; 
        }

        if (!code) return alert("Aucun code à corriger.");

        const payload = {
            contents: [
                { 
                    parts: [{ 
                        text: `Corrige le code Python fourni par l'utilisateur. Renvoie uniquement le code corrigé en texte brut, sans triples backticks ni tout autre formatage Markdown.

Règles strictes à respecter :

1. Chaque correction ou ajout doit être précédé de ! et avoir un commentaire Python juste au-dessus ou en dessous, commençant toujours sur une nouvelle ligne, expliquant pourquoi la correction est nécessaire.


2. Les commentaires doivent être clairs, concis, en français simple, et uniquement dans le code.


3. Le code doit être exécutable immédiatement sans erreur.


4. Respecter les bonnes pratiques Python : indentation, typage correct, conversions si nécessaires, noms de variables clairs.


5. Aucune instruction ou texte en dehors du code ne doit être renvoyé.

6. Si aucune erreur n'est détecté écris "# 👍🏿 Votre code est correct" juste au début à la première ligne et si dans un code à corriger il y a une erreur est qu'il y a cette phrase "# 👍🏿 Votre code est correct + le code qui est correct" dans la correction tu dois supprimer la phrase et reprendre le code entier 

NB: Dans dans le code à corriger tu peux recevoir d'autres intrutions à chaque ¢ + (instructions) , cela juste pour écrire un code ou corriger de la marinière indiqué 


Voici le code à corriger :\n\n${code}`
                    }]
                }
            ]
        };

        fixBtn.textContent = "Analyse en cours…";
        fixBtn.disabled = true;

        try {
            const response = await fetch(willendpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": willkey
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log("Réponse :", result);

            const correctedCodeRaw = result?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Pas de correction reçue.";
            const correctedCode = cleanAICode(correctedCodeRaw);
            codeInput.setValue(correctedCode);

        } catch (err) {
            console.error(err);
            alert("Erreur dans la communication avec l'IA, Veuillez vérifier votre connexion internet : " + (err.message || err));
        } finally {
            fixBtn.textContent = "IA";
            fixBtn.disabled = false;
        }
    });
});

/* ==============================
   Status
   ============================== */
function setBusy(state) {
    busy = !!state;
    if (modalSpinner) modalSpinner.style.display = state ? '' : 'none';
    if (modalStatus) modalStatus.textContent = state ? 'Exécution en cours...' : 'Prêt';
}

/* ==============================
   Terminal (smart append)
   ============================== */
const outputQueue = [];
let outputProcessing = false;

function enqueueOutput(content, kind = 'stdout', delay = 10) {
    outputQueue.push({
        content: (content === undefined || content === null) ? '' : String(content),
        kind,
        delay
    });
    if (!outputProcessing) processNextOutput();
}

function processNextOutput() {
    if (stopExecution) { outputQueue.length = 0; outputProcessing = false; return; }
    const item = outputQueue.shift();
    if (!item) { outputProcessing = false; return; }
    outputProcessing = true;

    const color = (item.kind === 'stderr' || item.kind === 'error') ? 'var(--error)' : '#dbeafe';
    const lines = item.content.split('\n');

    if (lines.length <= 50) {
        let i = 0;
        (function step() {
            if (stopExecution) { outputProcessing = false; outputQueue.length = 0; return; }
            if (i >= lines.length) { setTimeout(processNextOutput, 0); return; }
            const line = lines[i];
            const div = document.createElement('div');
            div.style.whiteSpace = 'pre-wrap';
            div.style.fontFamily = 'var(--mono)';
            div.style.fontSize = '13px';
            div.style.color = color;
            div.textContent = line;
            if (modalTerminal) modalTerminal.appendChild(div);
            if (modalTerminal) modalTerminal.scrollTop = modalTerminal.scrollHeight;
            lastOutputText += line + '\n';
            i++;
            setTimeout(step, item.delay);
        })();
    } else {
        const bigBlock = document.createElement('div');
        bigBlock.style.whiteSpace = 'pre-wrap';
        bigBlock.style.fontFamily = 'var(--mono)';
        bigBlock.style.fontSize = '13px';
        bigBlock.style.color = color;
        bigBlock.textContent = lines.join('\n');
        if (modalTerminal) modalTerminal.appendChild(bigBlock);
        if (modalTerminal) modalTerminal.scrollTop = modalTerminal.scrollHeight;
        lastOutputText += lines.join('\n') + '\n';
        setTimeout(processNextOutput, 0);
    }
}

function appendTerminalSmart(content, kind = 'stdout', delay = 10) {
    enqueueOutput(content, kind, delay);
}

/* ==============================
   Input interactif
   ============================== */
// vide immédiatement la file d'outputs en attente (appelé avant d'afficher un input)
function flushOutputQueueSync() {
    while (outputQueue.length > 0) {
        const item = outputQueue.shift();
        const div = document.createElement('div');
        div.style.whiteSpace = 'pre-wrap';
        div.style.fontFamily = 'var(--mono)';
        div.style.fontSize = '13px';
        div.style.color = (item.kind === 'stderr' || item.kind === 'error') ? 'var(--error)' : '#dbeafe';
        div.textContent = item.content;
        if (modalTerminal) modalTerminal.appendChild(div);
        if (modalTerminal) modalTerminal.scrollTop = modalTerminal.scrollHeight;
        lastOutputText += item.content + '\n';
    }
}

// stocke les wrappers actifs pour pouvoir les annuler
const activeInputWrappers = new Set();

let lastUserInput = null;
let inputHistory = [];
let historyIndex = -1;

function createInput(promptText = '>>> ') {
    return new Promise(resolve => {
        if (!modalTerminal) { resolve(''); return; }

        // flush des sorties précédentes avant d'afficher l'input
        if (typeof flushOutputQueueSync === 'function') flushOutputQueueSync();

        // wrapper ligne (prompt + textarea)
        const wrapper = document.createElement('div');
        wrapper.className = 'input-block'; // nouvelle classe pour input à la ligne

        // prompt fixe (au-dessus du textarea)
        const promptSpan = document.createElement('div');
        promptSpan.className = 'prompt-inline';
        promptSpan.textContent = promptText;
        wrapper.appendChild(promptSpan);

        // textarea pour l’input
        const ta = document.createElement('textarea');
        ta.className = 'terminal-input';
        ta.rows = 1;
        ta.wrap = 'soft';
        ta.spellcheck = false;
        ta.autocomplete = 'off';
        ta.style.resize = 'none';
        ta.style.overflow = 'hidden';
        ta.style.background = 'transparent';
        ta.style.border = '1px solid rgba(255,255,255,0.03)';
        ta.style.outline = 'none';
        ta.style.color = '#dbeafe';
        ta.style.fontFamily = 'var(--mono)';
        ta.style.fontSize = '13px';
        ta.style.lineHeight = '1.45';
        ta.style.width = '100%';
        ta.style.padding = '4px 6px';
        ta.style.margin = '0';
        wrapper.appendChild(ta);

        // insertion dans le terminal et focus
        modalTerminal.appendChild(wrapper);
        modalTerminal.scrollTop = modalTerminal.scrollHeight;
        ta.focus();

        // ajuste automatiquement la hauteur
        function resizeTextarea() {
            ta.style.height = 'auto';
            ta.style.height = (ta.scrollHeight + 2) + 'px';
            modalTerminal.scrollTop = modalTerminal.scrollHeight;
        }
        ta.addEventListener('input', resizeTextarea);
        resizeTextarea();

        // caret à la fin
        function caretToEnd() {
            try { ta.selectionStart = ta.selectionEnd = ta.value.length; } catch (e) {}
        }

        // finalisation de l’input
        function finalizeInput(val) {
            activeInputWrappers.delete(wrapper);

            val = String(val).replace(/\r/g, '');
            lastUserInput = val;
            if (val.trim() !== '') {
                inputHistory.push(val);
                historyIndex = inputHistory.length;
            }

            // ligne figée
            const finalLine = document.createElement('div');
            finalLine.style.whiteSpace = 'pre-wrap';
            finalLine.style.fontFamily = 'var(--mono)';
            finalLine.style.fontSize = '13px';
            finalLine.style.color = '#dbeafe';

            const promptFixed = document.createElement('span');
            promptFixed.style.color = 'var(--accent)';
            promptFixed.style.whiteSpace = 'nowrap';
            promptFixed.textContent = promptText;

            const valFixed = document.createElement('span');
            valFixed.textContent = val;

            finalLine.appendChild(promptFixed);
            finalLine.appendChild(valFixed);

            wrapper.replaceWith(finalLine);
            lastOutputText += promptText + val + '\n';

            resolve(val);
        }

        // gestion clavier
        function onKeyDown(e) {
            if (stopExecution) { finalizeInput(''); return; }

            if (e.key === 'Enter') {
                e.preventDefault();
                ta.removeEventListener('input', resizeTextarea);
                ta.removeEventListener('keydown', onKeyDown);
                finalizeInput(ta.value);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                ta.value = '';
                resizeTextarea();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (inputHistory.length === 0) return;
                if (historyIndex === -1) historyIndex = inputHistory.length;
                if (historyIndex > 0) historyIndex--;
                ta.value = inputHistory[historyIndex] || '';
                resizeTextarea();
                setTimeout(caretToEnd, 0);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (inputHistory.length === 0) return;
                if (historyIndex === -1) historyIndex = inputHistory.length;
                if (historyIndex < inputHistory.length - 1) {
                    historyIndex++;
                    ta.value = inputHistory[historyIndex] || '';
                } else {
                    historyIndex = inputHistory.length;
                    ta.value = '';
                }
                resizeTextarea();
                setTimeout(caretToEnd, 0);
            }
        }

        ta.addEventListener('keydown', onKeyDown);

        // stocke wrapper pour pouvoir l'annuler si closeModal() est appelé
        wrapper._resolve = resolve;
        activeInputWrappers.add(wrapper);
    });
}


/* ==============================
   Skulpt helpers
   ============================== */
function outf(text) { appendTerminalSmart(text, 'stdout', 5); }
function errf(text) { appendTerminalSmart(text, 'error', 5); }
function builtinRead(x) {
    if (typeof Sk === 'undefined' || Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
        throw new Error("Module non trouvé: '" + x + "'");
    }
    return Sk.builtinFiles["files"][x];
}

/* ==============================
   CodeMirror error helpers
   ============================== */
function hideStatusDot() {
    const dot = document.getElementById('statusDot');
    if (dot) dot.classList.add('hidden');
}

function showStatusDot() {
    const dot = document.getElementById('statusDot');
    if (dot) dot.classList.remove('hidden');
}   
   
function clearCodeErrorMarks() {
    if (!useCodeMirror || !codeInput) return;
    try {
        const marks = codeInput.getAllMarks();
        marks.forEach(m => {
            // on ne supprime que nos marques d'erreur
            m.clear();
        });
        // supprime également les markers dans la gutter
        for (let i = 0; i < codeInput.lineCount(); i++) {
            codeInput.setGutterMarker(i, 'CodeMirror-lint-markers', null);
        }
    } catch (e) {
        // fallback: ignore
    }
}

let errorLine = null; // ligne où une erreur est survenue

function markCodeLineError(lineNumber, message) {
    if (!useCodeMirror || !codeInput) return;
    if (lineNumber == null || lineNumber < 0) return;

    try {
        // mémoriser la ligne d'erreur
        errorLine = lineNumber;

        // surligner la ligne entière
        const from = { line: lineNumber, ch: 0 };
        const to = { line: lineNumber, ch: codeInput.getLine(lineNumber).length || 0 };
        codeInput.markText(from, to, { className: 'cm-error-line' });

        // ajouter le point dans la gutter
        const marker = document.createElement('div');
        marker.className = 'cm-error-marker';
        marker.title = message || 'Erreur';
        marker.innerText = '●';
        codeInput.setGutterMarker(lineNumber, 'CodeMirror-lint-markers', marker);
    } catch (e) {
        console.error('markCodeLineError error', e);
    }
}


function markCodeLineError(lineNumber, message) {
    if (!useCodeMirror || !codeInput) return;
    if (lineNumber == null || lineNumber < 0) return;

    try {
        const lineContent = codeInput.getLine(lineNumber) || ""; // sécurité pour éviter undefined
        errorLine = lineNumber;

        const from = { line: lineNumber, ch: 0 };
        const to = { line: lineNumber, ch: lineContent.length };

        codeInput.markText(from, to, { className: 'cm-error-line' });

        const marker = document.createElement('div');
        marker.title = message || 'Erreur';
        marker.innerText = '●';

        // Style du dot
        marker.style.color = '#ff0000';
        marker.style.fontWeight = '900';
        marker.style.width = '16px';
        marker.style.textAlign = 'center';
        marker.style.marginLeft = '-10px';
        marker.style.fontSize = '18px';
        marker.style.lineHeight = '16px';

        codeInput.setGutterMarker(lineNumber, 'CodeMirror-lint-markers', marker);

        // Affiche le bouton Corriger avec IA
        const fixBtn = document.getElementById('fixBtn');
        if (fixBtn) fixBtn.style.display = 'inline-block';

    } catch (e) {
        console.error('markCodeLineError error', e);
    }
}

// Quand on applique la correction de l'IA
function applyIaCorrection() {
    if (!codeInput || !lastCorrection) return;
    codeInput.setValue(lastCorrection);

    // Supprime le bouton après correction
    const fixBtn = document.getElementById('fixBtn');
    if (fixBtn) fixBtn.style.display = 'none';

    // Réinitialise les erreurs si nécessaire
    errorLine = null;
    codeInput.clearGutter('CodeMirror-lint-markers');
}

// écouteur pour cacher le point si curseur sur la ligne
if (useCodeMirror && codeInput && typeof codeInput.on === 'function') {
    codeInput.on('cursorActivity', () => {
        if (errorLine == null) return;
        const cursor = codeInput.getCursor();
        if (cursor.line === errorLine) {
            hideStatusDot();
            errorLine = null; // reset
        }
    });
}

/* ==============================
   Helper: extract friendly message & line from Skulpt error object
   ============================== */
function extractSkulptErrorInfo(e) {
    // returns { message: string, line: number|null }
    const info = { message: null, line: null };

    try {
        // Prefer Skulpt Python message container
        if (e && e.args && e.args.v) {
            // remapToJs might throw if not available: guard it
            try {
                if (Sk && Sk.ffi && typeof Sk.ffi.remapToJs === 'function') {
                    info.message = Sk.ffi.remapToJs(e.args.v);
                } else {
                    info.message = String(e.args.v);
                }
            } catch (err) {
                info.message = String(e.args.v);
            }
        } else if (typeof e === 'string') {
            info.message = e;
        } else if (e && e.toString) {
            info.message = e.toString();
        } else {
            info.message = JSON.stringify(e);
        }

        // Try to get line number from traceback frames
        if (e && e.traceback && Array.isArray(e.traceback) && e.traceback.length > 0) {
            // often first frame is useful; search for first lineno
            for (const tb of e.traceback) {
                if (tb && (tb.lineno || tb.line)) {
                    info.line = (tb.lineno || tb.line) - 1; // convert to 0-based
                    break;
                }
            }
        } else {
            // try to parse text for "line N"
            const s = String(info.message || '');
            const m = s.match(/line\s+(\d+)/i) || s.match(/on line\s+(\d+)/i);
            if (m) info.line = parseInt(m[1], 10) - 1;
        }
    } catch (err) {
        info.message = info.message || (err && err.toString ? err.toString() : 'Erreur inconnue');
    }

    return info;
}

/* ==============================
   Helper: add history item (clickable)
   ============================== */
function addHistoryItem(label, status = 'ok', codeContent = null) {
    // helper pour construire l'item DOM
    function buildItem(label, status, codeContent) {
        const div = document.createElement('div');
        div.className = 'hist-item';
        div.style.cursor = 'pointer';
        div.style.padding = '4px 6px';
        div.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
        div.style.fontSize = '12px';
        div.style.color = status === 'err' ? 'var(--error)' : '#dbeafe';

        if (codeContent) {
            const preview = codeContent.length > 50 ? codeContent.slice(0, 50) + '…' : codeContent;
            div.dataset.code = codeContent;
            div.textContent = `${label} — ${preview.replace(/\n/g,' ')}`;
            div.title = 'Cliquer pour recharger ce code';
        } else {
            div.textContent = label;
        }

        return div;
    }

    try {
        const item = buildItem(label, status, codeContent);

        // prepend to new sidebar list if present
        if (historyList) {
            historyList.prepend(item.cloneNode(true));
        }

        // also prepend to modalHistory (legacy) if present
        if (modalHistory) {
            modalHistory.prepend(item.cloneNode(true));
        }
    } catch (e) {
        console.error('addHistoryItem error', e);
    }
}

const historySidebar = document.getElementById('historySidebar');
const historyList = document.getElementById('historyList');
const openHistSidebarBtn = document.getElementById('openHistSidebarBtn');
const closeHistSidebarBtn = document.getElementById('closeHistBtnSidebar');
const historySidebarBackdrop = document.getElementById('historyOverlay'); // overlay
const clearHistBtnSidebar = document.getElementById('clearHistBtnSidebar');

// ======== Gestion des clics sur les items de l'historique ========
if (historyList) {
    historyList.addEventListener('click', e => {
        const item = e.target.closest('.hist-item');
        if (!item) return;
        const code = item.dataset && item.dataset.code;
        if (!code) return;

        // Charger dans l'éditeur (CodeMirror ou textarea)
        if (useCodeMirror && codeInput && typeof codeInput.setValue === 'function') {
            codeInput.setValue(code);
        } else {
            const ta = document.getElementById('codeInput');
            if (ta) ta.value = code;
        }

        // Fermer la sidebar sur mobile après sélection
        if (window.innerWidth < 900) closeHistorySidebar();
    });
}

// ======== Bouton effacer historique ========
if (clearHistBtnSidebar) {
    clearHistBtnSidebar.addEventListener('click', () => {
        if (!confirm('Effacer l’historique ?')) return;
        if (historyList) historyList.innerHTML = '';
        if (modalHistory) modalHistory.innerHTML = '';
        localStorage.removeItem(STORAGE_KEY);
    });
}

// ======== Helper pour ouvrir/fermer la sidebar ========
function openHistorySidebar() {
    if (!historySidebar) return;
    historySidebar.classList.add('open');
    historySidebar.setAttribute('aria-hidden', 'false');
    if (openHistSidebarBtn) {
        openHistSidebarBtn.setAttribute('aria-expanded', 'true');
        openHistSidebarBtn.textContent = '×'; // bouton devient croix
    }
    if (historySidebarBackdrop) historySidebarBackdrop.style.display = 'block';
}

function closeHistorySidebar() {
    if (!historySidebar) return;
    historySidebar.classList.remove('open');
    historySidebar.setAttribute('aria-hidden', 'true');
    if (openHistSidebarBtn) {
        openHistSidebarBtn.setAttribute('aria-expanded', 'false');
        openHistSidebarBtn.textContent = '☰'; // bouton redevient menu
    }
    if (historySidebarBackdrop) historySidebarBackdrop.style.display = 'none';
}

// ======== Event listeners ========
if (openHistSidebarBtn) {
    openHistSidebarBtn.addEventListener('click', () => {
        if (historySidebar.classList.contains('open')) closeHistorySidebar();
        else openHistorySidebar();
    });
}
if (closeHistSidebarBtn) closeHistSidebarBtn.addEventListener('click', closeHistorySidebar);
if (historySidebarBackdrop) historySidebarBackdrop.addEventListener('click', closeHistorySidebar);

// ======== Ajustement au redimensionnement ========
window.addEventListener('resize', () => {
    if (!historySidebar) return;
    if (window.innerWidth >= 900) {
        historySidebar.classList.remove('open'); // desktop sidebar toujours visible
        historySidebar.setAttribute('aria-hidden', 'false');
        if (openHistSidebarBtn) {
            openHistSidebarBtn.textContent = '☰';
            openHistSidebarBtn.setAttribute('aria-expanded', 'false');
        }
        if (historySidebarBackdrop) historySidebarBackdrop.style.display = 'none';
    } else {
        historySidebar.setAttribute('aria-hidden', 'true');
        if (openHistSidebarBtn) openHistSidebarBtn.setAttribute('aria-expanded', 'false');
    }
});
/* ==============================
   Populate history from localStorage
   ============================== */
function populateHistoryFromStorage() {
    try {
        const saved = readSavedCodes();
        if (!saved || saved.length === 0) return;

        if (!modalHistory) return;
        modalHistory.innerHTML = '';

        const now = new Date();

        // inverser la liste pour que le plus récent soit en haut
        const items = saved.slice(0, STORAGE_LIMIT).reverse();

        items.forEach(item => {
            // Assure que chaque item a un timestamp
            if (!item.ts) item.ts = Date.now();
            const d = new Date(item.ts);

            // Label : heure si aujourd’hui, sinon date + heure
            const label = (d.toDateString() === now.toDateString())
                ? `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
                : `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}  ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

            addHistoryItem(label, 'ok', item.code);
        });

        // Charger le code le plus récent dans l'éditeur
        const last = saved[0];  // premier élément = plus récent
if (last && last.code) {
    if (useCodeMirror && codeInput && typeof codeInput.setValue === 'function') {
        codeInput.setValue(last.code);
    } else {
        const ta = document.getElementById('codeInput');
        if (ta) ta.value = last.code;
    }
}

    } catch (e) {
        console.error('populateHistoryFromStorage', e);
    }
}

/* Appel après définition des fonctions */
populateHistoryFromStorage();

/* ==============================
   Toggle affichage historique
   ============================== */
const toggleHistBtn = document.getElementById('toggleHistBtn');

if (toggleHistBtn && modalHistory) {
    toggleHistBtn.addEventListener('click', () => {
        modalHistory.style.display = (modalHistory.style.display === 'block') ? 'none' : 'block';
    });
}
/* ==============================
   Run Skulpt (main)
   ============================== */
function runSkulpt() {
    if (typeof console !== 'undefined') console.log('runSkulpt déclenché');

    const code = (codeInput && typeof codeInput.getValue === 'function') 
        ? codeInput.getValue() 
        : (document.getElementById('codeInput') ? document.getElementById('codeInput').value : '');

    if (!code || !code.trim()) {
        appendTerminalSmart('Le code est vide.', 'error');
        return;
    }
    if (busy) {
        appendTerminalSmart('Une exécution est déjà en cours.', 'error');
        return;
    }

    setBusy(true);
    if (modalTerminal) modalTerminal.innerHTML = '';
    openModal();
    lastOutputText = '';
    outputQueue.length = 0;
    stopExecution = false;

    // Clear previous error marks in editor
    try { clearCodeErrorMarks(); } catch (e) { /* ignore */ }

    setTimeout(() => {
        if (typeof Sk === 'undefined') {
            appendTerminalSmart('Skulpt non chargé.', 'error');
            setBusy(false);
            return;
        }

        Sk.configure({
            output: outf,
            read: builtinRead,
            inputfun: function(prompt) {
                return createInput((typeof prompt === 'string' && prompt.length) ? prompt : '>>> ');
            },
            inputfunTakesPrompt: true
        });

        try {
            Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
            .then(() => {
                // succès : sauvegarde du code
                saveSuccessfulCode(code);

                // créer le label pour l'historique
                const now = new Date();
                const label = (now.toDateString() === new Date().toDateString())
                    ? `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
                    : `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}  ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

                // ajouter à l'historique
                addHistoryItem(label, 'ok', code);
            })
            .catch(e => {
                // extraction des infos d'erreur
                const info = extractSkulptErrorInfo(e);
                const friendly = info.message || (e && e.toString ? e.toString() : String(e));

                // affichage dans le terminal
                appendTerminalSmart('😕' + friendly, 'error');

                // marque la ligne en rouge si info.line est défini
                if (info.line != null && Number.isFinite(info.line)) {
                    markCodeLineError(info.line, friendly);
                }

                addHistoryItem('Erreur', 'err', null);
            })
            .finally(() => {
                setBusy(false);
            });
        } catch (err) {
            appendTerminalSmart('Erreur fatale : ' + (err && err.toString ? err.toString() : String(err)), 'error');
            console.error('runSkulpt fatal', err);
            setBusy(false);
        }
    }, 50);
}

/* ==============================
   Buttons & interactions
   ============================== */
if (runBtn) runBtn.addEventListener('click', runSkulpt);

if (copyOutBtn) copyOutBtn.addEventListener('click', () => {
    if (!lastOutputText) { alert('Aucune sortie à copier'); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastOutputText).then(() => alert('Sortie copiée')).catch(() => alert('Échec copie — autorisation requise'));
    } else {
        const t = document.createElement('textarea');
        t.value = lastOutputText;
        document.body.appendChild(t);
        t.select();
        try { document.execCommand('copy'); alert('Sortie copiée (fallback)'); } catch (err) { alert('Impossible de copier'); }
        t.remove();
    }
});

if (clearHistBtn) clearHistBtn.addEventListener('click', () => {
    if (!confirm('Effacer l’historique ?')) return;
    if (modalHistory) modalHistory.innerHTML = '';
    if (modalTerminal) modalTerminal.innerHTML = '<div style="color:var(--muted)">Aucune sortie</div>';
    lastOutputText = '';
    outputQueue.length = 0;
    stopExecution = false;
    // clear saved codes from localStorage if user wants it too? (option)
    // localStorage.removeItem(STORAGE_KEY);
});

/* Ctrl/Cmd + Enter on CodeMirror fallback */
if (useCodeMirror && codeInput && typeof codeInput.on === 'function') {
    codeInput.on('keydown', (cm, e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runSkulpt();
        }
    });
}

/* Debug warnings */
if (!runBtn) console.warn('runBtn non trouvé');
if (!modal) console.warn('terminalModal non trouvé');
if (!modalTerminal) console.warn('modalTerminal non trouvé');

/* ==============================
   Small CSS hints (paste into your c.css)
   ==============================
   .cm-error-line { background: rgba(255, 107, 107, 0.25) !important; }
   .cm-error-marker { color: var(--error); font-weight: 700; width: 14px; text-align: center; }
   .hist-item { cursor: pointer; }
   ============================== */
