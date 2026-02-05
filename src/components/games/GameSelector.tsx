'use client';

import { GameType } from '@/lib/kinyarwanda';

interface GameSelectorProps {
    onSelectGame: (game: GameType) => void;
    onBack?: () => void;
}

const games = [
    {
        type: 'matching' as GameType,
        title: 'Hitamo',
        subtitle: 'Matching',
        emoji: '🎯',
        description: 'Hitamo igisubizo kiboneye',
        gradient: 'from-pink-500 to-rose-500',
    },
    {
        type: 'bubble' as GameType,
        title: 'Menagura',
        subtitle: 'Bubble Pop',
        emoji: '🫧',
        description: 'Menagura amabonero aboneye',
        gradient: 'from-cyan-500 to-blue-500',
    },
    {
        type: 'bubble' as GameType,
        title: 'Kwibuka',
        subtitle: 'Memory',
        emoji: '🧠',
        description: 'Shakisha ibipimo bibiri bihuriye',
        gradient: 'from-purple-500 to-indigo-500',
    },
];

export default function GameSelector({ onSelectGame, onBack }: GameSelectorProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                    🎮 Imikino
                </h2>
                <p className="text-gray-600">Hitamo umukino ushaka gukina!</p>
                <p className="text-sm text-gray-500">Choose a game to play!</p>
            </div>

            {/* Game Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {games.map((game, index) => (
                    <button
                        key={game.type + index}
                        onClick={() => onSelectGame(game.type)}
                        className={`
              group relative overflow-hidden
              bg-gradient-to-br ${game.gradient}
              rounded-3xl p-6 md:p-8
              text-white text-left
              transform transition-all duration-300
              hover:scale-105 hover:shadow-2xl
              active:scale-95
              focus:outline-none focus:ring-4 focus:ring-white/50
            `}
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                        {/* Content */}
                        <div className="relative space-y-3">
                            <span className="text-5xl md:text-6xl block transform group-hover:scale-110 transition-transform">
                                {game.emoji}
                            </span>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold">{game.title}</h3>
                                <p className="text-white/80 text-sm">{game.subtitle}</p>
                            </div>
                            <p className="text-white/70 text-sm md:text-base">
                                {game.description}
                            </p>
                        </div>

                        {/* Play indicator */}
                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <span className="text-2xl">▶</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Back Button */}
            {onBack && (
                <div className="text-center pt-4">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors"
                    >
                        ← Subira Inyuma
                    </button>
                </div>
            )}
        </div>
    );
}
