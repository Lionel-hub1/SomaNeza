'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, GameDifficulty, SoundOption } from '@/lib/kinyarwanda';
import {
    initializeGameState,
    generateSoundMatchOptions,
    handleCorrectAnswer,
    handleWrongAnswer,
    speakSyllable,
    getRandomEncouragement,
} from '@/lib/games';

interface SoundMatchGameProps {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

export default function SoundMatchGame({ difficulty, onComplete, onBack }: SoundMatchGameProps) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [target, setTarget] = useState<string>('');
    const [options, setOptions] = useState<SoundOption[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [encouragement, setEncouragement] = useState<{ text: string; emoji: string } | null>(null);
    const [showTarget, setShowTarget] = useState(false);

    // Generate new round
    const generateNewRound = useCallback(() => {
        const { target: newTarget, options: newOptions } = generateSoundMatchOptions(difficulty);
        setTarget(newTarget);
        setOptions(newOptions);
        setFeedback(null);
        setSelectedId(null);
        setEncouragement(null);
        setShowTarget(false);

        // Auto-speak the syllable after a short delay
        setTimeout(() => {
            speakSyllable(newTarget);
        }, 500);
    }, [difficulty]);

    // Initialize first round
    useEffect(() => {
        const timer = setTimeout(() => generateNewRound(), 0);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Replay sound
    const handleReplaySound = () => {
        speakSyllable(target);
    };

    // Handle option selection
    const handleSelect = (option: SoundOption) => {
        if (feedback !== null) return;

        setSelectedId(option.id);
        setShowTarget(true);

        if (option.isCorrect) {
            setFeedback('correct');
            setEncouragement(getRandomEncouragement());
            const newState = handleCorrectAnswer(gameState);
            setGameState(newState);

            if (newState.isComplete) {
                setTimeout(() => onComplete(newState), 2000);
            } else {
                setTimeout(generateNewRound, 2000);
            }
        } else {
            setFeedback('wrong');
            const newState = handleWrongAnswer(gameState);
            setGameState(newState);

            setTimeout(() => {
                if (newState.isComplete) {
                    onComplete(newState);
                } else {
                    generateNewRound();
                }
            }, 2500);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header with score */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors flex items-center gap-2"
                >
                    <span>←</span>
                    <span className="hidden sm:inline">Subira</span>
                </button>

                <div className="flex items-center gap-3">
                    {/* Streak indicator */}
                    {gameState.streak && gameState.streak >= 2 && (
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-3 py-1 shadow-md animate-pulse">
                            <span className="text-white font-bold">🔥 {gameState.streak}</span>
                        </div>
                    )}
                    <div className="bg-white rounded-2xl px-4 py-2 shadow-md">
                        <span className="text-lg font-bold text-emerald-600">{gameState.score}</span>
                        <span className="text-gray-500 text-sm"> / {gameState.totalRounds}</span>
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-2 shadow-md">
                        <span className="text-sm text-gray-500">Round </span>
                        <span className="text-lg font-bold text-indigo-600">{gameState.currentRound}</span>
                    </div>
                </div>
            </div>

            {/* Sound prompt section */}
            <div className="text-center space-y-4">
                <p className="text-gray-600 text-lg">🔊 Umva hanyuma uhitemo!</p>
                <p className="text-sm text-gray-500">Listen and choose!</p>

                {/* Sound button */}
                <button
                    onClick={handleReplaySound}
                    className={`
                        mx-auto flex items-center justify-center
                        w-32 h-32 md:w-40 md:h-40
                        rounded-full shadow-2xl
                        transform transition-all duration-300
                        hover:scale-110 active:scale-95
                        ${showTarget
                            ? feedback === 'correct'
                                ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                                : 'bg-gradient-to-br from-rose-400 to-red-500'
                            : 'bg-gradient-to-br from-violet-500 to-purple-600 animate-pulse'
                        }
                    `}
                >
                    {showTarget ? (
                        <span className="text-5xl md:text-7xl font-bold text-white">
                            {target}
                        </span>
                    ) : (
                        <span className="text-6xl">🔊</span>
                    )}
                </button>

                {!showTarget && (
                    <p className="text-sm text-purple-600 animate-bounce">
                        Kanda kugirango wumve! (Tap to hear!)
                    </p>
                )}
            </div>

            {/* Options grid */}
            <div className={`grid gap-4 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                {options.map((option) => {
                    const isSelected = selectedId === option.id;
                    const showCorrect = feedback !== null && option.isCorrect;
                    const showWrong = isSelected && feedback === 'wrong';

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            disabled={feedback !== null}
                            className={`
                                py-8 md:py-12 rounded-3xl
                                text-4xl md:text-6xl font-bold
                                transform transition-all duration-300
                                focus:outline-none focus:ring-4
                                ${showCorrect
                                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white scale-110 ring-4 ring-green-300 animate-bounce'
                                    : showWrong
                                        ? 'bg-gradient-to-br from-red-400 to-rose-500 text-white scale-95 ring-4 ring-red-300 animate-shake'
                                        : `bg-gradient-to-br ${option.color} text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:ring-purple-200`
                                }
                                ${feedback !== null && !showCorrect && !showWrong ? 'opacity-50' : ''}
                            `}
                        >
                            {option.syllable}
                            {showCorrect && <span className="block text-3xl mt-2">✓</span>}
                            {showWrong && <span className="block text-3xl mt-2">✗</span>}
                        </button>
                    );
                })}
            </div>

            {/* Feedback message */}
            {feedback && encouragement && feedback === 'correct' && (
                <div className="text-center space-y-2 animate-bounce-in">
                    <div className="text-6xl">{encouragement.emoji}</div>
                    <div className="text-2xl font-bold text-emerald-600">
                        {encouragement.text}
                    </div>
                </div>
            )}

            {feedback === 'wrong' && (
                <div className="text-center space-y-2 animate-bounce-in">
                    <div className="text-4xl">💪</div>
                    <div className="text-xl font-bold text-gray-600">
                        Ongera ugerageze!
                    </div>
                    <p className="text-sm text-gray-500">Try again!</p>
                </div>
            )}
        </div>
    );
}
