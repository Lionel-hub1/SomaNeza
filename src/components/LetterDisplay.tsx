'use client';

import { GeneratedResult } from '@/lib/kinyarwanda';
import LetterCard from './LetterCard';

interface LetterDisplayProps {
    result: GeneratedResult | null;
    onReveal: (index: number) => void;
    onToggleHide: (index: number) => void;
    isTeacherMode: boolean;
    learningMode?: 'read' | 'guess' | 'progressive';
    showImages?: boolean;
}

export default function LetterDisplay({
    result,
    onReveal,
    onToggleHide,
    isTeacherMode,
    learningMode = 'read',
    showImages = false
}: LetterDisplayProps) {
    if (!result) {
        return (
            <div className="flex items-center justify-center min-h-[200px] md:min-h-[300px]">
                <div className="text-2xl md:text-3xl text-gray-400 font-medium animate-pulse">
                    Kanda "Kora" kugirango utangire!
                    <span className="block text-lg mt-2 text-gray-300">
                        (Tap "Generate" to start!)
                    </span>
                </div>
            </div>
        );
    }

    // Calculate size based on letter count
    const letterCount = result.letterStates.length;
    let size: 'normal' | 'compact' | 'tiny' | 'fluid' = 'normal';
    let gapClass = 'gap-3 md:gap-6';

    if (letterCount > 12) {
        size = 'fluid';
        gapClass = 'gap-1';
    } else if (letterCount > 8) {
        size = 'tiny';
        gapClass = 'gap-1 md:gap-2';
    } else if (letterCount > 5) {
        size = 'compact';
        gapClass = 'gap-2 md:gap-4';
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-full px-4 md:px-8">
            {showImages && result.emoji && result.pattern === 'word' && (
                <div className="text-8xl md:text-9xl animate-bounce-in mb-4">
                    {result.emoji}
                </div>
            )}

            <div className={`flex flex-nowrap justify-center ${gapClass} w-full px-4 md:px-8`}>
                {result.letterStates.map((letterState, index) => (
                    <LetterCard
                        key={`${result.display}-${index}`}
                        letterState={letterState}
                        index={index}
                        onReveal={onReveal}
                        onToggleHide={onToggleHide}
                        isTeacherMode={isTeacherMode}
                        size={size}
                    />
                ))}
            </div>

            {result.meaning && result.pattern === 'word' && (
                <div className="text-center animate-in fade-in duration-700 delay-300">
                    {learningMode !== 'guess' && (
                        <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                            {result.display}
                        </p>
                    )}
                    <p className="text-gray-400 text-sm font-medium italic mt-1">{result.meaning}</p>
                </div>
            )}
        </div>
    );
}

function getPatternLabel(pattern: string): string {
    switch (pattern) {
        case 'vowel':
            return '🔤 Vowel (Ijwi)';
        case 'consonant':
            return '🔤 Consonant (Ingombajwi)';
        case 'cv':
            return '📝 Consonant + Vowel';
        case 'cluster':
            return '📚 Cluster + Vowel';
        case 'word':
            return '🖼️ Word (Ijambo)';
        case 'mixed':
            return '🎲 Mixed';
        default:
            return '';
    }
}
