'use client';

import { GameType } from '@/lib/kinyarwanda';

interface GameSelectorProps {
    onSelectGame: (game: GameType) => void;
    onBack?: () => void;
}

const games = [
    {
        type: 'syllablematch' as GameType,
        title: 'Huza Amagambo',
        subtitle: 'Match Words',
        emoji: '🔗',
        description: 'Huza ijambo n\'icyo risobanura!',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        type: 'missingletter' as GameType,
        title: 'Uzuza Igice',
        subtitle: 'Missing Part',
        emoji: '🧩',
        description: 'Shaka igice cy\'ijambo kibura!',
        gradient: 'from-emerald-500 to-green-600',
    },
    {
        type: 'wordscramble' as GameType,
        title: 'Shyira mu Murongo',
        subtitle: 'Unscramble',
        emoji: '🔀',
        description: 'Shyira ibice mu murongo ukwiye!',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        type: 'flashcard' as GameType,
        title: 'Soma Vuba',
        subtitle: 'Speed Reading',
        emoji: '⚡',
        description: 'Soma ijambo uhitemo igisubizo!',
        gradient: 'from-indigo-500 to-blue-600',
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
