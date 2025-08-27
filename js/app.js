// app.js (module)
// ----- MET À JOUR AVEC TES INFOS -----
const firebaseConfig = {
  apiKey: "AIzaSyCmADrVUDE3HqLhnOzt8HVCJlXVTKLHhNE",
  authDomain: "kodek-3ba83.firebaseapp.com",
  databaseURL: "https://kodek-3ba83-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kodek-3ba83",
  storageBucket: "kodek-3ba83.firebasestorage.app",
  messagingSenderId: "432666557296",
  appId: "1:432666557296:web:46dc3a2951e31248f22db5",
  measurementId: "G-H8C9WN68J3"
};

// Change cette clé avant de déployer en prod
const ADMIN_KEY = "admin123";

// Imports Firebase (modulaire)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Références DB
const messagesRef = ref(db, "messages");
const bannedRef = ref(db, "banned");

// DOM
const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("inputMessage");
const sendBtn = document.getElementById("sendBtn");
const meAvatar = document.getElementById("meAvatar");
const mePseudoEl = document.getElementById("mePseudo");
const meIdEl = document.getElementById("meId");
const changePseudoBtn = document.getElementById("changePseudoBtn");
const setAdminBtn = document.getElementById("setAdminBtn");
const adminHint = document.getElementById("adminHint");

