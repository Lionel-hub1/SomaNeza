// Kinyarwanda Language Rules
// This module contains all valid phonetic combinations for Kinyarwanda

// Standard vowels
export const VOWELS = ['a', 'e', 'i', 'o', 'u'] as const;

// Standard consonants (single letters that can combine with vowels)
export const CONSONANTS = [
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'm',
  'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z'
] as const;

// Default consonant clusters - these can be customized by the user
export const DEFAULT_CONSONANT_CLUSTERS = [
  'bw', 'by', 'byw', 'cw', 'cy', 'dw', 'fw', 'fy', 'gw', 'hw', 'jw', 'jy', 'kw',
  'mb', 'mbw', 'mby', 'mbyw', 'mf', 'mfw', 'mfy', 'mp', 'mpw', 'mpy', 'mv', 'mvw', 'mvy', 'mvyw', 'mw', 'my',
  'nc', 'ncw', 'ncy', 'nd', 'ndw', 'ndy', 'ng', 'ngw', 'nj', 'njw', 'njy', 'nk', 'nkw', 'nny',
  'ns', 'nsh', 'nshw', 'nshy', 'nshyw', 'nsw', 'nsy', 'nt', 'ntw', 'nty', 'nw', 'ny', 'nyw', 'nz', 'nzw',
  'pf', 'pfw', 'pfy', 'pw', 'py', 'rw', 'ry', 'ryw', 'sh', 'shw', 'shy', 'shyw', 'sw', 'sy',
  'ts', 'tsw', 'tw', 'ty', 'vw', 'vy', 'zw'
] as const;

// Pattern types for generation
export type PatternType = 'vowel' | 'consonant' | 'cv' | 'cluster' | 'word' | 'mixed';

// Learning modes
export type LearningMode = 'read' | 'guess' | 'progressive';

// Game types - Reading-focused games for children (no audio required)
export type GameType = 'syllablematch' | 'missingletter' | 'wordscramble' | 'flashcard';

// Game difficulty (number of options/cards)
export type GameDifficulty = 'easy' | 'medium' | 'hard';

// Game state interface
export interface GameState {
  score: number;
  stars: number;
  currentRound: number;
  totalRounds: number;
  isComplete: boolean;
  streak?: number; // For bonus encouragement
}

