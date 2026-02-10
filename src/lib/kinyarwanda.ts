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
export type PatternType = 'vowel' | 'consonant' | 'cv' | 'cluster' | 'mixed';

// Learning modes
export type LearningMode = 'read' | 'guess' | 'progressive';

// Game types - New engaging games for children
export type GameType = 'soundmatch' | 'train' | 'wordbuilder' | 'stars';

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

// Sound match option
export interface SoundOption {
  id: string;
  syllable: string;
  isCorrect: boolean;
  isSelected: boolean;
  color: string; // Fun colors for visual appeal
}

// Train car for syllable train game
export interface TrainCar {
  id: string;
  syllable: string;
  color: string;
  isEngine?: boolean;
}

// Falling star for stars game
export interface FallingStar {
  id: string;
  syllable: string;
  isCorrect: boolean;
  isCaught: boolean;
  x: number;
  y: number;
  speed: number;
  color: string;
  rotation: number;
}

// Word piece for word builder
export interface WordPiece {
  id: string;
  syllable: string;
  position: number;
  isPlaced: boolean;
  color: string;
}

// Simple Kinyarwanda words for WordBuilder (syllable-separated)
export const SIMPLE_WORDS: { word: string; syllables: string[]; meaning: string; emoji: string }[] = [
  { word: 'mama', syllables: ['ma', 'ma'], meaning: 'mother', emoji: '👩' },
  { word: 'papa', syllables: ['pa', 'pa'], meaning: 'father', emoji: '👨' },
  { word: 'inka', syllables: ['i', 'nka'], meaning: 'cow', emoji: '🐄' },
  { word: 'inzu', syllables: ['i', 'nzu'], meaning: 'house', emoji: '🏠' },
  { word: 'ibuka', syllables: ['i', 'bu', 'ka'], meaning: 'remember', emoji: '💭' },
  { word: 'soma', syllables: ['so', 'ma'], meaning: 'read', emoji: '📖' },
  { word: 'kino', syllables: ['ki', 'no'], meaning: 'toy/game', emoji: '🧸' },
  { word: 'imbwa', syllables: ['i', 'mbwa'], meaning: 'dog', emoji: '🐕' },
  { word: 'intama', syllables: ['i', 'nta', 'ma'], meaning: 'sheep', emoji: '🐑' },
  { word: 'amazi', syllables: ['a', 'ma', 'zi'], meaning: 'water', emoji: '💧' },
  { word: 'ibuye', syllables: ['i', 'bu', 'ye'], meaning: 'stone', emoji: '🪨' },
  { word: 'ikawa', syllables: ['i', 'ka', 'wa'], meaning: 'coffee', emoji: '☕' },
  { word: 'umuti', syllables: ['u', 'mu', 'ti'], meaning: 'tree', emoji: '🌳' },
  { word: 'ijoro', syllables: ['i', 'jo', 'ro'], meaning: 'night', emoji: '🌙' },
  { word: 'izuba', syllables: ['i', 'zu', 'ba'], meaning: 'sun', emoji: '☀️' },
  { word: 'ukwezi', syllables: ['u', 'kwe', 'zi'], meaning: 'moon', emoji: '🌛' },
  { word: 'isoko', syllables: ['i', 'so', 'ko'], meaning: 'market', emoji: '🏪' },
  { word: 'umugabo', syllables: ['u', 'mu', 'ga', 'bo'], meaning: 'man', emoji: '👤' },
  { word: 'umugore', syllables: ['u', 'mu', 'go', 're'], meaning: 'woman', emoji: '👩' },
  { word: 'umwana', syllables: ['u', 'mwa', 'na'], meaning: 'child', emoji: '👶' },
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
}

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  lettersToHide: 1,
  autoGenerateInterval: null,
  enabledPatterns: ['vowel', 'cv', 'cluster'],
  customClusters: [...DEFAULT_CONSONANT_CLUSTERS],
  clusterConsonantCounts: 'all',
  prioritizedConsonants: [],
  prioritizedClusters: []
};
