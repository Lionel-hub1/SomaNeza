'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, GameDifficulty, WordPiece, SIMPLE_WORDS } from '@/lib/kinyarwanda';
import {
    initializeGameState,
    selectWordForDifficulty,
    generateWordPieces,
    handleCorrectAnswer,
    handleWrongAnswer,
    speakSyllable,
    getRandomEncouragement,
} from '@/lib/games';

interface WordBuilderGameProps {
    difficulty: GameDifficulty;
    onComplete: (state: GameState) => void;
    onBack: () => void;
}

export default function WordBuilderGame({ difficulty, onComplete, onBack }: WordBuilderGameProps) {
    const [gameState, setGameState] = useState<GameState>(() => initializeGameState(difficulty));
    const [currentWord, setCurrentWord] = useState<typeof SIMPLE_WORDS[0] | null>(null);
    const [pieces, setPieces] = useState<WordPiece[]>([]);
    const [placedPieces, setPlacedPieces] = useState<(WordPiece | null)[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [encouragement, setEncouragement] = useState<{ text: string; emoji: string } | null>(null);
    const [showMeaning, setShowMeaning] = useState(false);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    // Generate new word
    const generateNewWord = useCallback(() => {
        let word = selectWordForDifficulty(difficulty);

        // Try to get a unique word (avoid repetition)
        let attempts = 0;
        while (usedWords.has(word.word) && attempts < 10) {
            word = selectWordForDifficulty(difficulty);
            attempts++;
        }

        setUsedWords(prev => new Set([...prev, word.word]));
        setCurrentWord(word);
        setPieces(generateWordPieces(word));
        setPlacedPieces(new Array(word.syllables.length).fill(null));
        setFeedback(null);
        setEncouragement(null);
        setShowMeaning(false);
    }, [difficulty, usedWords]);

    // Initialize first round
    useEffect(() => {
        const timer = setTimeout(() => generateNewWord(), 0);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle piece selection
    const handlePieceClick = (piece: WordPiece) => {
        if (feedback !== null) return;
        if (piece.isPlaced) return;

        // Find the first empty slot
        const emptySlotIndex = placedPieces.findIndex(p => p === null);
        if (emptySlotIndex === -1) return;

        // Place the piece
        const newPlacedPieces = [...placedPieces];
        newPlacedPieces[emptySlotIndex] = { ...piece, isPlaced: true };
        setPlacedPieces(newPlacedPieces);

        // Update original pieces
        setPieces(prev => prev.map(p =>
            p.id === piece.id ? { ...p, isPlaced: true } : p
        ));

        // Speak the syllable
        speakSyllable(piece.syllable);

        // Check if word is complete
        const allFilled = newPlacedPieces.every(p => p !== null);
        if (allFilled && currentWord) {
            checkWord(newPlacedPieces as WordPiece[]);
        }
    };

    // Handle removing a placed piece
    const handleSlotClick = (slotIndex: number) => {
        if (feedback !== null) return;

        const piece = placedPieces[slotIndex];
        if (!piece) return;

        // Remove from slot
        const newPlacedPieces = [...placedPieces];
        newPlacedPieces[slotIndex] = null;
        setPlacedPieces(newPlacedPieces);

        // Return to available pieces
        setPieces(prev => prev.map(p =>
            p.id === piece.id ? { ...p, isPlaced: false } : p
        ));
    };

    // Check if word is correct
    const checkWord = (placed: WordPiece[]) => {
        if (!currentWord) return;

        const isCorrect = placed.every((piece, index) =>
            piece.syllable === currentWord.syllables[index]
        );

        if (isCorrect) {
            setFeedback('correct');
            setShowMeaning(true);
            setEncouragement(getRandomEncouragement());

            // Speak the complete word
            setTimeout(() => speakSyllable(currentWord.word), 500);

            const newState = handleCorrectAnswer(gameState);
            setGameState(newState);

            if (newState.isComplete) {
                setTimeout(() => onComplete(newState), 3000);
            } else {
                setTimeout(generateNewWord, 3000);
            }
        } else {
            setFeedback('wrong');
            const newState = handleWrongAnswer(gameState);
            setGameState(newState);

            // Reset after a delay
            setTimeout(() => {
                if (newState.isComplete) {
                    onComplete(newState);
                } else {
                    // Reset placement but keep the same word to try again
                    setPieces(prev => prev.map(p => ({ ...p, isPlaced: false })));
                    setPlacedPieces(new Array(currentWord.syllables.length).fill(null));
                    setFeedback(null);
                }
            }, 2000);
        }
    };

    if (!currentWord) return null;

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
                </div>
            </div>

            {/* Word hint with emoji */}
            <div className="text-center space-y-3">
                <div className="text-7xl md:text-8xl animate-bounce-in">
                    {currentWord.emoji}
                </div>
                <p className="text-gray-600 text-lg">Kora ijambo!</p>
                <p className="text-sm text-gray-500">Build the word!</p>

                {showMeaning && (
                    <div className="animate-bounce-in bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl px-6 py-3 inline-block">
                        <p className="text-2xl font-bold text-emerald-700">{currentWord.word}</p>
                        <p className="text-sm text-emerald-600">{currentWord.meaning}</p>
                    </div>
                )}
            </div>

            {/* Word building slots */}
            <div className="flex justify-center gap-2 md:gap-4">
                {placedPieces.map((piece, index) => (
                    <button
                        key={index}
                        onClick={() => handleSlotClick(index)}
                        disabled={feedback !== null}
                        className={`
                            w-16 h-20 md:w-24 md:h-28 rounded-2xl
                            border-4 border-dashed
                            flex items-center justify-center
                            text-3xl md:text-4xl font-bold
                            transition-all duration-300
                            ${piece
                                ? `bg-gradient-to-br ${piece.color} text-white border-transparent shadow-lg`
                                : 'bg-white/50 border-gray-300 hover:border-indigo-300'
                            }
                            ${feedback === 'correct' && piece ? 'animate-bounce scale-110' : ''}
                            ${feedback === 'wrong' && piece ? 'animate-shake bg-red-400' : ''}
                        `}
                    >
                        {piece ? piece.syllable : (
                            <span className="text-gray-400 text-2xl">{index + 1}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Arrow indicator */}
            <div className="text-center text-3xl text-gray-400 animate-bounce">
                ↑
            </div>

            {/* Available pieces */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-inner">
                <p className="text-center text-sm text-gray-500 mb-4">Kanda ibice ukore ijambo! (Tap pieces to build!)</p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {pieces.map((piece) => (
                        <button
                            key={piece.id}
                            onClick={() => handlePieceClick(piece)}
                            disabled={piece.isPlaced || feedback !== null}
                            className={`
                                px-6 py-4 md:px-8 md:py-5 rounded-2xl
                                text-2xl md:text-3xl font-bold
                                transform transition-all duration-300
                                focus:outline-none focus:ring-4
                                ${piece.isPlaced
                                    ? 'opacity-30 scale-90 bg-gray-200 text-gray-400'
                                    : `bg-gradient-to-br ${piece.color} text-white hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl`
                                }
                            `}
                        >
                            {piece.syllable}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback */}
            {feedback && encouragement && feedback === 'correct' && (
                <div className="text-center space-y-2 animate-bounce-in">
                    <div className="text-6xl">{encouragement.emoji}</div>
                    <div className="text-2xl font-bold text-emerald-600">
                        {encouragement.text}
                    </div>
                    <p className="text-gray-600">{currentWord.word} = {currentWord.meaning}</p>
                </div>
            )}

            {feedback === 'wrong' && (
                <div className="text-center space-y-1 animate-bounce-in">
                    <div className="text-4xl">🔄</div>
                    <div className="text-lg font-bold text-gray-600">
                        Ongera ugerageze!
                    </div>
                    <p className="text-sm text-gray-500">Try again!</p>
                </div>
            )}
        </div>
    );
}
