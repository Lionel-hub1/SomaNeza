'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameDifficulty, Bubble } from '@/lib/kinyarwanda';
import {
    initializeGameState,
    generateBubbles,
    handleCorrectAnswer,
    handleWrongAnswer,
} from '@/lib/games';

interface BubblePopGameProps {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

export default function BubblePopGame({ difficulty, onComplete, onBack }: BubblePopGameProps) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [target, setTarget] = useState<string>('');
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [poppedId, setPoppedId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    // Generate new round
    const generateNewRound = useCallback(() => {
        const { target: newTarget, bubbles: newBubbles } = generateBubbles(difficulty);
        setTarget(newTarget);
        setBubbles(newBubbles);
        setFeedback(null);
        setPoppedId(null);
    }, [difficulty]);

    // Initialize first round
    useEffect(() => {
        generateNewRound();
    }, [generateNewRound]);

    // Animate bubbles floating up
    useEffect(() => {
        const animate = () => {
            setBubbles(prev => prev.map(bubble => {
                if (bubble.isPopped) return bubble;
                const newY = bubble.y - bubble.speed;
                // Reset bubble to bottom if it goes off screen
                if (newY < -20) {
                    return {
                        ...bubble,
                        y: 120,
                        x: Math.random() * 80 + 10,
                    };
                }
                return { ...bubble, y: newY };
            }));
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Handle bubble pop
    const handlePop = (bubble: Bubble) => {
        if (feedback !== null || bubble.isPopped) return;

        setPoppedId(bubble.id);

        // Mark bubble as popped
        setBubbles(prev => prev.map(b =>
            b.id === bubble.id ? { ...b, isPopped: true } : b
        ));

        if (bubble.isCorrect) {
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
        <div className="space-y-4">
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

            {/* Target display */}
            <div className="text-center space-y-2">
                <p className="text-gray-600 text-lg">Menagura:</p>
                <div
                    className={`
            inline-block px-8 py-4 rounded-2xl shadow-xl
            bg-gradient-to-br from-cyan-500 to-blue-600
            transform transition-all duration-300
            ${feedback === 'correct' ? 'scale-110 from-emerald-500 to-green-600' : ''}
            ${feedback === 'wrong' ? 'from-red-500 to-rose-600' : ''}
          `}
                >
                    <span className="text-4xl md:text-6xl font-bold text-white">
                        {target}
                    </span>
                </div>
            </div>

            {/* Bubble container */}
            <div
                ref={containerRef}
                className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-sky-100 to-sky-200 rounded-3xl overflow-hidden shadow-inner"
            >
                {/* Water waves decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-sky-300 to-transparent" />

                {bubbles.map((bubble) => (
                    <button
                        key={bubble.id}
                        onClick={() => handlePop(bubble)}
                        disabled={feedback !== null || bubble.isPopped}
                        style={{
                            left: `${bubble.x}%`,
                            top: `${bubble.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        className={`
              absolute
              w-20 h-20 md:w-24 md:h-24
              rounded-full
              flex items-center justify-center
              text-2xl md:text-3xl font-bold
              transition-all duration-200
              focus:outline-none
              ${bubble.isPopped
                                ? bubble.isCorrect
                                    ? 'scale-150 opacity-0 bg-emerald-400'
                                    : 'scale-50 opacity-0 bg-rose-400'
                                : `
                  bg-gradient-to-br from-white/80 to-cyan-200/80
                  shadow-[inset_-2px_-2px_8px_rgba(0,0,0,0.1),inset_2px_2px_8px_rgba(255,255,255,0.8)]
                  hover:scale-110 active:scale-90
                  text-cyan-800
                  animate-float
                `
                            }
            `}
                    >
                        {!bubble.isPopped && bubble.syllable}
                        {bubble.isPopped && bubble.isCorrect && '💥'}
                    </button>
                ))}

                {/* Confetti on correct */}
                {feedback === 'correct' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-8xl animate-bounce-in">🎉</div>
                    </div>
                )}
            </div>

            {/* Feedback message */}
            {feedback && (
                <div className={`
          text-center text-2xl font-bold animate-bounce-in
          ${feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}
        `}>
                    {feedback === 'correct' ? '🫧 Byiza cyane!' : '😊 Ongera ugerageze!'}
                </div>
            )}
        </div>
    );
}
