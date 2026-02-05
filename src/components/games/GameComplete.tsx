'use client';

import { GameState } from '@/lib/kinyarwanda';

interface GameCompleteProps {
    state: GameState;
    onPlayAgain: () => void;
    onBackToMenu: () => void;
}

export default function GameComplete({ state, onPlayAgain, onBackToMenu }: GameCompleteProps) {
    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 3; i++) {
            stars.push(
                <span
                    key={i}
                    className={`
            text-5xl md:text-6xl
            transform transition-all duration-500
            ${i < state.stars
                            ? 'text-yellow-400 scale-100 animate-bounce-in'
                            : 'text-gray-300 scale-75'
                        }
          `}
                    style={{ animationDelay: `${i * 200}ms` }}
                >
                    ⭐
                </span>
            );
        }
        return stars;
    };

    const getMessage = () => {
        if (state.stars === 3) return { text: 'Byiza cyane!', subtitle: 'Perfect!' };
        if (state.stars === 2) return { text: 'Wabikoze neza!', subtitle: 'Great job!' };
        if (state.stars === 1) return { text: 'Neza!', subtitle: 'Good!' };
        return { text: 'Komeza wige!', subtitle: 'Keep practicing!' };
    };

    const message = getMessage();

    return (
        <div className="text-center space-y-8 py-8">
            {/* Celebration emoji */}
            <div className="text-8xl animate-bounce-in">
                {state.stars >= 2 ? '🎉' : '💪'}
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2">
                {renderStars()}
            </div>

            {/* Message */}
            <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {message.text}
                </h2>
                <p className="text-xl text-gray-600">{message.subtitle}</p>
            </div>

            {/* Score */}
            <div className="bg-white rounded-3xl p-6 shadow-xl inline-block">
                <div className="text-6xl font-bold text-indigo-600">{state.score}</div>
                <div className="text-gray-500">kuri {state.totalRounds}</div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                    onClick={onPlayAgain}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
                >
                    🔄 Ongera Ukine
                </button>
                <button
                    onClick={onBackToMenu}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
                >
                    🎮 Imikino
                </button>
            </div>
        </div>
    );
}