// Simple Kinyarwanda words for WordBuilder (syllable-separated)
export const SIMPLE_WORDS: { word: string; syllables: string[]; meaning: string; emoji: string }[] = [
  { word: 'mama', syllables: ['ma', 'ma'], meaning: 'Umubyeyi w\'umugore', emoji: '👩' },
  { word: 'papa', syllables: ['pa', 'pa'], meaning: 'Umubyeyi w\'umugabo', emoji: '👨' },
  { word: 'inka', syllables: ['i', 'nka'], meaning: 'Itungo riduha amata', emoji: '🐄' },
  { word: 'inzu', syllables: ['i', 'nzu'], meaning: 'Aho dutaha', emoji: '🏠' },
  { word: 'ibuka', syllables: ['i', 'bu', 'ka'], meaning: 'Kudakora ikosa ryo kwibagirwa', emoji: '💭' },
  { word: 'soma', syllables: ['so', 'ma'], meaning: 'Vuga ibyanditse', emoji: '📖' },
  { word: 'kino', syllables: ['ki', 'no'], meaning: 'Ikintu abana bakinisha', emoji: '🧸' },
  { word: 'imbwa', syllables: ['i', 'mbwa'], meaning: 'Itungo ririnda urugo', emoji: '🐕' },
  { word: 'intama', syllables: ['i', 'nta', 'ma'], meaning: 'Itungo ritanga ubwoya', emoji: '🐑' },
  { word: 'amazi', syllables: ['a', 'ma', 'zi'], meaning: 'Icyo tunywa gitemba', emoji: '💧' },
  { word: 'ibuye', syllables: ['i', 'bu', 'ye'], meaning: 'Ikintu gikomeye kiba ku butaka', emoji: '🪨' },
  { word: 'ikawa', syllables: ['i', 'ka', 'wa'], meaning: 'Igihingwa benga bakanywa', emoji: '☕' },
  { word: 'umuti', syllables: ['u', 'mu', 'ti'], meaning: 'Icyo ufata iyo urwaye ngo ukire', emoji: '🌳' },
  { word: 'ijoro', syllables: ['i', 'jo', 'ro'], meaning: 'Igihe izuba rirenga', emoji: '🌙' },
  { word: 'izuba', syllables: ['i', 'zu', 'ba'], meaning: 'Urumuri rumurika ku manywa', emoji: '☀️' },
  { word: 'ukwezi', syllables: ['u', 'kwe', 'zi'], meaning: 'Urumuri rumurika nijoro', emoji: '🌛' },
  { word: 'isoko', syllables: ['i', 'so', 'ko'], meaning: 'Ahantu abantu bahahira', emoji: '🏪' },
  { word: 'umugabo', syllables: ['u', 'mu', 'ga', 'bo'], meaning: 'Umuntu mukuru w\'igitsina gabo', emoji: '👤' },
  { word: 'umugore', syllables: ['u', 'mu', 'go', 're'], meaning: 'Umuntu mukuru w\'igitsina gore', emoji: '👩' },
  { word: 'umwana', syllables: ['u', 'mwa', 'na'], meaning: 'Umuntu muto uvuka ku babyeyi', emoji: '👶' },
  { word: 'umupira', syllables: ['u', 'mu', 'pi', 'ra'], meaning: 'Ikintu gipima kijya gukina', emoji: '⚽' },
  { word: 'imodoka', syllables: ['i', 'mo', 'do', 'ka'], meaning: 'Ikinyabiziga kigendamo abantu', emoji: '🚗' },
  { word: 'indege', syllables: ['i', 'nde', 'ge'], meaning: 'Ikintu kiguruka gitwara abantu', emoji: '✈️' },
  { word: 'igare', syllables: ['i', 'ga', 're'], meaning: 'Ikintu cy\'amapine abiri', emoji: '🚲' },
  { word: 'ishuri', syllables: ['i', 'shu', 'ri'], meaning: 'Aho abana bajya kwiga', emoji: '🏫' },
  { word: 'ikaramu', syllables: ['i', 'ka', 'ra', 'mu'], meaning: 'Icyo dukoresha twandika', emoji: '🖊️' },
  { word: 'igitabo', syllables: ['i', 'gi', 'ta', 'bo'], meaning: 'Icyo dusomamo cyangwa twandikamo', emoji: '📚' },
  { word: 'intebe', syllables: ['i', 'nte', 'be'], meaning: 'Icyo twicaraho', emoji: '🪑' },
  { word: 'ameza', syllables: ['a', 'me', 'za'], meaning: 'Icyo turiraho cyangwa twandikiraho', emoji: '🪑' },
  { word: 'isahani', syllables: ['i', 'sa', 'ha', 'ni'], meaning: 'Icyo turiraho ibiryo', emoji: '🍽️' },
  { word: 'ikiyiko', syllables: ['i', 'ki', 'yi', 'ko'], meaning: 'Icyo turisha ibiryo', emoji: '🥄' },
  { word: 'imboga', syllables: ['i', 'mbo', 'ga'], meaning: 'Ibiribwa bituruka ku bihingwa', emoji: '🥬' },
  { word: 'imbuto', syllables: ['i', 'mbu', 'to'], meaning: 'Ibiribwa biryohera', emoji: '🍎' },
  { word: 'amata', syllables: ['a', 'ma', 'ta'], meaning: 'Icyo kunywa gikamwa inka', emoji: '🥛' },
  { word: 'umugati', syllables: ['u', 'mu', 'ga', 'ti'], meaning: 'Icyo kurya gikozwe mu ngano', emoji: '🍞' },
  { word: 'igi', syllables: ['i', 'gi'], meaning: 'Icyo inkoko itera', emoji: '🥚' },
  { word: 'ifi', syllables: ['i', 'fi'], meaning: 'Inyamaswa iba mu mazi', emoji: '🐟' },
  { word: 'inkoko', syllables: ['i', 'nko', 'ko'], meaning: 'Itungo ritanga amagi', emoji: '🐔' },
  { word: 'urukwavu', syllables: ['u', 'ru', 'kwa', 'vu'], meaning: 'Itungo rirya ibyatsi', emoji: '🐇' },
  { word: 'injangwe', syllables: ['i', 'nja', 'ngwe'], meaning: 'Itungo ryo mu rugo rifata imbeba', emoji: '🐱' },
  { word: 'inzovu', syllables: ['i', 'nzo', 'vu'], meaning: 'Inyamaswa nini cyane', emoji: '🐘' },
  { word: 'intare', syllables: ['i', 'nta', 're'], meaning: 'Umwami w\'ishyamba', emoji: '🦁' },
  { word: 'ingagi', syllables: ['i', 'nga', 'gi'], meaning: 'Inyamaswa nini iba mu birunga', emoji: '🦍' },
  { word: 'isaha', syllables: ['i', 'sa', 'ha'], meaning: 'Ikidwereka igihe', emoji: '⌚' },
  { word: 'inkweto', syllables: ['i', 'nkwe', 'to'], meaning: 'Imyambaro y\'ibirenge', emoji: '👞' },
  { word: 'ikoti', syllables: ['i', 'ko', 'ti'], meaning: 'Umwenda uturinda imbeho', emoji: '🧥' },
  { word: 'isogisi', syllables: ['i', 'so', 'gi', 'si'], meaning: 'Umwenda wambarwa mu nkweto', emoji: '🧦' },
  { word: 'umutaka', syllables: ['u', 'mu', 'ta', 'ka'], meaning: 'Icyo twikinga imvura', emoji: '☂️' },
  { word: 'indabo', syllables: ['i', 'nda', 'bo'], meaning: 'Ibihingwa bifite impumuro nziza', emoji: '💐' },
  { word: 'igiti', syllables: ['i', 'gi', 'ti'], meaning: 'Igihingwa kinini gifite amashami', emoji: '🌳' },
];

