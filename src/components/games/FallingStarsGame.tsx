'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameDifficulty, FallingStar } from '@/lib/kinyarwanda';
import {
    initializeGameState,
    generateFallingStars,
    handleCorrectAnswer,
    handleWrongAnswer,
    speakSyllable,
    getRandomEncouragement,
} from '@/lib/games';

// Generate background stars once outside component
const generateBackgroundStars = () =>
    Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.5 + 0.3,
    }));

interface FallingStarsGameProps {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

export default function FallingStarsGame({ difficulty, onComplete, onBack }: FallingStarsGameProps) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [target, setTarget] = useState<string>('');
    const [stars, setStars] = useState<FallingStar[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [encouragement, setEncouragement] = useState<{ text: string; emoji: string } | null>(null);
    const animationRef = useRef<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Pre-generate background stars only once
    const [backgroundStars] = useState(generateBackgroundStars);

    // Generate new round
    const generateNewRound = useCallback(() => {
        const { target: newTarget, stars: newStars } = generateFallingStars(difficulty);
        setTarget(newTarget);
        setStars(newStars);
        setFeedback(null);
        setEncouragement(null);
        setIsPaused(false);

        // Speak the target
        setTimeout(() => speakSyllable(newTarget), 300);
    }, [difficulty]);

    // Initialize first round
    useEffect(() => {
        const timer = setTimeout(() => generateNewRound(), 0);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Animate stars falling
    useEffect(() => {
        if (isPaused) return;

        const animate = () => {
            setStars(prev => prev.map(star => {
                if (star.isCaught) return star;

                const newY = star.y + star.speed;
                let newX = star.x;
                const newRotation = star.rotation + 1;

                // Add gentle side-to-side motion
                newX += Math.sin(newY / 30) * 0.3;

                // Reset star to top if it falls off screen
                if (newY > 110) {
                    return {
                        ...star,
                        y: -15,
                        x: Math.random() * 80 + 10,
                        rotation: 0,
                    };
                }

                return {
                    ...star,
                    y: newY,
                    x: Math.max(5, Math.min(95, newX)),
                    rotation: newRotation,
                };
            }));
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused]);

    // Handle star catch
    const handleCatch = (star: FallingStar) => {
        if (feedback !== null || star.isCaught) return;

        setIsPaused(true);

        // Mark star as caught with animation
        setStars(prev => prev.map(s =>
            s.id === star.id ? { ...s, isCaught: true } : s
        ));

        if (star.isCorrect) {
            setFeedback('correct');
            setEncouragement(getRandomEncouragement());
            speakSyllable(star.syllable);

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
            }, 2000);
        }
    };

    // Replay sound
    const handleReplaySound = () => {
        speakSyllable(target);
    };

    return (
        <div className="space-y-4">
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
                </div>
            </div>

            {/* Target display */}
            <div className="text-center space-y-2">
                <p className="text-gray-600 text-lg">⭐ Fata inyenyeri!</p>
                <p className="text-sm text-gray-500">Catch the star!</p>
                <button
                    onClick={handleReplaySound}
                    className={`
                        inline-block px-8 py-4 rounded-2xl shadow-xl
                        bg-gradient-to-br from-indigo-500 to-purple-600
                        transform transition-all duration-300 hover:scale-105 active:scale-95
                        ${feedback === 'correct' ? 'from-emerald-500 to-green-600 scale-110' : ''}
                        ${feedback === 'wrong' ? 'from-red-500 to-rose-600' : ''}
                    `}
                >
                    <span className="text-4xl md:text-5xl font-bold text-white">
                        {target}
                    </span>
                    <span className="block text-xl mt-1">🔊</span>
                </button>
            </div>

            {/* Star field container */}
            <div
                className="relative h-[350px] md:h-[450px] bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl overflow-hidden shadow-inner"
            >
                {/* Background stars decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    {backgroundStars.map((bgStar) => (
                        <div
                            key={bgStar.id}
                            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                            style={{
                                left: `${bgStar.left}%`,
                                top: `${bgStar.top}%`,
                                animationDelay: `${bgStar.delay}s`,
                                opacity: bgStar.opacity,
                            }}
                        />
                    ))}
                </div>

                {/* Moon decoration */}
                <div className="absolute top-4 right-4 text-4xl opacity-70">🌙</div>

                {/* Falling stars */}
                {stars.map((star) => (
                    <button
                        key={star.id}
                        onClick={() => handleCatch(star)}
                        disabled={feedback !== null || star.isCaught}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            transform: `translate(-50%, -50%) rotate(${star.rotation}deg)`,
                        }}
                        className={`
                            absolute
                            w-16 h-16 md:w-20 md:h-20
                            flex items-center justify-center
                            text-2xl md:text-3xl font-bold
                            transition-all duration-200
                            focus:outline-none
                            ${star.isCaught
                                ? star.isCorrect
                                    ? 'scale-150 opacity-0'
                                    : 'scale-50 opacity-0'
                                : 'hover:scale-125 active:scale-110'
                            }
                        `}
                    >
                        {!star.isCaught && (
                            <div className={`
                                relative w-full h-full
                                bg-gradient-to-br ${star.color}
                                rounded-full shadow-lg
                                flex items-center justify-center
                                animate-pulse
                            `}>
                                {/* Star glow effect */}
                                <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />

                                {/* Star points decoration */}
                                <div className="absolute -inset-2 flex items-center justify-center text-3xl md:text-4xl opacity-50">
                                    ✦
                                </div>

                                <span className="relative text-white font-bold text-xl md:text-2xl">
                                    {star.syllable}
                                </span>
                            </div>
                        )}
                        {star.isCaught && star.isCorrect && (
                            <span className="text-5xl animate-ping">⭐</span>
                        )}
                        {star.isCaught && !star.isCorrect && (
                            <span className="text-3xl">💫</span>
                        )}
                    </button>
                ))}

                {/* Catch zone indicator at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-white/20 to-transparent" />

                {/* Confetti on correct */}
                {feedback === 'correct' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-8xl animate-bounce-in">⭐</div>
                    </div>
                )}
            </div>

            {/* Feedback message */}
            {feedback && encouragement && feedback === 'correct' && (
                <div className="text-center space-y-2 animate-bounce-in">
                    <div className="text-5xl">{encouragement.emoji}</div>
                    <div className="text-2xl font-bold text-emerald-600">
                        {encouragement.text}
                    </div>
                </div>
            )}

            {feedback === 'wrong' && (
                <div className="text-center space-y-1 animate-bounce-in">
                    <div className="text-4xl">💫</div>
                    <div className="text-lg font-bold text-gray-600">
                        Iyindi nyenyeri! Ongera ugerageze!
                    </div>
                    <p className="text-sm text-gray-500">Try another star!</p>
                </div>
            )}
        </div>
    );
}
