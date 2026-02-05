// Game Logic Utilities for SomaNeza
// Fun, engaging games for children learning to read Kinyarwanda

import {
    VOWELS,
    CONSONANTS,
    DEFAULT_CONSONANT_CLUSTERS,
    GameState,
    GameDifficulty,
    SoundOption,
    TrainCar,
    FallingStar,
    WordPiece,
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

// Get falling stars count based on difficulty
export function getStarsCount(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy': return 3;
        case 'medium': return 4;
        case 'hard': return 5;
        default: return 3;
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
// SOUND MATCH GAME
// =====================
export function generateSoundMatchOptions(
    difficulty: GameDifficulty,
    customClusters?: string[]
): { target: string; options: SoundOption[] } {
    const optionCount = getOptionCount(difficulty);
    const syllables = generateUniqueSyllables(optionCount, customClusters);
    const correctIndex = Math.floor(Math.random() * syllables.length);
    const target = syllables[correctIndex];

    const options: SoundOption[] = syllables.map((syllable, index) => ({
        id: `option-${index}-${Date.now()}`,
        syllable,
        isCorrect: index === correctIndex,
        isSelected: false,
        color: GAME_COLORS[index % GAME_COLORS.length],
    }));

    return {
        target,
        options: options.sort(() => Math.random() - 0.5),
    };
}

// =====================
// SYLLABLE TRAIN GAME
// =====================
export function generateTrainRound(
    difficulty: GameDifficulty,
    existingCars: TrainCar[],
    customClusters?: string[]
): { target: string; options: SoundOption[] } {
    const optionCount = getOptionCount(difficulty);
    const syllables = generateUniqueSyllables(optionCount, customClusters);
    const correctIndex = Math.floor(Math.random() * syllables.length);
    const target = syllables[correctIndex];

    const options: SoundOption[] = syllables.map((syllable, index) => ({
        id: `option-${index}-${Date.now()}`,
        syllable,
        isCorrect: index === correctIndex,
        isSelected: false,
        color: GAME_COLORS[index % GAME_COLORS.length],
    }));

    return {
        target,
        options: options.sort(() => Math.random() - 0.5),
    };
}

export function createTrainCar(syllable: string, carNumber: number): TrainCar {
    return {
        id: `car-${carNumber}-${Date.now()}`,
        syllable,
        color: GAME_COLORS[carNumber % GAME_COLORS.length],
        isEngine: false,
    };
}

export function createEngine(): TrainCar {
    return {
        id: `engine-${Date.now()}`,
        syllable: '🚂',
        color: 'from-gray-600 to-gray-800',
        isEngine: true,
    };
}

// =====================
// WORD BUILDER GAME
// =====================
export function selectWordForDifficulty(difficulty: GameDifficulty): typeof SIMPLE_WORDS[0] {
    let filteredWords: typeof SIMPLE_WORDS;

    switch (difficulty) {
        case 'easy':
            filteredWords = SIMPLE_WORDS.filter(w => w.syllables.length === 2);
            break;
        case 'medium':
            filteredWords = SIMPLE_WORDS.filter(w => w.syllables.length <= 3);
            break;
        case 'hard':
            filteredWords = SIMPLE_WORDS;
            break;
        default:
            filteredWords = SIMPLE_WORDS.filter(w => w.syllables.length === 2);
    }

    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

export function generateWordPieces(word: typeof SIMPLE_WORDS[0]): WordPiece[] {
    const pieces: WordPiece[] = word.syllables.map((syllable, index) => ({
        id: `piece-${index}-${Date.now()}`,
        syllable,
        position: index,
        isPlaced: false,
        color: GAME_COLORS[index % GAME_COLORS.length],
    }));

    // Shuffle the pieces
    return pieces.sort(() => Math.random() - 0.5);
}

export function checkWordComplete(pieces: WordPiece[], targetWord: typeof SIMPLE_WORDS[0]): boolean {
    const placedPieces = pieces.filter(p => p.isPlaced).sort((a, b) => a.position - b.position);
    if (placedPieces.length !== targetWord.syllables.length) return false;

    return placedPieces.every((piece, index) =>
        piece.syllable === targetWord.syllables[index]
    );
}

// =====================
// FALLING STARS GAME
// =====================
export function generateFallingStars(
    difficulty: GameDifficulty,
    customClusters?: string[]
): { target: string; stars: FallingStar[] } {
    const starCount = getStarsCount(difficulty);
    const syllables = generateUniqueSyllables(starCount, customClusters);
    const correctIndex = Math.floor(Math.random() * syllables.length);
    const target = syllables[correctIndex];

    const stars: FallingStar[] = syllables.map((syllable, index) => ({
        id: `star-${index}-${Date.now()}`,
        syllable,
        isCorrect: index === correctIndex,
        isCaught: false,
        x: (100 / (starCount + 1)) * (index + 1) + (Math.random() * 10 - 5),
        y: -20 - index * 15, // Stagger the start
        speed: 0.2 + Math.random() * 0.15, // Varied speeds
        color: GAME_COLORS[index % GAME_COLORS.length],
        rotation: Math.random() * 360,
    }));

    return { target, stars };
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

// Speech synthesis helper (for sound-based games)
export function speakSyllable(syllable: string, lang: string = 'rw'): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(syllable);
        utterance.lang = lang;
        utterance.rate = 0.8; // Slightly slower for learning
        utterance.pitch = 1.1; // Slightly higher for child-friendly
        window.speechSynthesis.speak(utterance);
    }
}
