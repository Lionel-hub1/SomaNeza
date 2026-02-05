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

// Game types
export type GameType = 'matching' | 'bubble' | 'memory';

// Game difficulty (number of options/cards)
export type GameDifficulty = 'easy' | 'medium' | 'hard';

// Game state interface
export interface GameState {
  score: number;
  stars: number;
  currentRound: number;
  totalRounds: number;
  isComplete: boolean;
}

// Matching game option
export interface MatchOption {
  id: string;
  syllable: string;
  isCorrect: boolean;
  isSelected: boolean;
}

// Bubble for bubble pop game
export interface Bubble {
  id: string;
  syllable: string;
  isCorrect: boolean;
  isPopped: boolean;
  x: number;
  y: number;
  speed: number;
}

// Memory card
export interface MemoryCard {
  id: string;
  syllable: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

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
}

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  lettersToHide: 1,
  autoGenerateInterval: null,
  enabledPatterns: ['vowel', 'cv', 'cluster'],
  customClusters: [...DEFAULT_CONSONANT_CLUSTERS]
};
