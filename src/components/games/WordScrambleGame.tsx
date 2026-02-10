'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    GameDifficulty,
    GameState,
    SIMPLE_WORDS,
    GAME_COLORS,
} from '@/lib/kinyarwanda';
import {
    initializeGameState,
    handleCorrectAnswer,
    handleWrongAnswer,
    getRandomEncouragement,
} from '@/lib/games';

interface Props {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

interface DraggableSyllable {
    id: string;
    text: string;
    originalIndex: number;
}

interface RoundData {
    word: typeof SIMPLE_WORDS[0];
    scrambled: DraggableSyllable[];
}

function generateRound(difficulty: GameDifficulty, usedWords: Set<string>): RoundData {
    const minSyllables = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 3;
    const maxSyllables = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 99;

    let pool = SIMPLE_WORDS.filter(
        w => w.syllables.length >= minSyllables &&
            w.syllables.length <= maxSyllables &&
            !usedWords.has(w.word)
    );
    if (pool.length < 3) {
        pool = SIMPLE_WORDS.filter(w => w.syllables.length >= 2);
    }

    const word = pool[Math.floor(Math.random() * pool.length)];
    usedWords.add(word.word);

    // Create syllable items and shuffle
    const scrambled: DraggableSyllable[] = word.syllables
        .map((text, i) => ({
            id: `syl-${i}-${Date.now()}`,
            text,
            originalIndex: i,
        }));

    // Shuffle until it's actually different from the correct order
    let shuffled = [...scrambled];
    let attempts = 0;
    do {
        shuffled = [...scrambled].sort(() => Math.random() - 0.5);
        attempts++;
    } while (
        shuffled.every((s, i) => s.originalIndex === i) && attempts < 20
    );

    return { word, scrambled: shuffled };
}

export default function WordScrambleGame({ difficulty, onComplete, onBack }: Props) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [round, setRound] = useState<RoundData | null>(null);
    const [placed, setPlaced] = useState<(DraggableSyllable | null)[]>([]);
    const [available, setAvailable] = useState<DraggableSyllable[]>([]);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [usedWords] = useState<Set<string>>(new Set());

    const startRound = useCallback(() => {
        const newRound = generateRound(difficulty, usedWords);
        setRound(newRound);
        setPlaced(new Array(newRound.word.syllables.length).fill(null));
        setAvailable([...newRound.scrambled]);
        setFeedback(null);
    }, [difficulty, usedWords]);

    useEffect(() => {
        startRound();
    }, [startRound]);

    const handlePlaceSyllable = (syllable: DraggableSyllable) => {
        if (feedback) return;

        // Find first empty slot
        const emptyIndex = placed.findIndex(p => p === null);
        if (emptyIndex === -1) return;

        const newPlaced = [...placed];
        newPlaced[emptyIndex] = syllable;
        setPlaced(newPlaced);
        setAvailable(prev => prev.filter(s => s.id !== syllable.id));

        // Check if all slots filled
        const allFilled = newPlaced.every(p => p !== null);
        if (allFilled && round) {
            const isCorrect = newPlaced.every(
                (p, i) => p!.originalIndex === i
            );

            let newState: GameState;
            if (isCorrect) {
                newState = handleCorrectAnswer(gameState);
                const enc = getRandomEncouragement();
                setFeedback({ correct: true, message: `${enc.emoji} ${enc.text}` });
            } else {
                newState = handleWrongAnswer(gameState);
                setFeedback({
                    correct: false,
                    message: `Igisubizo: ${round.word.syllables.join(' · ')}`,
                });
            }

            setTimeout(() => {
                if (newState.isComplete) {
                    onComplete(newState);
                } else {
                    setGameState(newState);
                    startRound();
                }
            }, isCorrect ? 1200 : 2500);
        }
    };

    const handleRemoveSyllable = (index: number) => {
        if (feedback) return;
        const syllable = placed[index];
        if (!syllable) return;

        const newPlaced = [...placed];
        newPlaced[index] = null;
        setPlaced(newPlaced);
        setAvailable(prev => [...prev, syllable]);
    };

    const handleReset = () => {
        if (feedback || !round) return;
        setPlaced(new Array(round.word.syllables.length).fill(null));
        setAvailable([...round.scrambled]);
    };

    if (!round) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors">
                    ← Subira
                </button>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">🔀 Shyira mu Murongo</h3>
                    <p className="text-xs text-gray-500">Unscramble the Word</p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">{gameState.score} ⭐</div>
                    <div className="text-xs text-gray-500">Round {gameState.currentRound}/{gameState.totalRounds}</div>
                </div>
            </div>

            {/* Word Hint */}
            <div className="text-center space-y-2">
                <div className="text-6xl">{round.word.emoji}</div>
                <p className="text-lg text-gray-600 capitalize font-medium">{round.word.meaning}</p>
            </div>

            {/* Placement Slots */}
            <div className="flex items-center justify-center gap-2 flex-wrap min-h-[80px]">
                {placed.map((syllable, i) => (
                    <button
                        key={`slot-${i}`}
                        onClick={() => handleRemoveSyllable(i)}
                        className={`
                            min-w-[64px] h-16 px-4 rounded-2xl text-2xl font-bold transition-all duration-300 border-2
                            ${syllable
                                ? feedback?.correct
                                    ? 'bg-green-100 border-green-400 text-green-700'
                                    : feedback && !feedback.correct
                                        ? 'bg-red-100 border-red-400 text-red-700'
                                        : 'bg-white border-indigo-300 text-gray-800 shadow-md hover:border-red-300 hover:bg-red-50 cursor-pointer'
                                : 'bg-gray-100 border-dashed border-gray-300 text-gray-300'
                            }
                        `}
                        disabled={!syllable || !!feedback}
                    >
                        {syllable ? syllable.text : (i + 1)}
                    </button>
                ))}
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`text-center py-3 rounded-xl text-lg font-bold ${feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                    {!feedback.correct && (
                        <p className="text-base font-normal mt-1">
                            <span className="font-bold">{round.word.word}</span> = {round.word.meaning} {round.word.emoji}
                        </p>
                    )}
                </div>
            )}

            {/* Available Syllables */}
            <div className="flex items-center justify-center gap-3 flex-wrap min-h-[60px]">
                {available.map((syllable, i) => (
                    <button
                        key={syllable.id}
                        onClick={() => handlePlaceSyllable(syllable)}
                        disabled={!!feedback}
                        className={`
                            py-3 px-6 rounded-2xl text-2xl font-bold text-white
                            bg-gradient-to-br ${GAME_COLORS[i % GAME_COLORS.length]}
                            shadow-lg hover:shadow-xl hover:scale-110 active:scale-95
                            transition-all duration-200
                            ${feedback ? 'opacity-50' : ''}
                        `}
                    >
                        {syllable.text}
                    </button>
                ))}
            </div>

            {/* Reset button */}
            {!feedback && available.length < round.scrambled.length && (
                <div className="text-center">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                    >
                        🔄 Ongera utangire (Reset)
                    </button>
                </div>
            )}
        </div>
    );
}
