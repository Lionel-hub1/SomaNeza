// Syllable Generator Logic
// Handles generating valid Kinyarwanda syllables with letter-level separation

import {
    VOWELS,
    CONSONANTS,
    PatternType,
    GeneratedResult,
    LetterState,
} from './kinyarwanda';

// Split a cluster into individual letters
export function splitIntoLetters(text: string): string[] {
    // Handle special multi-character representations
    // In Kinyarwanda, 'sh' is often treated as a single sound but we split it for learning
    return text.split('');
}

// Get a random element from an array
function getRandomElement<T>(arr: readonly T[] | T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a vowel-only result
export function generateVowel(): GeneratedResult {
    const vowel = getRandomElement(VOWELS);
    const letters = [vowel];

    return {
        letters,
        display: vowel,
        pattern: 'vowel',
        letterStates: letters.map(letter => ({
            letter,
            isHidden: false,
            isRevealed: false
        }))
    };
}

// Generate a consonant-only result
export function generateConsonant(): GeneratedResult {
    const consonant = getRandomElement(CONSONANTS);
    const letters = [consonant];

    return {
        letters,
        display: consonant,
        pattern: 'consonant',
        letterStates: letters.map(letter => ({
            letter,
            isHidden: false,
            isRevealed: false
        }))
    };
}

// Generate a consonant + vowel (CV) combination
export function generateCV(): GeneratedResult {
    const consonant = getRandomElement(CONSONANTS);
    const vowel = getRandomElement(VOWELS);
    const letters = [consonant, vowel];

    return {
        letters,
        display: letters.join(''),
        pattern: 'cv',
        letterStates: letters.map(letter => ({
            letter,
            isHidden: false,
            isRevealed: false
        }))
    };
}

// Generate a consonant cluster + vowel combination
export function generateClusterV(customClusters: string[]): GeneratedResult {
    const cluster = getRandomElement(customClusters);
    const vowel = getRandomElement(VOWELS);
    const clusterLetters = splitIntoLetters(cluster);
    const letters = [...clusterLetters, vowel];

    return {
        letters,
        display: letters.join(''),
        pattern: 'cluster',
        letterStates: letters.map(letter => ({
            letter,
            isHidden: false,
            isRevealed: false
        }))
    };
}

// Main generation function - generates based on enabled patterns
export function generate(
    enabledPatterns: PatternType[],
    customClusters: string[]
): GeneratedResult {
    if (enabledPatterns.length === 0) {
        // Default to vowel if nothing enabled
        return generateVowel();
    }

    const pattern = getRandomElement(enabledPatterns);

    switch (pattern) {
        case 'vowel':
            return generateVowel();
        case 'consonant':
            return generateConsonant();
        case 'cv':
            return generateCV();
        case 'cluster':
            return generateClusterV(customClusters);
        case 'mixed':
            // For mixed, randomly choose from all types
            const allPatterns: PatternType[] = ['vowel', 'consonant', 'cv', 'cluster'];
            const randomPattern = getRandomElement(allPatterns);
            if (randomPattern === 'cluster') {
                return generateClusterV(customClusters);
            }
            return generate([randomPattern], customClusters);
        default:
            return generateVowel();
    }
}

// Hide random letters in the result
export function hideRandomLetters(
    result: GeneratedResult,
    count: number
): GeneratedResult {
    const letterCount = result.letters.length;
    const hideCount = Math.min(count, letterCount - 1); // Always show at least one

    // Get random indices to hide
    const indices = Array.from({ length: letterCount }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    const indicesToHide = new Set(shuffled.slice(0, hideCount));

    const newLetterStates: LetterState[] = result.letters.map((letter, index) => ({
        letter,
        isHidden: indicesToHide.has(index),
        isRevealed: false
    }));

    return {
        ...result,
        letterStates: newLetterStates
    };
}

// Hide specific letters by indices (for teacher control)
export function hideSpecificLetters(
    result: GeneratedResult,
    indicesToHide: number[]
): GeneratedResult {
    const hiddenSet = new Set(indicesToHide);

    const newLetterStates: LetterState[] = result.letters.map((letter, index) => ({
        letter,
        isHidden: hiddenSet.has(index),
        isRevealed: false
    }));

    return {
        ...result,
        letterStates: newLetterStates
    };
}

// Reveal a specific letter
export function revealLetter(
    result: GeneratedResult,
    index: number
): GeneratedResult {
    const newLetterStates = result.letterStates.map((state, i) => {
        if (i === index && state.isHidden) {
            return { ...state, isRevealed: true };
        }
        return state;
    });

    return {
        ...result,
        letterStates: newLetterStates
    };
}

// Reveal all hidden letters
export function revealAllLetters(result: GeneratedResult): GeneratedResult {
    const newLetterStates = result.letterStates.map(state => ({
        ...state,
        isRevealed: state.isHidden ? true : state.isRevealed
    }));

    return {
        ...result,
        letterStates: newLetterStates
    };
}

// Toggle hide state for a specific letter (for teacher mode)
export function toggleLetterHidden(
    result: GeneratedResult,
    index: number
): GeneratedResult {
    const newLetterStates = result.letterStates.map((state, i) => {
        if (i === index) {
            return {
                ...state,
                isHidden: !state.isHidden,
                isRevealed: false
            };
        }
        return state;
    });

    return {
        ...result,
        letterStates: newLetterStates
    };
}

// Reset all letters to visible (for teacher resetting the board)
export function showAllLetters(result: GeneratedResult): GeneratedResult {
    const newLetterStates = result.letterStates.map(state => ({
        ...state,
        isHidden: false,
        isRevealed: false
    }));

    return {
        ...result,
        letterStates: newLetterStates
    };
}