// Encouraging messages in Kinyarwanda
export const ENCOURAGEMENTS = [
  { text: 'Byiza cyane!', meaning: 'Very good!', emoji: '🎉' },
  { text: 'Wabikoze neza!', meaning: 'Well done!', emoji: '⭐' },
  { text: 'Uri umuhanga!', meaning: 'You are smart!', emoji: '🧠' },
  { text: 'Komeza urtya!', meaning: 'Keep it up!', emoji: '💪' },
  { text: 'Ni byiza!', meaning: 'That\'s good!', emoji: '👍' },
  { text: 'Urakoze!', meaning: 'Thank you!', emoji: '🙏' },
  { text: 'Urashobora!', meaning: 'You can do it!', emoji: '✨' },
];

// Fun colors for game elements
export const GAME_COLORS = [
  'from-pink-400 to-rose-500',
  'from-purple-400 to-indigo-500',
  'from-blue-400 to-cyan-500',
  'from-emerald-400 to-green-500',
  'from-amber-400 to-orange-500',
  'from-red-400 to-pink-500',
];

// Difficulty levels for progressive mode
export type DifficultyLevel = 1 | 2 | 3;

// Get patterns for a specific difficulty level in progressive mode
export function getPatternsForDifficulty(level: DifficultyLevel): PatternType[] {
  switch (level) {
    case 1:
      return ['vowel'];
    case 2:
      return ['vowel', 'cv'];
    case 3:
      return ['vowel', 'cv', 'cluster'];
    default:
      return ['vowel'];
  }
}

// Type definitions for letter state
export interface LetterState {
  letter: string;
  isHidden: boolean;
  isRevealed: boolean;
}

// Generated result with letter separation
export interface GeneratedResult {
  letters: string[];      // Individual letters: ["k", "w", "a"]
  display: string;        // Combined display: "kwa"
  pattern: PatternType;   // What pattern was used
  letterStates: LetterState[];  // State for each letter
  emoji?: string;        // For word pattern
  meaning?: string;      // For word pattern
}

// Settings interface
export interface AppSettings {
  lettersToHide: number;
  autoGenerateInterval: number | null; // null means disabled, number is ms
  enabledPatterns: PatternType[];
  customClusters: string[];
  clusterConsonantCounts: number[] | 'all';
  prioritizedConsonants: string[];
  prioritizedClusters: string[];
  hideTarget: 'vowels' | 'consonants' | 'both';
  wordFilter: 'all' | 'no-clusters' | 'only-clusters';
}

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  lettersToHide: 1,
  autoGenerateInterval: null,
  enabledPatterns: ['vowel', 'cv', 'cluster'],
  customClusters: [...DEFAULT_CONSONANT_CLUSTERS],
  clusterConsonantCounts: 'all',
  prioritizedConsonants: [],
  prioritizedClusters: [],
  hideTarget: 'both',
  wordFilter: 'all',
};
