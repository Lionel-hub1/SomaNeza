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
    getRoundsPerGame,
} from '@/lib/games';

interface Props {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

interface FlashCard {
    word: typeof SIMPLE_WORDS[0];
    options: { text: string; isCorrect: boolean }[];
    mode: 'word-to-meaning' | 'meaning-to-word';
}

function getOptionCount(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy': return 2;
        case 'medium': return 3;
        case 'hard': return 4;
        default: return 3;
    }
}

function generateCard(difficulty: GameDifficulty, usedWords: Set<string>): FlashCard {
    let pool = SIMPLE_WORDS.filter(w => !usedWords.has(w.word));
    if (pool.length < 4) {
        pool = [...SIMPLE_WORDS];
    }

    const word = pool[Math.floor(Math.random() * pool.length)];
    usedWords.add(word.word);

    const optionCount = getOptionCount(difficulty);
    // Randomly decide: show word → pick meaning, OR show meaning → pick word
    const mode: FlashCard['mode'] = Math.random() > 0.5 ? 'word-to-meaning' : 'meaning-to-word';

    // Get wrong answers from other words
    const others = SIMPLE_WORDS.filter(w => w.word !== word.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, optionCount - 1);

    let options: { text: string; isCorrect: boolean }[];

    if (mode === 'word-to-meaning') {
        options = [
            { text: `${word.emoji} ${word.meaning}`, isCorrect: true },
            ...others.map(w => ({ text: `${w.emoji} ${w.meaning}`, isCorrect: false })),
        ];
    } else {
        options = [
            { text: word.word, isCorrect: true },
            ...others.map(w => ({ text: w.word, isCorrect: false })),
        ];
    }

    return {
        word,
        options: options.sort(() => Math.random() - 0.5),
        mode,
    };
}

export default function FlashCardGame({ difficulty, onComplete, onBack }: Props) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [card, setCard] = useState<FlashCard | null>(null);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [usedWords] = useState<Set<string>>(new Set());
    const [streak, setStreak] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    const startCard = useCallback(() => {
        setCard(generateCard(difficulty, usedWords));
        setFeedback(null);
        setSelectedIndex(null);
        setTimer(0);
        setIsTimerActive(true);
    }, [difficulty, usedWords]);

    useEffect(() => {
        startCard();
    }, [startCard]);

    // Timer
    useEffect(() => {
        if (!isTimerActive) return;
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isTimerActive]);

    const handleAnswer = (optionIndex: number) => {
        if (feedback || !card) return;
        setSelectedIndex(optionIndex);
        setIsTimerActive(false);

        const option = card.options[optionIndex];
        let newState: GameState;

        if (option.isCorrect) {
            newState = handleCorrectAnswer(gameState);
            const enc = getRandomEncouragement();
            setFeedback({ correct: true, message: `${enc.emoji} ${enc.text}` });
            setStreak(prev => prev + 1);
        } else {
            newState = handleWrongAnswer(gameState);
            const correctAnswer = card.mode === 'word-to-meaning'
                ? `${card.word.emoji} ${card.word.meaning}`
                : card.word.word;
            setFeedback({
                correct: false,
                message: `Igisubizo: ${correctAnswer}`,
            });
            setStreak(0);
        }

        setTimeout(() => {
            if (newState.isComplete) {
                onComplete(newState);
            } else {
                setGameState(newState);
                startCard();
            }
        }, option.isCorrect ? 1000 : 2000);
    };

    if (!card) return null;

    const totalRounds = getRoundsPerGame(difficulty);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors">
                    ← Subira
                </button>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">⚡ Soma Vuba</h3>
                    <p className="text-xs text-gray-500">Speed Reading Cards</p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">{gameState.score} ⭐</div>
                    <div className="text-xs text-gray-500">Round {gameState.currentRound}/{gameState.totalRounds}</div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-center gap-4">
                {streak >= 2 && (
                    <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                        🔥 {streak} streak!
                    </div>
                )}
                <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    ⏱ {timer}s
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(gameState.currentRound / totalRounds) * 100}%` }}
                />
            </div>

            {/* Flash Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center space-y-4 min-h-[180px] flex flex-col items-center justify-center">
                {card.mode === 'word-to-meaning' ? (
                    <>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Soma ijambo:</p>
                        <div className="text-5xl md:text-6xl font-bold text-gray-800 tracking-wide">
                            {card.word.word}
                        </div>
                        <p className="text-sm text-gray-400">Ni iki bisobanura? (What does it mean?)</p>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">
                            Ni irihe jambo? (Which word?)
                        </p>
                        <div className="text-5xl">{card.word.emoji}</div>
                        <div className="text-2xl font-bold text-gray-700 capitalize">
                            {card.word.meaning}
                        </div>
                    </>
                )}
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`text-center py-3 rounded-xl text-lg font-bold ${feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
                {card.options.map((option, i) => {
                    const isSelected = selectedIndex === i;
                    const showResult = feedback !== null;

                    return (
                        <button
                            key={`opt-${i}`}
                            onClick={() => handleAnswer(i)}
                            disabled={!!feedback}
                            className={`
                                py-4 px-6 rounded-2xl text-xl font-bold transition-all duration-300 text-left
                                ${showResult && option.isCorrect
                                    ? 'bg-green-500 text-white scale-102 shadow-lg'
                                    : showResult && isSelected && !option.isCorrect
                                        ? 'bg-red-400 text-white scale-98'
                                        : showResult
                                            ? 'bg-gray-100 text-gray-400 scale-98'
                                            : `bg-gradient-to-r ${GAME_COLORS[i % GAME_COLORS.length]} text-white shadow-md hover:shadow-xl hover:scale-102 active:scale-98`
                                }
                            `}
                        >
                            <span className="capitalize">{option.text}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
