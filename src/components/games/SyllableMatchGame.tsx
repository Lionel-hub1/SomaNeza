'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    GameDifficulty,
    GameState,
    SIMPLE_WORDS,
    GAME_COLORS,
    ENCOURAGEMENTS,
} from '@/lib/kinyarwanda';
import {
    initializeGameState,
    handleCorrectAnswer,
    handleWrongAnswer,
    getRandomEncouragement,
} from '@/lib/games';

interface Props {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

interface MatchPair {
    id: string;
    word: string;
    emoji: string;
    meaning: string;
    syllables: string[];
    color: string;
}

interface MatchItem {
    id: string;
    text: string;
    type: 'word' | 'meaning';
    pairId: string;
    isMatched: boolean;
    isSelected: boolean;
    color: string;
}

function getPairCount(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy': return 3;
        case 'medium': return 4;
        case 'hard': return 6;
        default: return 3;
    }
}

function generateRound(difficulty: GameDifficulty, usedWords: Set<string>): MatchItem[] {
    const count = getPairCount(difficulty);
    const available = SIMPLE_WORDS.filter(w => !usedWords.has(w.word));
    const pool = available.length >= count ? available : SIMPLE_WORDS;

    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

    const wordItems: MatchItem[] = shuffled.map((w, i) => ({
        id: `word-${i}-${Date.now()}`,
        text: `${w.emoji} ${w.word}`,
        type: 'word',
        pairId: w.word,
        isMatched: false,
        isSelected: false,
        color: GAME_COLORS[i % GAME_COLORS.length],
    }));

    const meaningItems: MatchItem[] = shuffled.map((w, i) => ({
        id: `meaning-${i}-${Date.now()}`,
        text: w.meaning,
        type: 'meaning',
        pairId: w.word,
        isMatched: false,
        isSelected: false,
        color: GAME_COLORS[i % GAME_COLORS.length],
    }));

    return [
        ...wordItems.sort(() => Math.random() - 0.5),
        ...meaningItems.sort(() => Math.random() - 0.5),
    ];
}

export default function SyllableMatchGame({ difficulty, onComplete, onBack }: Props) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [items, setItems] = useState<MatchItem[]>([]);
    const [selected, setSelected] = useState<MatchItem | null>(null);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [matchedCount, setMatchedCount] = useState(0);
    const [usedWords] = useState<Set<string>>(new Set());
    const [shakeId, setShakeId] = useState<string | null>(null);

    const pairCount = getPairCount(difficulty);

    const startRound = useCallback(() => {
        setItems(generateRound(difficulty, usedWords));
        setSelected(null);
        setFeedback(null);
        setMatchedCount(0);
    }, [difficulty, usedWords]);

    useEffect(() => {
        startRound();
    }, [startRound]);

    // Check if all pairs matched in this round
    useEffect(() => {
        if (matchedCount > 0 && matchedCount >= pairCount) {
            const newState = handleCorrectAnswer(gameState);
            const enc = getRandomEncouragement();
            setFeedback({ correct: true, message: `${enc.emoji} ${enc.text}` });

            const timer = setTimeout(() => {
                if (newState.isComplete) {
                    onComplete(newState);
                } else {
                    setGameState(newState);
                    startRound();
                }
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [matchedCount, pairCount, gameState, onComplete, startRound]);

    const handleSelect = (item: MatchItem) => {
        if (item.isMatched) return;

        if (!selected) {
            setSelected(item);
            setItems(prev => prev.map(i =>
                i.id === item.id ? { ...i, isSelected: true } : { ...i, isSelected: false }
            ));
            return;
        }

        // If same item clicked, deselect
        if (selected.id === item.id) {
            setSelected(null);
            setItems(prev => prev.map(i => ({ ...i, isSelected: false })));
            return;
        }

        // Must be different types
        if (selected.type === item.type) {
            setSelected(item);
            setItems(prev => prev.map(i =>
                i.id === item.id ? { ...i, isSelected: true } : { ...i, isSelected: false }
            ));
            return;
        }

        // Check match
        if (selected.pairId === item.pairId) {
            // Correct match!
            setItems(prev => prev.map(i =>
                i.pairId === item.pairId ? { ...i, isMatched: true, isSelected: false } : { ...i, isSelected: false }
            ));
            setMatchedCount(prev => prev + 1);
            setSelected(null);
        } else {
            // Wrong match
            setShakeId(item.id);
            setTimeout(() => setShakeId(null), 500);
            setSelected(null);
            setItems(prev => prev.map(i => ({ ...i, isSelected: false })));
        }
    };

    const wordItems = items.filter(i => i.type === 'word');
    const meaningItems = items.filter(i => i.type === 'meaning');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors">
                    ← Subira
                </button>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">🔗 Huza Amagambo</h3>
                    <p className="text-xs text-gray-500">Match Words to Meanings</p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">{gameState.score} ⭐</div>
                    <div className="text-xs text-gray-500">Round {gameState.currentRound}/{gameState.totalRounds}</div>
                </div>
            </div>

            {/* Instructions */}
            <div className="text-center bg-blue-50 rounded-2xl p-3">
                <p className="text-sm text-blue-700 font-medium">Huza ijambo n&apos;icyo risobanura! (Match word with its meaning!)</p>
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`text-center py-2 rounded-xl text-lg font-bold ${feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                </div>
            )}

            {/* Game Board */}
            <div className="grid grid-cols-2 gap-4">
                {/* Words Column */}
                <div className="space-y-3">
                    <h4 className="text-center text-sm font-bold text-gray-600 uppercase">Amagambo</h4>
                    {wordItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            disabled={item.isMatched}
                            className={`
                                w-full py-3 px-4 rounded-2xl font-bold text-lg transition-all duration-300
                                ${item.isMatched
                                    ? 'bg-green-100 text-green-600 scale-95 opacity-60'
                                    : item.isSelected
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white scale-105 shadow-lg'
                                        : 'bg-white hover:bg-gray-50 text-gray-800 shadow-md hover:shadow-lg hover:scale-102'
                                }
                                ${shakeId === item.id ? 'animate-shake' : ''}
                            `}
                        >
                            {item.isMatched ? '✅ ' : ''}{item.text}
                        </button>
                    ))}
                </div>

                {/* Meanings Column */}
                <div className="space-y-3">
                    <h4 className="text-center text-sm font-bold text-gray-600 uppercase">Meanings</h4>
                    {meaningItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            disabled={item.isMatched}
                            className={`
                                w-full py-3 px-4 rounded-2xl font-bold text-lg transition-all duration-300 capitalize
                                ${item.isMatched
                                    ? 'bg-green-100 text-green-600 scale-95 opacity-60'
                                    : item.isSelected
                                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white scale-105 shadow-lg'
                                        : 'bg-white hover:bg-gray-50 text-gray-800 shadow-md hover:shadow-lg hover:scale-102'
                                }
                                ${shakeId === item.id ? 'animate-shake' : ''}
                            `}
                        >
                            {item.isMatched ? '✅ ' : ''}{item.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
