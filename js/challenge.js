// ==============================
// Utilitaires
// ==============================

/**
 * Convertit une date définie manuellement au format "HH:mm:ss dd.MM.yy"
 * vers le format ISO "YYYY-MM-DDTHH:mm:ss"
 * Exemple : "12:30:00 17.09.25" → "2025-09-17T12:30:00"
 */
function parseCustomDeadline(input) {
  const [time, date] = input.split(" "); // "12:30:00" + "17.09.25"
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const [day, month, year] = date.split(".").map(Number);

  const fullYear = year < 100 ? 2000 + year : year; // 25 → 2025
  const jsDate = new Date(fullYear, month - 1, day , hours + 2 , minutes, seconds);

  return jsDate.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
}

/**
 * Nettoie les chaînes de code → supprime espaces/retours au début et à la fin
 */
/**
 * Nettoie un bloc de texte (code ou autre) :
 *  - supprime les retours vides en début et fin
 *  - enlève l'indentation minimale commune
 */
function cleanCode(code) {
  if (!code) return "";

  // Découper en lignes et enlever les blancs au début/fin
  let lines = code.replace(/\r\n?/g, "\n").trim().split("\n");

  // Enlever encore lignes vides tout en haut et bas
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

  // Trouver indentation minimale parmi lignes non vides
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === "") continue; // ignorer lignes vides
    const match = line.match(/^(\s*)/);
    if (match) minIndent = Math.min(minIndent, match[0].length);
  }

  // Enlever indentation trouvée
  if (minIndent !== Infinity && minIndent > 0) {
    lines = lines.map(line => line.startsWith(" ".repeat(minIndent)) 
      ? line.slice(minIndent) 
      : line);
  }

  return lines.join("\n");
}

