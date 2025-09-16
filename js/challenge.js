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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
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
    difficulty: "Module 2",
    deadline: parseCustomDeadline("20:00:00 10.09.22"),
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
  },
  {
    id: 16,
    title: "Concaténation de chaînes de caractères",
    difficulty: "Module 2",
    deadline: parseCustomDeadline("20:00:00 17.09.25"),
    description: "Apprenez à coller plusieurs textes ensemble avec l’opérateur +. Créez un message personnalisé avec votre prénom et votre hobby.",
    tags: ["variables", "chaînes", "concaténation"],
    solution: cleanCode(`
prenom = "Serge"
hobby = "jouer au foot"

# Concaténation de chaînes
message = "Bonjour, je m'appelle " + prenom + " et j'aime " + hobby + "."

print(message)
    `)
  },
  {
    id: 17,
    title: "Entrée utilisateur avec input()",
    difficulty: "Module 2",
    deadline: parseCustomDeadline("20:00:00 18.09.25"),
    description: "Utilisez la fonction input() pour demander le prénom de l’utilisateur, puis affichez un message de bienvenue.",
    tags: ["input", "variables", "print"],
    solution: cleanCode(`
prenom = input("Entrez votre prénom : ")

print("Bienvenue,", prenom + " !")
    `)
  },
  {
    id: 18,
    title: "Conversions de types simples",
    difficulty: "Module 2",
    deadline: parseCustomDeadline("20:00:00 19.09.25"),
    description: "Demandez à l’utilisateur son âge avec input(). Comme input() renvoie une chaîne, convertissez-la en entier avec int(), puis ajoutez 10 ans.",
    tags: ["input", "int", "conversion"],
    solution: cleanCode(`
age = input("Entrez votre âge : ")
age = int(age)  # conversion en entier

print("Dans 10 ans, vous aurez", age + 10, "ans.")
    `)
  },
  {
    id: 19,
    title: "Conditions simples avec if",
    difficulty: "Module 2",
    deadline: parseCustomDeadline("20:00:00 20.09.25"),
    description: "Apprenez à utiliser une condition. Demandez à l’utilisateur son âge, puis affichez s’il est mineur ou majeur.",
    tags: ["if", "conditions", "input"],
    solution: cleanCode(`
age = int(input("Entrez votre âge : "))

if age >= 18:
    print("Vous êtes majeur.")
else:
    print("Vous êtes mineur.")
    `)
  },
  {
    id: 20,
    title: "Boucle while simple",
    difficulty: "Module 2",
    deadline: parseCustomDeadline("20:00:00 21.09.25"),
    description: "Découvrez la boucle while. Faites un programme qui compte de 1 jusqu’à 5 et affiche chaque nombre.",
    tags: ["while", "boucle", "print"],
    solution: cleanCode(`
compteur = 1

while compteur <= 5:
    print("Compteur :", compteur)
    compteur = compteur + 1
    `),
    
  },{
    id: 21,
    title: "Listes et indexation",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 22.09.25"),
    description: "Créez une liste de fruits, accédez au premier et au dernier élément, et affichez la longueur de la liste.",
    tags: ["listes", "indexation", "len"],
    solution: cleanCode(`
fruits = ["pomme", "banane", "cerise", "mangue"]

# Premier et dernier élément
print("Premier :", fruits[0])
print("Dernier :", fruits[-1])

# Longueur de la liste
print("Nombre de fruits :", len(fruits))
    `)
  },
  {
    id: 22,
    title: "Boucle for sur une liste",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 23.09.25"),
    description: "Parcourez une liste de nombres avec for et affichez leur carré.",
    tags: ["for", "listes", "boucle"],
    solution: cleanCode(`
nombres = [1, 2, 3, 4, 5]

for n in nombres:
    print(n, "au carré =", n * n)
    `)
  },
  {
    id: 23,
    title: "Fonctions simples",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 24.09.25"),
    description: "Définissez une fonction qui prend un nom et renvoie un message de bienvenue personnalisé.",
    tags: ["fonctions", "def", "return"],
    solution: cleanCode(`
def bienvenue(nom):
    return "Bienvenue, " + nom + " !"

msg = bienvenue("Serge")
print(msg)
    `)
  },
  {
    id: 24,
    title: "Méthodes de liste (append, pop)",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 25.09.25"),
    description: "Ajoutez et retirez des éléments d'une liste avec append() et pop().",
    tags: ["listes", "append", "pop"],
    solution: cleanCode(`
jours = ["lundi", "mardi", "mercredi"]

# Ajouter un jour
jours.append("jeudi")
print("Après append :", jours)

# Retirer le dernier élément
dernier = jours.pop()
print("Pop a retiré :", dernier)
print("Liste maintenant :", jours)
    `)
  },
  {
    id: 25,
    title: "Dictionnaires (maps)",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 26.09.25"),
    description: "Créez un dictionnaire pour stocker le prénom, l'âge et la ville, puis accédez aux valeurs.",
    tags: ["dictionnaire", "dict", "clé-valeur"],
    solution: cleanCode(`
personne = {
    "prenom": "Serge",
    "age": 20,
    "ville": "Kinshasa"
}

print("Prénom :", personne["prenom"])
print("Âge :", personne.get("age"))
print("Ville :", personne["ville"])
    `)
  },
  {
    id: 26,
    title: "Boucles imbriquées — table de multiplication",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 27.09.25"),
    description: "Utilisez deux boucles for imbriquées pour afficher la table de multiplication de 1 à 5.",
    tags: ["boucles", "for", "imbriqué"],
    solution: cleanCode(`
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i} x {j} = {i*j}")
    print("---")
    `)
  },
  {
    id: 27,
    title: "Compréhensions de liste",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 28.09.25"),
    description: "Créez une nouvelle liste contenant les carrés des nombres de 0 à 9 en utilisant une compréhension de liste.",
    tags: ["listes", "compréhension", "pythonic"],
    solution: cleanCode(`
carres = [x * x for x in range(10)]
print(carres)
    `)
  },
  {
    id: 28,
    title: "Tuples et ensembles (tuple, set)",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 29.09.25"),
    description: "Comprenez la différence entre tuple (immutable) et set (ensemble non-ordonné). Créez et affichez-les.",
    tags: ["tuple", "set", "collections"],
    solution: cleanCode(`
coord = (10, 20)          # tuple
fruits = {"pomme", "banane", "pomme"}  # set (duplication supprimée)

print("Tuple :", coord)
print("Set :", fruits)
    `)
  },
  {
    id: 29,
    title: "Fichiers : lecture et écriture",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 30.09.25"),
    description: "Écrivez quelques lignes dans un fichier texte, puis lisez-le et affichez son contenu.",
    tags: ["fichiers", "io", "open"],
    solution: cleanCode(`
# Écriture dans un fichier
with open("exemple.txt", "w", encoding="utf-8") as f:
    f.write("Bonjour\\n")
    f.write("Ceci est un fichier de test.\\n")

# Lecture du fichier
with open("exemple.txt", "r", encoding="utf-8") as f:
    contenu = f.read()

print(contenu)
    `)
  },
  {
    id: 30,
    title: "Classes et objets — introduction",
    difficulty: "Module 3",
    deadline: parseCustomDeadline("20:00:00 01.10.25"),
    description: "Créez une classe simple Personne avec un constructeur et une méthode pour afficher une présentation.",
    tags: ["classes", "objets", "OOP"],
    solution: cleanCode(`
class Personne:
    def __init__(self, prenom, age):
        self.prenom = prenom
        self.age = age

    def presenter(self):
        print(f"Je m'appelle {self.prenom} et j'ai {self.age} ans.")

p = Personne("Serge", 20)
p.presenter()
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
    score: 6+1+7+21,
  },
  {
    id: 2,
    name: "Chris",
    avatar: "participants/p2.jpg",
    score: 6+5+4,
  },
  {
    id: 3+6-12+6,
    name: "Serge",
    avatar: "participants/p1.png",
    score: 3+2,
  },
  
  {
    id: 0,
    name: "Smith",
    avatar: "participants/smith.jpg",
    score: 0,
  },
];
