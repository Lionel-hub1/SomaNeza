'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, GameDifficulty, MemoryCard } from '@/lib/kinyarwanda';
import {
    initializeGameState,
    generateMemoryCards,
    checkMemoryMatch,
    getCardPairCount,
} from '@/lib/games';

interface MemoryGameProps {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

export default function MemoryGame({ difficulty, onComplete, onBack }: MemoryGameProps) {
    const [gameState, setGameState] = useState<GameState>(() => ({
        ...initializeGameState(difficulty),
        totalRounds: getCardPairCount(difficulty), // Total matches needed
    }));
    const [cards, setCards] = useState<MemoryCard[]>([]);
    const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
    const [matchedCount, setMatchedCount] = useState(0);
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    // Initialize game
    useEffect(() => {
        const newCards = generateMemoryCards(difficulty);
        setCards(newCards);
    }, [difficulty]);

    // Check for game completion
    useEffect(() => {
        const pairCount = getCardPairCount(difficulty);
        if (matchedCount === pairCount && matchedCount > 0) {
            // Calculate score based on moves (fewer moves = higher score)
            const perfectMoves = pairCount;
            const maxMoves = pairCount * 3;
            const moveScore = Math.max(0, 1 - (moves - perfectMoves) / (maxMoves - perfectMoves));
            const stars = moveScore >= 0.8 ? 3 : moveScore >= 0.5 ? 2 : moveScore >= 0.2 ? 1 : 0;

            const finalState: GameState = {
                ...gameState,
                score: matchedCount,
                stars,
                isComplete: true,
            };

            setTimeout(() => onComplete(finalState), 1000);
        }
    }, [matchedCount, difficulty, moves, gameState, onComplete]);

    // Handle card flip
    const handleFlip = useCallback((card: MemoryCard) => {
        if (isChecking) return;
        if (card.isFlipped || card.isMatched) return;
        if (flippedCards.length >= 2) return;

        // Flip the card
        setCards(prev => prev.map(c =>
            c.id === card.id ? { ...c, isFlipped: true } : c
        ));

        const newFlipped = [...flippedCards, { ...card, isFlipped: true }];
        setFlippedCards(newFlipped);

        // Check for match when two cards are flipped
        if (newFlipped.length === 2) {
            setIsChecking(true);
            setMoves(prev => prev + 1);

            const [first, second] = newFlipped;
            const isMatch = checkMemoryMatch(first, second);

            setTimeout(() => {
                if (isMatch) {
                    // Mark as matched
                    setCards(prev => prev.map(c =>
                        c.pairId === first.pairId ? { ...c, isMatched: true } : c
                    ));
                    setMatchedCount(prev => prev + 1);
                } else {
                    // Flip back
                    setCards(prev => prev.map(c =>
                        c.id === first.id || c.id === second.id
                            ? { ...c, isFlipped: false }
                            : c
                    ));
                }
                setFlippedCards([]);
                setIsChecking(false);
            }, 1000);
        }
    }, [flippedCards, isChecking]);

    // Determine grid columns based on card count
    const cardCount = cards.length;
    const gridCols = cardCount <= 6 ? 3 : cardCount <= 8 ? 4 : 4;

    return (
        <div className="space-y-6">
            {/* Header with stats */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                >
                    ← Subira
                </button>

                <div className="flex items-center gap-4">
                    <div className="bg-white rounded-2xl px-4 py-2 shadow-md">
                        <span className="text-sm text-gray-500">Matches </span>
                        <span className="text-lg font-bold text-emerald-600">{matchedCount}</span>
                        <span className="text-gray-500 text-sm"> / {getCardPairCount(difficulty)}</span>
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-2 shadow-md">
                        <span className="text-sm text-gray-500">Moves </span>
                        <span className="text-lg font-bold text-indigo-600">{moves}</span>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="text-center">
                <p className="text-gray-600 text-lg">Shakisha ibipimo bibiri bihuriye!</p>
                <p className="text-gray-500 text-sm">Find the matching pairs!</p>
            </div>

            {/* Card grid */}
            <div
                className={`grid gap-3 md:gap-4`}
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
            >
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => handleFlip(card)}
                        disabled={card.isFlipped || card.isMatched || isChecking}
                        className={`
              aspect-square rounded-2xl
              text-3xl md:text-4xl font-bold
              transform transition-all duration-300
              focus:outline-none focus:ring-4
              ${card.isMatched
                                ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white scale-95 opacity-80'
                                : card.isFlipped
                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white rotate-y-0'
                                    : 'bg-gradient-to-br from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-transparent hover:scale-105 active:scale-95 shadow-lg'
                            }
              focus:ring-purple-200
            `}
                        style={{
                            perspective: '1000px',
                        }}
                    >
                        <span className={`
              block transition-all duration-300
              ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}
            `}>
                            {card.syllable}
                        </span>
                        {!card.isFlipped && !card.isMatched && (
                            <span className="text-white/50 text-4xl">?</span>
                        )}
                        {card.isMatched && (
                            <span className="block text-xl mt-1">✓</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Completion celebration */}
            {matchedCount === getCardPairCount(difficulty) && matchedCount > 0 && (
                <div className="text-center space-y-2 animate-bounce-in">
                    <div className="text-6xl">🎉</div>
                    <p className="text-2xl font-bold text-emerald-600">Byiza cyane!</p>
                    <p className="text-gray-600">Wabikoze mu {moves} moves!</p>
                </div>
            )}
        </div>
    );
}
