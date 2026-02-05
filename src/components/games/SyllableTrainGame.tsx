'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, GameDifficulty, SoundOption, TrainCar } from '@/lib/kinyarwanda';
import {
    initializeGameState,
    generateTrainRound,
    handleCorrectAnswer,
    handleWrongAnswer,
    createTrainCar,
    createEngine,
    speakSyllable,
    getRandomEncouragement,
} from '@/lib/games';

interface SyllableTrainGameProps {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

export default function SyllableTrainGame({ difficulty, onComplete, onBack }: SyllableTrainGameProps) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [target, setTarget] = useState<string>('');
    const [options, setOptions] = useState<SoundOption[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [train, setTrain] = useState<TrainCar[]>([createEngine()]);
    const [encouragement, setEncouragement] = useState<{ text: string; emoji: string } | null>(null);
    const [isTrainMoving, setIsTrainMoving] = useState(false);

    // Generate new round
    const generateNewRound = useCallback(() => {
        const { target: newTarget, options: newOptions } = generateTrainRound(difficulty, train);
        setTarget(newTarget);
        setOptions(newOptions);
        setFeedback(null);
        setSelectedId(null);
        setEncouragement(null);
        setIsTrainMoving(false);
    }, [difficulty, train]);

    // Initialize first round
    useEffect(() => {
        const timer = setTimeout(() => generateNewRound(), 0);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Speak target
    const handleSpeak = () => {
        speakSyllable(target);
    };

    // Handle option selection
    const handleSelect = (option: SoundOption) => {
        if (feedback !== null) return;

        setSelectedId(option.id);

        if (option.isCorrect) {
            setFeedback('correct');
            setEncouragement(getRandomEncouragement());
            setIsTrainMoving(true);

            // Add a new car to the train
            const newCar = createTrainCar(option.syllable, train.length);
            setTrain(prev => [...prev, newCar]);

            const newState = handleCorrectAnswer(gameState);
            setGameState(newState);

            // Play train sound effect (choo-choo!)
            speakSyllable(option.syllable);

            if (newState.isComplete) {
                setTimeout(() => onComplete(newState), 2500);
            } else {
                setTimeout(() => {
                    generateNewRound();
                }, 2000);
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
            }, 2000);
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
                    <div className="bg-white rounded-2xl px-4 py-2 shadow-md">
                        <span className="text-lg font-bold text-emerald-600">{gameState.score}</span>
                        <span className="text-gray-500 text-sm"> / {gameState.totalRounds}</span>
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-2 shadow-md">
                        <span className="text-sm text-gray-500">🚃 </span>
                        <span className="text-lg font-bold text-indigo-600">{train.length - 1}</span>
                    </div>
                </div>
            </div>

            {/* Train display */}
            <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-3xl p-4 overflow-hidden shadow-inner">
                {/* Sky decorations */}
                <div className="flex justify-end gap-2 mb-4">
                    <span className="text-3xl">☀️</span>
                    <span className="text-2xl opacity-60">☁️</span>
                </div>

                {/* Train track */}
                <div className="relative">
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-700 to-amber-800 rounded-full" />
                    <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="w-3 h-2 bg-amber-900 rounded-sm" />
                        ))}
                    </div>

                    {/* Train */}
                    <div
                        className={`
                            flex items-end gap-1 pb-5 overflow-x-auto
                            transition-transform duration-1000 ease-in-out
                            ${isTrainMoving ? 'animate-train-move' : ''}
                        `}
                    >
                        {train.map((car, index) => (
                            <div
                                key={car.id}
                                className={`
                                    flex-shrink-0 relative
                                    ${car.isEngine ? 'w-20 h-16' : 'w-16 h-14'}
                                    rounded-t-xl
                                    bg-gradient-to-br ${car.color}
                                    shadow-lg
                                    ${index === train.length - 1 && !car.isEngine ? 'animate-bounce-in' : ''}
                                `}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Car content */}
                                <div className="absolute inset-1 flex items-center justify-center">
                                    <span className={`
                                        ${car.isEngine ? 'text-3xl' : 'text-xl font-bold text-white'}
                                    `}>
                                        {car.syllable}
                                    </span>
                                </div>

                                {/* Wheels */}
                                <div className="absolute -bottom-2 left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-400" />
                                <div className="absolute -bottom-2 right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-400" />

                                {/* Connector */}
                                {!car.isEngine && (
                                    <div className="absolute -left-2 top-1/2 w-3 h-2 bg-gray-600 rounded" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grass */}
                <div className="h-6 bg-gradient-to-t from-green-500 to-green-400 rounded-b-xl -mx-4 -mb-4 flex items-end justify-around px-4">
                    <span className="text-lg">🌸</span>
                    <span className="text-sm">🌿</span>
                    <span className="text-lg">🌻</span>
                    <span className="text-sm">🌿</span>
                    <span className="text-lg">🌷</span>
                </div>
            </div>

            {/* Target syllable */}
            <div className="text-center space-y-2">
                <p className="text-gray-600 text-lg">Shaka igariyamoshi!</p>
                <p className="text-sm text-gray-500">Find the syllable to add a train car!</p>
                <button
                    onClick={handleSpeak}
                    className={`
                        inline-block px-8 py-6 rounded-3xl shadow-xl
                        bg-gradient-to-br from-indigo-500 to-purple-600
                        transform transition-all duration-300 hover:scale-105 active:scale-95
                        ${feedback === 'correct' ? 'from-emerald-500 to-green-600 scale-110' : ''}
                        ${feedback === 'wrong' ? 'from-red-500 to-rose-600' : ''}
                    `}
                >
                    <span className="text-5xl md:text-6xl font-bold text-white">
                        {target}
                    </span>
                    <span className="block text-2xl mt-1">🔊</span>
                </button>
            </div>

            {/* Options */}
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
                                py-6 md:py-8 rounded-3xl
                                text-3xl md:text-5xl font-bold
                                transform transition-all duration-300
                                focus:outline-none focus:ring-4
                                ${showCorrect
                                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white scale-110 ring-4 ring-green-300'
                                    : showWrong
                                        ? 'bg-gradient-to-br from-red-400 to-rose-500 text-white scale-95 ring-4 ring-red-300'
                                        : `bg-gradient-to-br ${option.color} text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`
                                }
                                ${feedback !== null && !showCorrect && !showWrong ? 'opacity-50' : ''}
                            `}
                        >
                            {option.syllable}
                            {showCorrect && <span className="block text-2xl mt-1">🚃 +1</span>}
                        </button>
                    );
                })}
            </div>

            {/* Feedback */}
            {feedback && encouragement && feedback === 'correct' && (
                <div className="text-center space-y-1 animate-bounce-in">
                    <div className="text-5xl">{encouragement.emoji}</div>
                    <div className="text-xl font-bold text-emerald-600">
                        {encouragement.text}
                    </div>
                    <p className="text-sm text-gray-500">+1 train car!</p>
                </div>
            )}

            {feedback === 'wrong' && (
                <div className="text-center space-y-1 animate-bounce-in">
                    <div className="text-3xl">🚂💨</div>
                    <div className="text-lg font-bold text-gray-600">
                        Ongera ugerageze!
                    </div>
                </div>
            )}
        </div>
    );
}
