// Game Logic Utilities
// Handles game state, syllable generation for games, and scoring

import {
    VOWELS,
    CONSONANTS,
    DEFAULT_CONSONANT_CLUSTERS,
    GameState,
    GameDifficulty,
    MatchOption,
    Bubble,
    MemoryCard,
} from './kinyarwanda';

// Generate a random syllable (CV or cluster+V)
export function generateRandomSyllable(customClusters: string[] = [...DEFAULT_CONSONANT_CLUSTERS]): string {
    const useCluster = Math.random() > 0.5;
    const vowel = VOWELS[Math.floor(Math.random() * VOWELS.length)];

    if (useCluster && customClusters.length > 0) {
        const cluster = customClusters[Math.floor(Math.random() * customClusters.length)];
        return cluster + vowel;
    } else {
        const consonant = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
        return consonant + vowel;
    }
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

// Get card count for memory game based on difficulty
export function getCardPairCount(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy': return 3; // 6 cards
        case 'medium': return 4; // 8 cards
        case 'hard': return 6; // 12 cards
        default: return 4;
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

// Generate options for matching game
export function generateMatchingOptions(
    difficulty: GameDifficulty,
    customClusters?: string[]
): { target: string; options: MatchOption[] } {
    const optionCount = getOptionCount(difficulty);
    const syllables = generateUniqueSyllables(optionCount, customClusters);
    const correctIndex = Math.floor(Math.random() * syllables.length);
    const target = syllables[correctIndex];

    const options: MatchOption[] = syllables.map((syllable, index) => ({
        id: `option-${index}-${Date.now()}`,
        syllable,
        isCorrect: index === correctIndex,
        isSelected: false,
    }));

    // Shuffle options
    return {
        target,
        options: options.sort(() => Math.random() - 0.5),
    };
}

// Generate bubbles for bubble pop game
export function generateBubbles(
    difficulty: GameDifficulty,
    customClusters?: string[]
): { target: string; bubbles: Bubble[] } {
    const bubbleCount = getOptionCount(difficulty);
    const syllables = generateUniqueSyllables(bubbleCount, customClusters);
    const correctIndex = Math.floor(Math.random() * syllables.length);
    const target = syllables[correctIndex];

    const bubbles: Bubble[] = syllables.map((syllable, index) => ({
        id: `bubble-${index}-${Date.now()}`,
        syllable,
        isCorrect: index === correctIndex,
        isPopped: false,
        x: Math.random() * 80 + 10, // 10-90% of container width
        y: 100 + index * 20, // Start below the visible area
        speed: 0.3 + Math.random() * 0.3, // Random speed between 0.3 and 0.6
    }));

    return { target, bubbles };
}

// Generate cards for memory game
export function generateMemoryCards(
    difficulty: GameDifficulty,
    customClusters?: string[]
): MemoryCard[] {
    const pairCount = getCardPairCount(difficulty);
    const syllables = generateUniqueSyllables(pairCount, customClusters);

    const cards: MemoryCard[] = [];

    syllables.forEach((syllable, index) => {
        const pairId = `pair-${index}`;
        // Create two cards for each syllable
        cards.push({
            id: `card-${index}-a-${Date.now()}`,
            syllable,
            pairId,
            isFlipped: false,
            isMatched: false,
        });
        cards.push({
            id: `card-${index}-b-${Date.now()}`,
            syllable,
            pairId,
            isFlipped: false,
            isMatched: false,
        });
    });

    // Shuffle cards
    return cards.sort(() => Math.random() - 0.5);
}

// Check if two memory cards match
export function checkMemoryMatch(card1: MemoryCard, card2: MemoryCard): boolean {
    return card1.pairId === card2.pairId && card1.id !== card2.id;
}

// Update game state after correct answer
export function handleCorrectAnswer(state: GameState): GameState {
    const newScore = state.score + 1;
    const newRound = state.currentRound + 1;
    const isComplete = newRound > state.totalRounds;

    return {
        ...state,
        score: newScore,
        currentRound: isComplete ? state.currentRound : newRound,
        isComplete,
        stars: isComplete ? calculateStars(newScore, state.totalRounds) : state.stars,
    };
}

// Update game state after wrong answer
export function handleWrongAnswer(state: GameState): GameState {
    const newRound = state.currentRound + 1;
    const isComplete = newRound > state.totalRounds;

    return {
        ...state,
        currentRound: isComplete ? state.currentRound : newRound,
        isComplete,
        stars: isComplete ? calculateStars(state.score, state.totalRounds) : state.stars,
    };
}
