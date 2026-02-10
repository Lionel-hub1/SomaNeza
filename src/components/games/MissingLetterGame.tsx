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

interface RoundData {
    word: typeof SIMPLE_WORDS[0];
    displayParts: string[]; // e.g. ["so", "___", "a"] where ___ is the hidden syllable
    hiddenIndex: number;
    options: string[];
    correctAnswer: string;
}

function getOptionCount(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy': return 2;
        case 'medium': return 3;
        case 'hard': return 4;
        default: return 3;
    }
}

function generateRound(difficulty: GameDifficulty, usedWords: Set<string>): RoundData {
    // Pick words with at least 2 syllables (ideally 3+ for medium/hard)
    const minSyllables = difficulty === 'easy' ? 2 : 3;
    let pool = SIMPLE_WORDS.filter(
        w => w.syllables.length >= minSyllables && !usedWords.has(w.word)
    );
    if (pool.length < 3) {
        pool = SIMPLE_WORDS.filter(w => w.syllables.length >= 2);
    }

    const word = pool[Math.floor(Math.random() * pool.length)];
    usedWords.add(word.word);

    // Choose which syllable to hide
    const hiddenIndex = Math.floor(Math.random() * word.syllables.length);
    const correctAnswer = word.syllables[hiddenIndex];

    // Build display parts
    const displayParts = word.syllables.map((s, i) =>
        i === hiddenIndex ? '___' : s
    );

    // Generate wrong options from other syllables in the language
    const allSyllables = new Set<string>();
    SIMPLE_WORDS.forEach(w => w.syllables.forEach(s => allSyllables.add(s)));
    allSyllables.delete(correctAnswer);

    const wrongOptions = Array.from(allSyllables)
        .sort(() => Math.random() - 0.5)
        .slice(0, getOptionCount(difficulty) - 1);

    const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

    return { word, displayParts, hiddenIndex, options, correctAnswer };
}

export default function MissingLetterGame({ difficulty, onComplete, onBack }: Props) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [round, setRound] = useState<RoundData | null>(null);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string; answer?: string } | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [usedWords] = useState<Set<string>>(new Set());

    const startRound = useCallback(() => {
        setRound(generateRound(difficulty, usedWords));
        setFeedback(null);
        setSelectedOption(null);
    }, [difficulty, usedWords]);

    useEffect(() => {
        startRound();
    }, [startRound]);

    const handleAnswer = (option: string) => {
        if (feedback || !round) return; // Prevent double-click
        setSelectedOption(option);

        const isCorrect = option === round.correctAnswer;
        let newState: GameState;

        if (isCorrect) {
            newState = handleCorrectAnswer(gameState);
            const enc = getRandomEncouragement();
            setFeedback({ correct: true, message: `${enc.emoji} ${enc.text}` });
        } else {
            newState = handleWrongAnswer(gameState);
            setFeedback({
                correct: false,
                message: `Igisubizo ni: ${round.word.syllables.join('')}`,
                answer: round.correctAnswer,
            });
        }

        setTimeout(() => {
            if (newState.isComplete) {
                onComplete(newState);
            } else {
                setGameState(newState);
                startRound();
            }
        }, isCorrect ? 1000 : 2000);
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
                    <h3 className="text-xl font-bold text-gray-800">🧩 Uzuza Igice</h3>
                    <p className="text-xs text-gray-500">Fill the Missing Part</p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">{gameState.score} ⭐</div>
                    <div className="text-xs text-gray-500">Round {gameState.currentRound}/{gameState.totalRounds}</div>
                </div>
            </div>

            {/* Word Display with Hint */}
            <div className="text-center space-y-2">
                <div className="text-6xl">{round.word.emoji}</div>
                <p className="text-sm text-gray-500 capitalize">{round.word.meaning}</p>
            </div>

            {/* Syllable Display with Gap */}
            <div className="flex items-center justify-center gap-1 flex-wrap">
                {round.displayParts.map((part, i) => (
                    <span
                        key={i}
                        className={`
                            text-3xl md:text-5xl font-bold px-3 py-2 rounded-xl transition-all duration-300
                            ${part === '___'
                                ? feedback?.correct
                                    ? 'bg-green-100 text-green-700 border-2 border-green-400'
                                    : feedback && !feedback.correct
                                        ? 'bg-red-100 text-red-700 border-2 border-red-400'
                                        : 'bg-amber-100 text-amber-600 border-2 border-amber-300 border-dashed animate-pulse'
                                : 'text-gray-800'
                            }
                        `}
                    >
                        {part === '___'
                            ? feedback
                                ? round.correctAnswer
                                : '?'
                            : part
                        }
                    </span>
                ))}
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`text-center py-3 rounded-xl text-lg font-bold ${feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                    {!feedback.correct && (
                        <p className="text-sm font-normal mt-1">
                            <span className="font-bold">{round.word.word}</span> = {round.word.meaning}
                        </p>
                    )}
                </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {round.options.map((option, i) => {
                    const isCorrectOption = option === round.correctAnswer;
                    const isSelected = selectedOption === option;
                    const showResult = feedback !== null;

                    return (
                        <button
                            key={`${option}-${i}`}
                            onClick={() => handleAnswer(option)}
                            disabled={!!feedback}
                            className={`
                                py-4 px-6 rounded-2xl text-2xl md:text-3xl font-bold transition-all duration-300
                                ${showResult && isCorrectOption
                                    ? 'bg-green-500 text-white scale-105 shadow-lg'
                                    : showResult && isSelected && !isCorrectOption
                                        ? 'bg-red-400 text-white scale-95'
                                        : showResult
                                            ? 'bg-gray-100 text-gray-400 scale-95'
                                            : `bg-gradient-to-br ${GAME_COLORS[i % GAME_COLORS.length]} text-white shadow-md hover:shadow-xl hover:scale-105 active:scale-95`
                                }
                            `}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
