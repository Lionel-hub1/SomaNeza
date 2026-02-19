// Syllable Generator Logic
// Handles generating valid Kinyarwanda syllables with letter-level separation

import {
    VOWELS,
    CONSONANTS,
    PatternType,
    LetterState,
    SIMPLE_WORDS,
    GeneratedResult,
} from './kinyarwanda';

// Generate a word-based result
export function generateWord(
    filter: 'all' | 'no-clusters' | 'only-clusters',
    requiredClusters: string[] = []
): GeneratedResult {
    let filteredWords = [...SIMPLE_WORDS];

    // First apply the basic structural filter
    if (filter === 'no-clusters') {
        filteredWords = filteredWords.filter(w =>
            !w.syllables.some(s => s.length > 2)
        );
    } else if (filter === 'only-clusters') {
        filteredWords = filteredWords.filter(w =>
            w.syllables.some(s => s.length > 2)
        );
    }

    // Then apply the specific cluster content filter if any clusters are selected
    if (requiredClusters.length > 0) {
        // Filter specifically for words containing ANY of the required clusters
        const preciseMatches = filteredWords.filter(w => {
            const wordLower = w.word.toLowerCase();
            return requiredClusters.some(cluster => wordLower.includes(cluster));
        });

        // If we found matches, use them
        if (preciseMatches.length > 0) {
            filteredWords = preciseMatches;
        }
        // If no matches found but we requested specific clusters, we might want to return 
        // a fallback or keep the previous filtered list. 
        // For now, let's fall back to previous list but maybe the UI should handle "no words found"
    }

    // Fallback if filter is too strict
    if (filteredWords.length === 0) filteredWords = [...SIMPLE_WORDS];

    const wordObj = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    const letters = wordObj.word.split('');

    return {
        letters,
        display: wordObj.word,
        pattern: 'word',
        emoji: wordObj.emoji,
        meaning: wordObj.meaning,
        letterStates: letters.map(letter => ({
            letter,
            isHidden: false,
            isRevealed: false
        }))
    };
}

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

// Weighted selection helper
function pickWeighted<T>(
    items: T[],
    prioritizedItems: T[],
    priorityWeight: number = 0.7
): T {
    if (items.length === 0) return items[0]; // Should not happen with valid settings
    if (prioritizedItems.length === 0) return getRandomElement(items);

    // Filter prioritizedItems to ensure they are actually in the available items
    const validPrioritized = prioritizedItems.filter(item => {
        if (typeof item === 'string') {
            return (items as unknown as string[]).includes(item);
        }
        return false;
    });

    if (validPrioritized.length === 0) return getRandomElement(items);

    // 70% chance to pick from prioritized, 30% from all
    if (Math.random() < priorityWeight) {
        return getRandomElement(validPrioritized);
    }
    return getRandomElement(items);
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
export function generateCV(prioritizedConsonants: string[] = []): GeneratedResult {
    const consonant = pickWeighted([...CONSONANTS], prioritizedConsonants);
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
export function generateClusterV(
    customClusters: string[],
    clusterConsonantCounts: number[] | 'all',
    prioritizedClusters: string[] = [],
    filterContains: string[] = [],
    filterVowel: string | 'all' = 'all'
): GeneratedResult {
    let availableClusters = [...customClusters];

    // Filter by length if needed
    if (clusterConsonantCounts !== 'all' && clusterConsonantCounts.length > 0) {
        availableClusters = availableClusters.filter(cluster =>
            clusterConsonantCounts.includes(cluster.length)
        );
    }

    // Filter by contained letters
    if (filterContains.length > 0) {
        availableClusters = availableClusters.filter(cluster =>
            filterContains.some(letter => cluster.includes(letter))
        );
    }

    // If filter leaves no clusters, fallback to all available
    if (availableClusters.length === 0) {
        availableClusters = [...customClusters];
    }

    const cluster = pickWeighted(availableClusters, prioritizedClusters);

    // Choose vowel based on filter
    let vowel: string;
    if (filterVowel !== 'all' && VOWELS.includes(filterVowel as any)) {
        vowel = filterVowel;
    } else {
        vowel = getRandomElement(VOWELS);
    }

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
    settings: {
        customClusters: string[];
        clusterConsonantCounts: number[] | 'all';

        prioritizedConsonants: string[];
        prioritizedClusters: string[];
        wordFilter: 'all' | 'no-clusters' | 'only-clusters';
        wordFilterClusters?: string[];
        clusterFilterContains: string[];
        clusterFilterVowel: string | 'all';
    }
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
            return generateCV(settings.prioritizedConsonants);
        case 'cluster':
            return generateClusterV(
                settings.customClusters,
                settings.clusterConsonantCounts,
                settings.prioritizedClusters,
                settings.clusterFilterContains,
                settings.clusterFilterVowel
            );
        case 'word':
            return generateWord(settings.wordFilter, settings.wordFilterClusters);
        case 'mixed':
            // For mixed, randomly choose from all types
            const allPatterns: PatternType[] = ['vowel', 'consonant', 'cv', 'cluster', 'word'];
            const randomPattern = getRandomElement(allPatterns);
            return generate([randomPattern], settings);
        default:
            return generateVowel();
    }
}

// Hide random letters in the result
export function hideRandomLetters(
    result: GeneratedResult,
    count: number,
    hideTarget: 'vowels' | 'consonants' | 'both' = 'both'
): GeneratedResult {
    const letterCount = result.letters.length;

    // Determine target characters for this generation
    let targets = hideTarget;
    if (hideTarget === 'both') {
        targets = Math.random() < 0.5 ? 'vowels' : 'consonants';
    }

    // Identify indices that match the target category
    const validIndices = result.letters.map((letter: string, index: number) => {
        const isVowel = VOWELS.includes(letter.toLowerCase() as any);
        if (targets === 'vowels' && isVowel) return index;
        if (targets === 'consonants' && !isVowel) return index;
        return -1;
    }).filter((index: number) => index !== -1);

    // If no matches for the target, fallback to any random letters
    const indicesToPool = validIndices.length > 0 ? validIndices : Array.from({ length: letterCount }, (_: any, i: number) => i);

    // For words, we often want to hide just one letter as requested by user
    const effectiveCount = result.pattern === 'word' ? 1 : Math.min(count, indicesToPool.length);

    // Get random indices to hide from the pool
    const shuffled = [...indicesToPool].sort(() => Math.random() - 0.5);
    const indicesToHide = new Set(shuffled.slice(0, effectiveCount));

    const newLetterStates: LetterState[] = result.letters.map((letter: string, index: number) => ({
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