// Modal DOM
const openOptionsBtn = document.getElementById("openOptionsBtn");
const optionsModal = document.getElementById("optionsModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalBtn2 = document.getElementById("closeModalBtn2");
const modalOverlay = document.querySelector(".modal-overlay");
const modalAvatar = document.getElementById("modalAvatar");
const modalPseudo = document.getElementById("modalPseudo");
const modalId = document.getElementById("modalId");
const modalChangeBtn = document.getElementById("modalChangeBtn");
const modalAdminBtn = document.getElementById("modalAdminBtn");
const previewAvatar = document.getElementById("previewAvatar");
const previewLine = document.getElementById("previewLine");
const previewTime = document.getElementById("previewTime");

// Utilitaires utilisateur (localStorage)
function getUserId() {
  let userId = localStorage.getItem("userId");
  try {
    if (!userId && window.crypto && crypto.randomUUID) {
      userId = crypto.randomUUID();
    } else if (!userId) {
      userId = 'uid-' + Date.now() + '-' + Math.floor(Math.random()*10000);
    }
  } catch (e) {
    userId = 'uid-' + Date.now() + '-' + Math.floor(Math.random()*10000);
  }
  if (!localStorage.getItem("userId")) localStorage.setItem("userId", userId);
  return userId;
}

// Pseudo : demandé au premier envoi, stocké (défaut "Invitéw")
function getPseudo(askIfMissing = true) {
  let pseudo = localStorage.getItem("pseudo");
  if (!pseudo && askIfMissing) {
    pseudo = prompt("Choisis un pseudo (affiché publiquement) :", "Vous");
    if (!pseudo || pseudo.trim() === "") pseudo = "Invité";
    localStorage.setItem("pseudo", pseudo);
  }
  return pseudo || null;
}

// Couleur : une couleur HSL générée et stockée
function getColor() {
  let color = localStorage.getItem("color");
  if (!color) {
    const hue = Math.floor(Math.random() * 360);
    color = `hsl(${hue} 70% 30%)`;
    localStorage.setItem("color", color);
  }
  return color;
}

// Affiche infos utilisateur
const myId = getUserId();
function refreshMeUI() {
  const p = getPseudo(false) || "Vous";
  const color = getColor();
  if (meAvatar) meAvatar.style.background = color;
  if (meAvatar) meAvatar.textContent = (p && p[0]) ? p[0] : "?";
  if (mePseudoEl) mePseudoEl.textContent = p;
  if (meIdEl) meIdEl.textContent = myId.slice(0, 8);

  // update modal & preview too if open
  if (modalAvatar) modalAvatar.style.background = color;
  if (modalAvatar) modalAvatar.textContent = (p && p[0]) ? p[0] : "?";
  if (modalPseudo) modalPseudo.textContent = p;
  if (modalId) modalId.textContent = myId.slice(0,8);

  if (previewAvatar) previewAvatar.style.background = color;
  if (previewAvatar) previewAvatar.textContent = (p && p[0]) ? p[0] : "?";
  if (previewLine) previewLine.textContent = p + " • " + formatDate(new Date());
  if (previewTime) previewTime.textContent = formatDateTime(new Date());
}
refreshMeUI();

// État: banned set (local)
let bannedSet = new Set();
let isAdmin = false;

// Recevoir la liste des bannis en temps réel
onValue(bannedRef, snapshot => {
  bannedSet.clear();
  if (snapshot.exists()) {
    snapshot.forEach(child => {
      bannedSet.add(child.key);
    });
  }
  renderMessagesFromCache();
});

// Cache local messages
let messagesCache = [];

// Abonnement messages
onValue(messagesRef, snapshot => {
  messagesCache = [];
  if (snapshot.exists()) {
    snapshot.forEach(child => {
      const key = child.key;
      const data = child.val();
      messagesCache.push({ key, ...data });
    });
    messagesCache.sort((a,b) => (a.date||0) - (b.date||0));
  }
  renderMessagesFromCache();
  scrollToBottom();
});

// NOTE: ancienne définition de renderMessagesFromCache (si présente) a été supprimée
// pour éviter la double déclaration. La version unique et finale est ci-dessous.

/* ======================================================
   Rendu des messages depuis messagesCache (version finale)
   - insère un séparateur de date (ex: Mercredi 26 Août 2025)
   - affiche "Pseudo • HH:MM" sous chaque message
   ====================================================== */
function renderMessagesFromCache() {
  if (!messagesEl) return;
  messagesEl.innerHTML = "";

  let lastDateString = null;

  for (const msg of messagesCache) {
    const dateObj = msg.date ? new Date(msg.date) : null;
    const dateString = dateObj ? formatDate(dateObj) : null;

    // Si on change de jour -> insérer un séparateur
    if (dateString && dateString !== lastDateString) {
      const sep = document.createElement("div");
      sep.className = "date-separator";
      sep.textContent = dateString;
      messagesEl.appendChild(sep);
      lastDateString = dateString;
    }

    const row = document.createElement("div");
    row.className = "msg-row";
    if (msg.uid === myId) row.classList.add("own");

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.style.background = msg.color || getColor();
    avatar.textContent = (msg.user && msg.user[0]) ? msg.user[0] : "?";
    avatar.title = `Utilisateur : ${msg.user || 'Invité'}\nID: ${msg.uid || 'unknown'}`;

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    // couleur appliquée via variable CSS pour n'affecter que la bordure
    bubble.style.setProperty("--msg-color", msg.color || getColor());
    bubble.style.color = "white";

    // contenu du message
    const content = document.createElement("div");
    const lines = String(msg.text || '').split(/\r?\n/);
    lines.forEach((ln, i) => {
      content.appendChild(document.createTextNode(ln));
      if (i < lines.length - 1) content.appendChild(document.createElement("br"));
    });

    // meta : Pseudo • HH:MM
    const meta = document.createElement("div");
    meta.className = "msg-meta";
    meta.textContent = `${msg.user || 'Invité'} • ${dateObj ? formatTime(dateObj) : ""}`;

    if (bannedSet.has(msg.uid)) {
      bubble.classList.add("msg-banned");
      content.textContent = "Message masqué (utilisateur banni).";
      meta.textContent = `${msg.user || 'Utilisateur banni'} • ${dateObj ? formatTime(dateObj) : ""}`;
    }

    // on place le meta SOUS le message (et non au-dessus)
    bubble.appendChild(content);
    bubble.appendChild(meta);

    bubble.style.cursor = isAdmin ? "pointer" : "default";
    bubble.addEventListener("click", (ev) => {
      if (!isAdmin) return;
      if (!msg.uid) return;
      const uid = msg.uid;
      if (bannedSet.has(uid)) {
        if (confirm(`Débannir l'utilisateur ${msg.user || uid.slice(0,8)} ?`)) {
          remove(ref(db, "banned/" + uid));
        }
      } else {
        if (confirm(`Bannir l'utilisateur ${msg.user || uid.slice(0,8)} ?\n(Le ban est par navigateur; l'utilisateur récupérera un nouvel ID s'il efface son stockage.)`)) {
          set(ref(db, "banned/" + uid), true);
        }
      }
    });

    row.appendChild(avatar);
    row.appendChild(bubble);

    row.dataset.uid = msg.uid;
    row.dataset.key = msg.key;

    messagesEl.appendChild(row);
  }
}

// Envoi message
async function sendMessage() {
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return;
  const uid = getUserId();
  if (bannedSet.has(uid)) {
    alert("Ton navigateur est banni, tu ne peux pas poster.");
    return;
  }
  let pseudo = getPseudo(true);
  const msg = {
    text,
    user: pseudo,
    uid,
    color: getColor(),
    date: Date.now()
  };
  try {
    await push(messagesRef, msg);
    inputEl.value = "";
    setTimeout(scrollToBottom, 150);
  } catch (err) {
    console.error("Erreur en envoyant:", err);
    alert("Erreur en envoyant le message. Vérifie la configuration Firebase.");
  }
}

if (sendBtn) sendBtn.addEventListener("click", sendMessage);
if (inputEl) inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Fonction pour changer pseudo (réutilisée)
function changePseudoFlow() {
  const current = localStorage.getItem("pseudo") || "Invitéw";
  const p = prompt("Nouveau pseudo :", current);
  if (p && p.trim() !== "") {
    localStorage.setItem("pseudo", p.trim());
    refreshMeUI();
  }
}

// Change pseudo manuellement (bouton existant)
if (changePseudoBtn) changePseudoBtn.addEventListener("click", changePseudoFlow);

// Activer admin (réutilisé)
function activateAdminFlow() {
  const key = prompt("Clé modérateur : (entre la clé pour activer la modération)");
  if (key === ADMIN_KEY) {
    isAdmin = true;
    if (adminHint) adminHint.style.display = "block";
    alert("Mode modérateur activé. Clique sur un message pour bannir/débannir.");
  } else {
    isAdmin = false;
    if (adminHint) adminHint.style.display = "none";
    if (key !== null) alert("Clé invalide.");
  }
}
if (setAdminBtn) setAdminBtn.addEventListener("click", activateAdminFlow);

// Scroll bottom util
function scrollToBottom() {
  if (!messagesEl) return;
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

/* ======================================================
   AJOUTS : updateFooterHeight + détection clavier (visualViewport)
   (déjà présents, inchangés)
   ====================================================== */

// Met à jour la variable CSS --footer-height pour que .messages ait le bon padding-bottom
function updateFooterHeight() {
  const footer = document.querySelector('.footer');
  if (!footer) return;
  document.documentElement.style.setProperty('--footer-height', footer.offsetHeight + 'px');
}

// Gestion du masquage du header lorsque le clavier est ouvert
const root = document.documentElement;
let initialHeaderHeight = getComputedStyle(root).getPropertyValue('--header-height') || '72px';
initialHeaderHeight = initialHeaderHeight.trim() || '72px';

let lastViewportHeight = null;
let keyboardOpen = false;
const KEYBOARD_THRESHOLD = 120; // px, ajustable selon besoin

function setHeaderHidden(hidden) {
  if (hidden) {
    // Supprime la hauteur du header et ajoute une classe pour animation
    root.style.setProperty('--header-height', '0px');
    document.body.classList.add('keyboard-open');
  } else {
    // Restaure la hauteur stockée
    root.style.setProperty('--header-height', initialHeaderHeight);
    document.body.classList.remove('keyboard-open');
  }
  // mettre à jour la hauteur du footer / scroll
  updateFooterHeight();
  setTimeout(scrollToBottom, 40);
}

function onViewportResize() {
  const vv = window.visualViewport;
  const vh = vv ? vv.height : window.innerHeight;

  if (lastViewportHeight === null) lastViewportHeight = vh;

  // clavier ouvert si la hauteur visible diminue beaucoup
  if (!keyboardOpen && lastViewportHeight - vh > KEYBOARD_THRESHOLD) {
    keyboardOpen = true;
    setHeaderHidden(true);
  }
  // clavier fermé si la hauteur visible augmente beaucoup
  else if (keyboardOpen && vh - lastViewportHeight > KEYBOARD_THRESHOLD) {
    keyboardOpen = false;
    setHeaderHidden(false);
  }

  lastViewportHeight = vh;
}

function onWindowResizeFallback() {
  const vh = window.innerHeight;
  if (lastViewportHeight === null) lastViewportHeight = vh;

  if (!keyboardOpen && lastViewportHeight - vh > KEYBOARD_THRESHOLD) {
    keyboardOpen = true; setHeaderHidden(true);
  } else if (keyboardOpen && vh - lastViewportHeight > KEYBOARD_THRESHOLD) {
    keyboardOpen = false; setHeaderHidden(false);
  }
  lastViewportHeight = vh;
}

// si l'input reçoit le focus, on attend un petit délai puis on vérifie
if (inputEl) {
  inputEl.addEventListener('focus', () => {
    setTimeout(() => {
      if (window.visualViewport) {
        onViewportResize();
      } else {
        // fallback : on suppose ouverture clavier sur mobile
        setHeaderHidden(true);
      }
    }, 160);
  });

  inputEl.addEventListener('blur', () => {
    setTimeout(() => {
      if (window.visualViewport) onViewportResize();
      else setHeaderHidden(false);
    }, 120);
  });
}

// écouteurs pour adaptation dynamique
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', onViewportResize);
} else {
  window.addEventListener('resize', onWindowResizeFallback);
}

// Appels d'initialisation
window.addEventListener('load', () => {
  // met à jour la hauteur du footer pour que messages ait le padding-bottom correct
  updateFooterHeight();

  // initialise lastViewportHeight pour la détection clavier
  lastViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  // on s'assure que le footer height est recalculé après rendu
  setTimeout(updateFooterHeight, 80);
});

/* ======================================================
   FIN des AJOUTS
   ====================================================== */

// Modal logic (mise à jour minimale: body.modal-open ajouté/retiré)
function openModal() {
  if (!optionsModal) return;
  optionsModal.classList.add("open");
  optionsModal.setAttribute("aria-hidden","false");
  document.body.classList.add('modal-open'); // <-- lock page scroll
  refreshMeUI();
}
function closeModal() {
  if (!optionsModal) return;
  optionsModal.classList.remove("open");
  optionsModal.setAttribute("aria-hidden","true");
  document.body.classList.remove('modal-open'); // <-- unlock page scroll
}

if (openOptionsBtn) openOptionsBtn.addEventListener("click", openModal);
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (closeModalBtn2) closeModalBtn2.addEventListener("click", closeModal);
if (modalOverlay) modalOverlay.addEventListener("click", () => closeModal());

// Modal buttons reuse flows
if (modalChangeBtn) modalChangeBtn.addEventListener("click", () => { closeModal(); setTimeout(changePseudoFlow, 150); });
if (modalAdminBtn) modalAdminBtn.addEventListener("click", () => { closeModal(); setTimeout(activateAdminFlow, 150); });

// Format helpers (jour complet FR, et heure "HH:MM")
function pad(n) { return n < 10 ? '0' + n : n; }
function formatDate(d) {
  const jours = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  const mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTime(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function formatDateTime(d) { return `${formatDate(d)} ${formatTime(d)}`; }

// Initial UI update
refreshMeUI();
setTimeout(scrollToBottom, 400);