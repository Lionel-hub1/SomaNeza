export const KINYARWANDA_VERB_ROOTS: Record<string, string> = {
  "andik": "write",
  "curang": "play music",
  "curam": "be upside down",
  "curik": "put upside down",
  "dodor": "knock",
  "egam": "lean",
  "erek": "show",
  "ganir": "converse",
  "garam": "lie on back",
  "gi": "go",
  "ha": "give",
  "haramb": "climb",
  "hendahend": "console",
  "himbar": "get excited",
  "hirit": "breathe heavily",
  "hirik": "push",
  "icar": "sit down",
  "ihut": "hurry up",
  "im": "refuse",
  "itab": "answer call",
  "jandajand": "walk around",
  "kambakamb": "crawl",
  "kacang": "chew",
  "kamat": "catch",
  "karab": "wash hands",
  "karag": "press",
  "kat": "cut",
  "king": "open",
  "komang": "knock",
  "kor": "work",
  "mur": "light",
  "nang": "harp",
  "no": "drink",
  "pfu": "die",
  "pfumbat": "hold in hand",
  "rer": "educate",
  "reremb": "float",
  "rigit": "disappear",
  "ririmb": "sing",
  "rumang": "eat hard food",
  "ryam": "go to bed",
  "sandar": "get broken",
  "sab": "ask",
  "samir": "catch",
  "se": "grind",
  "shimut": "steal",
  "shyir": "put",
  "sinzir": "sleep",
  "som": "read",
  "sutam": "squat",
  "takar": "get lost",
  "takamb": "scream for mercy",
  "tamir": "put in mouth",
  "tanag": "make arrows",
  "ta": "throw",
  "tets": "cook",
  "tigit": "tremble",
  "titir": "tremble",
  "tsirit": "press skin",
  "ubak": "build",
  "vug": "talk",
  "vun": "break"
};

/**
 * Converts a verb root to a command (Imperative) by adding 'a'.
 * Note: simplistic rule, works for most regular verbs.
 */
export function getDictionaryWord(root: string): string {
    // Basic rule: add 'a'. Handle vowels if necessary (though usually roots end in consonant).
    // Roots like 'gi' (go) -> 'gira' or 'gya'? 
    // 'gi' is tricky. 'ta' -> 'ta'.
    // Let's stick to the regular consonant-ending ones for safety in the games.
    if (root.endsWith('a') || root.endsWith('i') || root.endsWith('o') || root.endsWith('u') || root.endsWith('e')) {
        return root;
    }
    return root + 'a';
}

export const DICTIONARY_WORDS = Object.keys(KINYARWANDA_VERB_ROOTS)
    .filter(root => root.length > 2) // Filter incredibly short roots for game difficulty balance
    .map(root => ({
        // Transform spelling to standard orthography if needed (e.g. 'uu' -> 'u')
        // For now, raw map.
        word: getDictionaryWord(root),
        meaning: KINYARWANDA_VERB_ROOTS[root as keyof typeof KINYARWANDA_VERB_ROOTS]
    }));
