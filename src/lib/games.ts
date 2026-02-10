// Game Logic Utilities for SomaNeza
// Fun, engaging games for children learning to read Kinyarwanda

import {
    VOWELS,
    CONSONANTS,
    DEFAULT_CONSONANT_CLUSTERS,
    GameState,
    GameDifficulty,
    SIMPLE_WORDS,
    GAME_COLORS,
    ENCOURAGEMENTS,
} from './kinyarwanda';

// Generate a random syllable (vowel, CV, or cluster+V)
export function generateRandomSyllable(
    customClusters: string[] = [...DEFAULT_CONSONANT_CLUSTERS],
    includeVowels: boolean = true
): string {
    const rand = Math.random();
    const vowel = VOWELS[Math.floor(Math.random() * VOWELS.length)];

    // 20% chance of just vowel if enabled
    if (includeVowels && rand < 0.2) {
        return vowel;
    }
    // 40% chance of CV
    if (rand < 0.6) {
        const consonant = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
        return consonant + vowel;
    }
    // 40% chance of cluster
    if (customClusters.length > 0) {
        const cluster = customClusters[Math.floor(Math.random() * customClusters.length)];
        return cluster + vowel;
    }
    const consonant = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    return consonant + vowel;
}

// Generate unique syllables
export function generateUniqueSyllables(count: number, customClusters?: string[]): string[] {
    const syllables = new Set<string>();
    let attempts = 0;
    const maxAttempts = count * 10;

    while (syllables.size < count && attempts < maxAttempts) {
        syllables.add(generateRandomSyllable(customClusters));
        attempts++;
    }

    return Array.from(syllables);
}

// Get option count based on difficulty
export function getOptionCount(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy': return 2;
        case 'medium': return 3;
        case 'hard': return 4;
        default: return 3;
    }
}

// Get rounds per game based on difficulty
export function getRoundsPerGame(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy': return 5;
        case 'medium': return 8;
        case 'hard': return 10;
        default: return 5;
    }
}

// Initialize game state
export function initializeGameState(difficulty: GameDifficulty): GameState {
    return {
        score: 0,
        stars: 0,
        currentRound: 1,
        totalRounds: getRoundsPerGame(difficulty),
        isComplete: false,
        streak: 0,
    };
}

// Calculate stars based on score percentage
export function calculateStars(score: number, totalRounds: number): number {
    const percentage = (score / totalRounds) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
}

// Get random color
export function getRandomColor(): string {
    return GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
}

// Get random encouragement
export function getRandomEncouragement(): typeof ENCOURAGEMENTS[0] {
    return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

// =====================
// SCORE HANDLING
// =====================
export function handleCorrectAnswer(state: GameState): GameState {
    const newScore = state.score + 1;
    const newStreak = (state.streak || 0) + 1;
    const newRound = state.currentRound + 1;
    const isComplete = newRound > state.totalRounds;

    return {
        ...state,
        score: newScore,
        streak: newStreak,
        currentRound: isComplete ? state.currentRound : newRound,
        isComplete,
        stars: isComplete ? calculateStars(newScore, state.totalRounds) : state.stars,
    };
}

export function handleWrongAnswer(state: GameState): GameState {
    const newRound = state.currentRound + 1;
    const isComplete = newRound > state.totalRounds;

    return {
        ...state,
        streak: 0,
        currentRound: isComplete ? state.currentRound : newRound,
        isComplete,
        stars: isComplete ? calculateStars(state.score, state.totalRounds) : state.stars,
    };
}
