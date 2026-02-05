'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, GameDifficulty, MatchOption } from '@/lib/kinyarwanda';
import {
    initializeGameState,
    generateMatchingOptions,
    handleCorrectAnswer,
    handleWrongAnswer,
} from '@/lib/games';

interface MatchingGameProps {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

export default function MatchingGame({ difficulty, onComplete, onBack }: MatchingGameProps) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [target, setTarget] = useState<string>('');
    const [options, setOptions] = useState<MatchOption[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Generate new round
    const generateNewRound = useCallback(() => {
        const { target: newTarget, options: newOptions } = generateMatchingOptions(difficulty);
        setTarget(newTarget);
        setOptions(newOptions);
        setFeedback(null);
        setSelectedId(null);
    }, [difficulty]);

    // Initialize first round
    useEffect(() => {
        generateNewRound();
    }, [generateNewRound]);

    // Handle option selection
    const handleSelect = (option: MatchOption) => {
        if (feedback !== null) return; // Prevent double selection

        setSelectedId(option.id);

        if (option.isCorrect) {
            setFeedback('correct');
            const newState = handleCorrectAnswer(gameState);
            setGameState(newState);

            if (newState.isComplete) {
                setTimeout(() => onComplete(newState), 1500);
            } else {
                setTimeout(generateNewRound, 1500);
            }
        } else {
            setFeedback('wrong');
            const newState = handleWrongAnswer(gameState);
            setGameState(newState);

            // Show correct answer briefly, then move on
            setTimeout(() => {
                if (newState.isComplete) {
                    onComplete(newState);
                } else {
                    generateNewRound();
                }
            }, 2000);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header with score */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                >
                    ← Subira
                </button>

                <div className="flex items-center gap-4">
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

            {/* Target syllable display */}
            <div className="text-center space-y-2">
                <p className="text-gray-600 text-lg">Hitamo:</p>
                <div
                    className={`
            inline-block px-12 py-8 rounded-3xl shadow-xl
            bg-gradient-to-br from-indigo-500 to-purple-600
            transform transition-all duration-300
            ${feedback === 'correct' ? 'scale-110 from-emerald-500 to-green-600' : ''}
            ${feedback === 'wrong' ? 'from-red-500 to-rose-600' : ''}
          `}
                >
                    <span className="text-6xl md:text-8xl font-bold text-white">
                        {target}
                    </span>
                </div>
            </div>

            {/* Options grid */}
            <div className={`grid gap-4 ${options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
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
                py-8 md:py-10 rounded-3xl
                text-4xl md:text-5xl font-bold
                transform transition-all duration-300
                focus:outline-none focus:ring-4
                ${showCorrect
                                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white scale-110 ring-4 ring-green-300'
                                    : showWrong
                                        ? 'bg-gradient-to-br from-red-400 to-rose-500 text-white scale-95 ring-4 ring-red-300'
                                        : 'bg-white hover:bg-gray-50 text-gray-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:ring-indigo-200'
                                }
                ${feedback !== null && !showCorrect && !showWrong ? 'opacity-50' : ''}
              `}
                        >
                            {option.syllable}
                            {showCorrect && <span className="block text-2xl mt-2">✓</span>}
                            {showWrong && <span className="block text-2xl mt-2">✗</span>}
                        </button>
                    );
                })}
            </div>

            {/* Feedback message */}
            {feedback && (
                <div className={`
          text-center text-2xl font-bold animate-bounce-in
          ${feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}
        `}>
                    {feedback === 'correct' ? '🎉 Byiza cyane!' : '😊 Ongera ugerageze!'}
                </div>
            )}
        </div>
    );
}
