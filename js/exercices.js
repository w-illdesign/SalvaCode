// =========================
// JSON des modules d'exercices
// =========================
const modules = [

  {
  "titre": "Variables & Types de données",
  "exercices": [
    {
      "enonce": "Créer une variable et l’afficher.",
      "items": [
        "Créer une variable <code>x</code> contenant la valeur 10.",
        "Afficher la valeur de <code>x</code> avec <code>print()</code>."
      ],
      "solution": "\n# Solution\nx = 10\nprint(x)\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Afficher le type d’une variable.",
      "items": [
        "Déclarer <code>pi = 3.14</code>.",
        "Afficher son type avec <code>type()</code>."
      ],
      "solution": "\n# Solution\npi = 3.14\nprint(type(pi))  # <class 'float'>\n      ",
      "solutionCmd": true
    },
    {
      "enonce": "Modifier la valeur d’une variable.",
      "items": [
        "Créer une variable <code>nom = \"Awa\"</code>.",
        "Changer sa valeur en <code>\"Moussa\"</code>.",
        "Afficher le résultat."
      ],
      "solution": "\n# Solution\nnom = \"Awa\"\nnom = \"Moussa\"\nprint(nom)\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Créer plusieurs variables en une ligne.",
      "items": [
        "Créer trois variables : <code>a, b, c</code> avec les valeurs <code>1, 2, 3</code>.",
        "Afficher chaque variable."
      ],
      "solution": "\n# Solution\na, b, c = 1, 2, 3\nprint(a, b, c)\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Réaffecter une variable et montrer l’évolution.",
      "items": [
        "Créer une variable <code>compteur</code> avec la valeur 1.",
        "Afficher la valeur avant la modification.",
        "Augmenter la variable de 1 avec <code>compteur = compteur + 1</code> et afficher après."
      ],
      "solution": "\n# Solution\ncompteur = 1\nprint(\"Avant :\", compteur)\ncompteur = compteur + 1\nprint(\"Après :\", compteur)\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Échanger deux variables (sans variable temporaire).",
      "items": [
        "Déclarer <code>a = 3</code> et <code>b = 7</code>.",
        "Échanger leurs valeurs sans créer de troisième variable.",
        "Afficher <code>a</code> et <code>b</code> après l'échange."
      ],
      "solution": "\n# Solution\na = 3\nb = 7\na, b = b, a\nprint(a, b)  # affiche : 7 3\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Concaténer (assembler) du texte avec une variable.",
      "items": [
        "Créer une variable <code>prenom</code> avec ton prénom.",
        "Afficher <code>Bonjour [prenom]!</code>."
      ],
      "solution": "\n# Solution\nprenom = \"Samir\"\nprint(\"Bonjour \" + prenom + \"!\")\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Manipuler différents types de données et afficher leur type.",
      "items": [
        "Créer une variable <code>nom</code> avec ton prénom.",
        "Créer une variable <code>age</code> avec ton âge.",
        "Créer une variable <code>est_etudiant</code> avec la valeur booléenne <code>True</code>.",
        "Afficher chaque variable et son type avec <code>type()</code>."
      ],
       "code": "\n# Solution\nnom = \"Alice\"\nage = 20\nest_etudiant = True\n\nprint(nom, type(nom))\nprint(age, type(age))\nprint(est_etudiant, type(est_etudiant))\n      ",
       "codeCmd": true,
      "solution": "\n# Solution\nnom = \"Alice\"\nage = 20\nest_etudiant = True\n\nprint(nom, type(nom))\nprint(age, type(age))\nprint(est_etudiant, type(est_etudiant))\n      ",
      "solutionCmd": true
    },
    {
      "enonce": "Travailler avec les entiers et afficher des messages.",
      "items": [
        "Créer une variable <code>age</code> avec la valeur 20.",
        "Afficher un message disant : « J’ai 20 ans. » en utilisant la variable.",
        "Changer la valeur de <code>age</code> en 21 et réafficher le message."
      ],
      "solution": "\n# Solution\nage = 20\nprint(\"J’ai\", age, \"ans.\")\nage = 21\nprint(\"J’ai\", age, \"ans.\")\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Manipuler les nombres décimaux (float).",
      "items": [
        "Créer une variable <code>prix</code> avec la valeur 19.99.",
        "Afficher le prix avec un message.",
        "Ajouter 5.00 au prix et afficher le nouveau total."
      ],
      "solution": "\n# Solution\nprix = 19.99\nprint(\"Le prix est de\", prix, \"$\")\nprix = prix + 5.00\nprint(\"Nouveau prix :\", prix, \"$\")\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Opérations avec les variables (somme, différence, produit).",
      "items": [
        "Créer une variable <code>a = 5</code> et une variable <code>b = 3</code>.",
        "Calculer leur somme, leur différence et leur produit.",
        "Afficher les résultats avec des phrases explicites."
      ],
      "solution": "\n# Solution\na = 5\nb = 3\nsomme = a + b\ndifference = a - b\nproduit = a * b\n\nprint(\"Somme =\", somme)\nprint(\"Différence =\", difference)\nprint(\"Produit =\", produit)\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Vérifier le type des variables (int, float, str).",
      "items": [
        "Créer trois variables : <code>x = 7</code>, <code>y = 3.5</code>, <code>z = \"Bonjour\"</code>.",
        "Afficher leur type avec <code>type()</code>.",
        "Observer la différence entre int, float et str."
      ],
      "solution": "\n# Solution\nx = 7\ny = 3.5\nz = \"Bonjour\"\n\nprint(type(x))  # <class 'int'>\nprint(type(y))  # <class 'float'>\nprint(type(z))  # <class 'str'>\n      ",
      "solutionCmd": true
    },
    {
      "enonce": "Conversions de types (texte → int).",
      "items": [
        "Créer une variable <code>texte = \"42\"</code>.",
        "Convertir ce texte en entier et l’affecter à une nouvelle variable <code>nombre</code>.",
        "Ajouter <code>8</code> à <code>nombre</code> et afficher le résultat."
      ],
      "solution": "\n# Solution\ntexte = \"42\"\nnombre = int(texte)\nresultat = nombre + 8\nprint(resultat)  # 50\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Convertir un nombre en texte (int → str).",
      "items": [
        "Créer une variable <code>age</code> qui vaut <code>25</code>.",
        "Convertir <code>age</code> en texte avec <code>str()</code>.",
        "Concaténer avec une phrase et afficher."
      ],
      "solution": "\n# Solution\nage = 25\ntexte = \"J'ai \" + str(age) + \" ans.\"\nprint(texte)\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Mini défi : mélanger les types correctement.",
      "items": [
        "Créer une variable <code>prenom = 'Samir'</code> et une variable <code>age = 18</code>.",
        "Afficher un message : « Samir a 18 ans. » en transformant correctement les types pour éviter une erreur."
      ],
      "solution": "\n# Solution\nprenom = \"Samir\"\nage = 18\nprint(prenom + \" a \" + str(age) + \" ans.\")\n# ou : print(f\"{prenom} a {age} ans.\")\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Erreur : addition entre entier et texte (TypeError).",
      "items": [
        "Créer une variable <code>nombre = 3</code>.",
        "Créer une variable <code>texte = \"2\"</code>.",
        "Tenter d’additionner les deux (<code>nombre + texte</code>).",
        "Observer l’erreur puis corriger en convertissant <code>texte</code> en entier."
      ],
      "solution": "\n# Solution corrigée\nnombre = 3\ntexte = \"2\"\nprint(nombre + int(texte))  # Résultat : 5\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Erreur : variable non définie (NameError).",
      "items": [
        "Taper <code>print(age)</code> sans avoir défini la variable auparavant.",
        "Observer l’erreur (<code>NameError</code>).",
        "Corriger en définissant la variable avant de l’utiliser."
      ],
      "solution": "\n# Solution corrigée\nage = 20\nprint(age)  # Résultat : 20\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Erreur : mauvais type de conversion (ValueError).",
      "items": [
        "Créer une variable <code>texte = \"Bonjour\"</code>.",
        "Essayer de la convertir en entier avec <code>int(texte)</code>.",
        "Observer l’erreur (<code>ValueError</code>).",
        "Corriger en choisissant une variable contenant un nombre au format texte."
      ],
      "solution": "\n# Solution corrigée\ntexte = \"42\"\nprint(int(texte))  # Résultat : 42\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Erreur : majuscules et minuscules dans les variables (sensible à la casse).",
      "items": [
        "Définir une variable <code>age = 25</code>.",
        "Essayer d’afficher <code>Age</code> avec une majuscule.",
        "Observer que Python considère <code>age</code> et <code>Age</code> comme deux variables différentes.",
        "Corriger en respectant la casse."
      ],
      "solution": "\n# Solution corrigée\nage = 25\nprint(age)  # Résultat : 25\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Erreur : oubli des guillemets pour une chaîne de caractères.",
      "items": [
        "Essayer d’afficher un mot sans guillemets (<code>print(Bonjour)</code>).",
        "Observer l’erreur (<code>NameError</code>) car Python pense que <code>Bonjour</code> est une variable.",
        "Corriger en entourant le texte avec des guillemets."
      ],
      "solution": "\n# Solution corrigée\nprint(\"Bonjour\")  # Résultat : Bonjour\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Lister plusieurs valeurs et les parcourir.",
      "items": [
        "Créer une liste <code>notes = [12, 15, 17]</code>.",
        "Parcourir la liste avec une boucle <code>for</code> et afficher chaque élément."
      ],
      "solution": "\n# Solution\nnotes = [12, 15, 17]\nfor note in notes:\n    print(note)\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Créer un dictionnaire et accéder aux valeurs.",
      "items": [
        "Créer un dictionnaire <code>etudiant = {\"nom\": \"Awa\", \"age\": 20}</code>.",
        "Afficher le nom et l’âge en accédant aux clés."
      ],
      "solution": "\n# Solution\netudiant = {\"nom\": \"Awa\", \"age\": 20}\nprint(etudiant[\"nom\"])\nprint(etudiant[\"age\"])\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Tester l’appartenance d’un élément dans une liste.",
      "items": [
        "Créer une liste <code>fruits = [\"pomme\", \"mangue\", \"orange\"]</code>.",
        "Tester si <code>\"mangue\"</code> est dans la liste et afficher le résultat."
      ],
      "solution": "\n# Solution\nfruits = [\"pomme\", \"mangue\", \"orange\"]\nprint(\"mangue\" in fruits)  # True\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Manipuler les ensembles (set).",
      "items": [
        "Créer deux ensembles : <code>A = {1, 2, 3}</code> et <code>B = {3, 4, 5}</code>.",
        "Afficher leur union et leur intersection."
      ],
      "solution": "\n# Solution\nA = {1, 2, 3}\nB = {3, 4, 5}\nprint(A | B)  # union {1, 2, 3, 4, 5}\nprint(A & B)  # intersection {3}\n      ",
      "solutionCmd": false
    },
    {
      "enonce": "Créer un tuple et accéder aux éléments.",
      "items": [
        "Créer un tuple <code>coord = (10, 20)</code>.",
        "Afficher séparément la première et la deuxième valeur."
      ],
      "solution": "\n# Solution\ncoord = (10, 20)\nprint(coord[0])  # 10\nprint(coord[1])  # 20\n      ",
      "solutionCmd": false
    }
  ]
}


];