// ==============================
// Données des challenges
// ==============================
export const CHALLENGES = [
  // --- Dimanche (anciennement 14ème) ---
  {
    id: 1,
    title: "Swap de variables",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("00:00:00 10.09.25"),
    description: "Échangez les valeurs de deux variables sans créer de variable temporaire. Technique très utile en Python.",
    tags: ["variables", "swap"],
    solution: cleanCode(`
x = 5
y = 10

# Swap en une seule ligne
x, y = y, x
print("x =", x, "y =", y)
    `)
  },
  {
    id: 2,
    title: "Interpolation de chaînes avec f-strings",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("20:00:00 10.09.25"),
    description: "Apprenez à insérer des variables dans une chaîne grâce aux f-strings pour un affichage plus lisible.",
    tags: ["chaînes", "f-strings"],
    solution: cleanCode(`
nom = "Serge"
age = 20

# Utilisation de f-strings
print(f"Je m'appelle {nom} et j'ai {age} ans.")
    `)
  },
  {
    id: 3,
    title: "Calcul cercle",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("00:00:00 10.09.25"),
    description: "Calculez l'aire et la circonférence d'un cercle en utilisant des variables et des opérations mathématiques.",
    tags: ["maths", "variables"],
    solution: cleanCode(`
rayon = 5
pi = 3.1416

# Circonférence = 2 * pi * rayon
circonference = 2 * pi * rayon

# Aire = pi * rayon^2
aire = pi * rayon**2

print("Circonférence :", circonference)
print("Aire :", aire)
    `)
  },
  {
    id: 4,
    title: "Affectation multiple",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("20:00:00 10.09.25"),
    description: "Attribuez plusieurs valeurs à plusieurs variables sur une seule ligne. Pratique pour simplifier le code.",
    tags: ["variables", "affectation"],
    solution: cleanCode(`
# Affectation multiple
a, b, c = 1, 2, 3
print("a =", a, "b =", b, "c =", c)
    `)
  },
  {
    id: 5,
    title: "Bonnes pratiques de nommage",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("00:00:00 10.09.25"),
    description: "Apprenez à nommer correctement vos variables. Certaines formes sont interdites ou déconseillées.",
    tags: ["variables", "naming"],
    solution: cleanCode(`
# Variables valides
age = 20
prenom_utilisateur = "Serge"
taille1 = 1.75

# Variables invalides (commentées)
# 1age = 20
# prénom-utilisateur = "Serge"
# taille cm = 1.75
    `)
  },
  {
    id: 6,
    title: "Chaînes multi-lignes",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("20:00:00 10.09.25"),
    description: "Créez une chaîne sur plusieurs lignes avec triple guillemets. Cela permet d'écrire des textes longs facilement.",
    tags: ["chaînes", "print"],
    solution: cleanCode(`
texte = """Bonjour,
Bienvenue dans le monde Python !"""
print(texte)
    `)
  },
  {
    id: 7,
    title: "Booléens",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("00:00:00 10.09.25"),
    description: "Créez une variable booléenne qui indique si une condition est vraie ou fausse. Très utile pour les tests et conditions.",
    tags: ["booléens", "conditions"],
    solution: cleanCode(`
x = 5
y = 10

# Comparaison qui retourne True ou False
resultat = x < y
print("x < y ?", resultat)
    `)
  },
  {
    id: 8,
    title: "Conversion de types",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("20:00:00 10.09.25"),
    description: "Transformez une saisie utilisateur en entier ou en flottant. C'est essentiel pour manipuler correctement les données reçues.",
    tags: ["types", "conversion"],
    solution: cleanCode(`
# Saisie utilisateur
valeur = input("Entrez un nombre : ")

# Conversion en entier
entier = int(valeur)

# Conversion en flottant
flottant = float(valeur)

print("Entier :", entier)
print("Flottant :", flottant)
    `)
  },
  {
    id: 9,
    title: "Opérations sur les nombres",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("00:00:00 10.09.25"),
    description: "Effectuez des opérations de base : addition, soustraction, multiplication, division et modulo. C'est la base pour manipuler des nombres en Python.",
    tags: ["nombres", "opérations"],
    solution: cleanCode(`
a = 8
b = 3

# Addition
print("a + b =", a + b)

# Soustraction
print("a - b =", a - b)

# Multiplication
print("a * b =", a * b)

# Division
print("a / b =", a / b)

# Reste de la division (modulo)
print("a % b =", a % b)
    `)
  },
  {
    id: 10,
    title: "Concaténation de chaînes",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("20:00:00 10.09.25"),
    description: "Combinez prénom et nom pour afficher le nom complet. Ceci illustre comment joindre plusieurs chaînes en Python.",
    tags: ["chaînes", "concaténation"],
    solution: cleanCode(`
prenom = "Serge"
nom = "Kasongo"

# On concatène avec le signe +
nom_complet = prenom + " " + nom
print("Nom complet :", nom_complet)
    `)
  },
  {
    id: 11,
    title: "Saisie utilisateur",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("00:00:00 10.09.25"),
    description: "Demandez à l'utilisateur de saisir son prénom et son âge. Ceci permet de comprendre comment récupérer des données depuis l'extérieur du programme.",
    tags: ["input", "print"],
    solution: cleanCode(`
# Saisie utilisateur
prenom = input("Entrez votre prénom : ")
age = input("Entrez votre âge : ")

# Affichage avec f-string pour intégrer les variables dans le texte
print(f"Bonjour {prenom}, vous avez {age} ans.")
    `)
  },
  {
    id: 12,
    title: "Modification de variables",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("20:00:00 10.09.25"),
    description: "Apprenez à modifier la valeur d'une variable après sa création. Très utile pour mettre à jour des informations dans un programme.",
    tags: ["variables"],
    solution: cleanCode(`
# Création de la variable
x = 5
print("Valeur initiale de x :", x)

# Modification de la variable
x = 10
print("Nouvelle valeur de x :", x)
    `)
  },
  {
    id: 13,
    title: "Identifier les types de données",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("00:00:00 10.09.25"),
    description: "Apprenez à connaître le type d'une variable avec type(). Ici, vous identifierez un entier, un flottant et une chaîne de caractères.",
    tags: ["types", "type()"],
    solution: cleanCode(`
# Définition des variables
x = 10       # entier
y = 3.14     # flottant
z = "Python" # chaîne de caractères

# Affichage du type de chaque variable
print(type(x))  # <class 'int'>
print(type(y))  # <class 'float'>
print(type(z))  # <class 'str'>
    `)
  },
  {
    id: 14,
    title: "Création de variables et affichage",
    difficulty: "Module 1",
    deadline: parseCustomDeadline("20:00:00 10.09.25"),
    description: "Apprenez à créer des variables pour stocker votre nom, âge et taille. Ensuite, affichez-les à l'aide de print(). Ceci est la base pour manipuler des données en Python.",
    tags: ["variables", "print"],
    solution: cleanCode(`
# On crée les variables pour stocker nos informations
nom = "Serge"
age = 20
taille = 1.75

# On affiche les variables avec print()
print("Nom :", nom)
print("Âge :", age)
print("Taille :", taille)
    `)
  }
];

// ==============================
// Données des participants
// ==============================

export const PARTICIPANTS = [
  {
    id: 1,
    name: "Marc",
    avatar: "participants/p3.jpg",
    score: 6.1+7,
  },
  {
    id: 2,
    name: "Chris",
    avatar: "participants/p2.jpg",
    score: 6,
  },
  {
    id: 3,
    name: "Serge",
    avatar: "participants/p1.png",
    score: 3,
  },
  {
    id: 4,
    name: "Jean",
    avatar: "participants/p6.png",
    score: 7,
  },
];