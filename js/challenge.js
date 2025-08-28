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
  const jsDate = new Date(fullYear, month - 1, day, hours, minutes, seconds);

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
  {
    id: 1,
    title: "Somme de la liste",
    difficulty: "001",
    deadline: parseCustomDeadline("23:00:00 29.08.25"),
    description: "Écrire une fonction qui prend une liste de nombres et renvoie la somme.",
    tags: ["listes", "fonctions"],
    solution: cleanCode(`def somme_liste(nums):
    return sum(nums)`)
  },
  {
    id: 2,
    title: "Palindrome",
    difficulty: "002",
    deadline: parseCustomDeadline("13:30:00 18.09.25"),
    description: "Vérifier si une chaîne est un palindrome (ignorant espaces et casse).",
    tags: ["chaînes", "algorithmie"],
    solution: cleanCode(`def est_palindrome(s):
    s = ''.join(c.lower() for c in s if c.isalnum())
    return s == s[::-1]`)
  },
  {
    id: 3,
    title: "FizzBuzz",
    difficulty: "003",
    deadline: parseCustomDeadline("09:00:00 19.09.22"),
    description: "Afficher les nombres 1..n en remplaçant les multiples de 3 par 'Fizz' et de 5 par 'Buzz'.",
    tags: ["boucles", "conditions"],
    solution: cleanCode(`
        
        
        
        
    def fizzbuzz(n):
        for i in range(1, n+1):
            if i % 15 == 0: print("FizzBuzz")
            elif i % 3 == 0: print("Fizz")
            elif i % 5 == 0: print("Buzz")
            else: print(i)
            
            
            
    `)
  },
  {
    id: 4,
    title: "Compteur de mots",
    difficulty: "004",
    deadline: parseCustomDeadline("11:15:00 20.09.25"),
    description: "Compter la fréquence des mots dans un texte donné.",
    tags: ["dictionnaires", "texte"],
    solution: cleanCode(`from collections import Counter
import re

def compteur_mots(text):
    words = re.findall(r"\\w+", text.lower())
    return Counter(words)`)
  },
  {
    id: 5,
    title: "Quicksort",
    difficulty: "005",
    deadline: parseCustomDeadline("15:45:00 21.09.25"),
    description: "Implémenter un algorithme de tri (ex: quicksort).",
    tags: ["tri", "complexité"],
    solution: cleanCode(`def quicksort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr)//2]
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + mid + quicksort(right)`)
  },
  {
    id: 6,
    title: "Mini calculatrice",
    difficulty: "006",
    deadline: parseCustomDeadline("18:00:00 22.09.25"),
    description: "Créer une calculatrice simple (add/sub/mul/div).",
    tags: ["fonctions", "maths"],
    solution: cleanCode(`def calculatrice(a, b, op):
    if op == '+': return a+b
    if op == '-': return a-b
    if op == '*': return a*b
    if op == '/': return a/b if b != 0 else None
    raise ValueError("Opérateur invalide")`)
  }
];

// ==============================
// Données des participants
// ==============================

export const PARTICIPANTS = [
  {
    id: 1,
    name: "M67",
    avatar: "participants/p3.jpg",
    score: 6.7,
  },
  {
    id: 2,
    name: "Chris",
    avatar: "participants/p2.jpg",
    score: 6.6,
  },
  {
    id: 3,
    name: "Serge",
    avatar: "participants/p1.png",
    score: 1.7,
  },
  {
    id: 4,
    name: "Will43",
    avatar: "participants/p6.png",
    score: 7.1,
  },
];