// =========================
// Génération dynamique
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("modules-container");
  let compteurExo = 1;

  // Créer un bloc code (classique ou cmd)
  function createCodeBlock(code, asCmd = false) {
    const div = document.createElement("div");
    div.className = asCmd ? "cmd-row" : "code-row";

    const pre = document.createElement("pre");
    pre.className = `${asCmd ? "cmd " : ""}language-python`;

    const codeEl = document.createElement("code");
    codeEl.className = "language-python";
    codeEl.textContent = code.trim();

    pre.appendChild(codeEl);
    div.appendChild(pre);

    return div;
  }

  // Boucle sur les modules
  modules.forEach(mod => {
    const titre = document.createElement("h3");
    titre.className = "sous-titre";
    titre.textContent = mod.titre;
    titre.id = mod.titre.toLowerCase().replace(/\s+/g, "-");
    container.appendChild(titre);

    mod.exercices.forEach(exo => {
      const section = document.createElement("section");
      section.className = "module-section-exercice";

      // Header avec case à cocher
      const header = document.createElement("div");
      header.className = "module-header";
      header.innerHTML = `
        <span class="step">Exercice ${compteurExo}</span>
        <label class="round-checkbox">
          <input type="checkbox" id="checkbox-${compteurExo}">
          <span class="checkmark"></span>
        </label>
      `;

      const listDiv = document.createElement("div");
      listDiv.className = "module-list";

      // Énoncé
      const p = document.createElement("p");
      p.innerHTML = exo.enonce;
      listDiv.appendChild(p);

      // Items éventuels
      if (exo.items && exo.items.length > 0) {
        const ul = document.createElement("ul");
        exo.items.forEach(it => {
          const li = document.createElement("li");
          li.innerHTML = it;
          ul.appendChild(li);
        });
        listDiv.appendChild(ul);
      }

      // Bloc code principal
      if (exo.code) {
        const divCmd = createCodeBlock(exo.code, exo.codeCmd === true);
        listDiv.appendChild(divCmd);
      }

      // Bloc solution
      if (exo.solution) {
        const divSol = createCodeBlock(exo.solution, exo.solutionCmd === true);
        divSol.id = `solution-${compteurExo}`;
        divSol.style.display = "none";
        listDiv.appendChild(divSol);
      }

      section.appendChild(header);
      section.appendChild(listDiv);
      container.appendChild(section);

      compteurExo++;
    });
  });

  // Gestion persistance & affichage solutions
  document.querySelectorAll(".round-checkbox input").forEach(checkbox => {
    const id = checkbox.id;
    const exoNum = id.replace("checkbox-", "");

    // Restaurer état
    checkbox.checked = localStorage.getItem("checkbox-" + id) === "true";
    const sol = document.getElementById("solution-" + exoNum);
    if (sol) sol.style.display = checkbox.checked ? "block" : "none";

    // Sur changement
    checkbox.addEventListener("change", () => {
      localStorage.setItem("checkbox-" + id, checkbox.checked);
      const sol = document.getElementById("solution-" + exoNum);
      if (sol) sol.style.display = checkbox.checked ? "block" : "none";
    });
  });

  // Appliquer coloration Prism
  if (window.Prism) {
    Prism.highlightAll();
  }
});
