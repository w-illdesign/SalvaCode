// =========================
// JSON des chapitres
// =========================
const modules = [
  {
    title: "Installation des outils",
    items: [
      "Pour ceux qui ont des smartphones. (Termux)",
      "Pour ceux qui ont des ordinateurs. (Git)",
      "Commandes de navigation et gestions des fichiers",
      "Problèmes <b>fréquents</b>"
    ],
    links: [
      { text: "Notes", href: "module1.html", icon: "M4 4h16v2H4V4zm0 6h16v2H4v-2zm0 6h10v2H4v-2z" }
    ]
  },
  {
    title: "Variables & Types des données",
    items: [
      "Introduction aux variables",
      "Types de données"
    ],
    links: [
      { text: "Notes", href: "module2.html", icon: "M4 4h16v2H4V4zm0 6h16v2H4v-2zm0 6h10v2H4v-2z" },
      { text: "Exercices", href: "exercices.html#variables-&-types-de données", icon: "M19 3H5c-1.1 0-2 .9-2 2v14l7-3 7 3V5c0-1.1-.9-2-2-2z" }
    ]
  }
];

// =========================
// Génération dynamique
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("modules-container");

  modules.forEach((mod, index) => {
    const section = document.createElement("section");
    section.className = "module-section";

    // header
    const header = document.createElement("div");
    header.className = "module-header";
    header.innerHTML = `
      <span class="step">Module ${index + 1}</span>
      <label class="round-checkbox">
        <input type="checkbox" id="checkbox${index + 1}">
        <span class="checkmark"></span>
      </label>
    `;

    // contenu
    const listDiv = document.createElement("div");
    listDiv.className = "module-list";

    // titre
    const h2 = document.createElement("h2");
    h2.innerHTML = mod.title;

    // liste
    const ul = document.createElement("ul");
    mod.items.forEach(it => {
      const li = document.createElement("li");
      li.innerHTML = it;
      ul.appendChild(li);
    });

    // liens
    const actions = document.createElement("div");
    actions.className = "action-links";
    mod.links.forEach(link => {
      const a = document.createElement("a");
      a.href = link.href;
      a.className = "btn-link";
      a.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="${link.icon}"/>
        </svg>
        ${link.text}
      `;
      actions.appendChild(a);
    });

    // assemblage
    listDiv.appendChild(h2);
    listDiv.appendChild(ul);
    listDiv.appendChild(actions);

    section.appendChild(header);
    section.appendChild(listDiv);
    container.appendChild(section);
  });

  // =========================
  // Persistance des cases
  // =========================
  document.querySelectorAll(".round-checkbox input").forEach(checkbox => {
    const id = checkbox.id;
    checkbox.checked = localStorage.getItem("checkbox-" + id) === "true";
    checkbox.addEventListener("change", () => {
      localStorage.setItem("checkbox-" + id, checkbox.checked);
    });
  });
});
