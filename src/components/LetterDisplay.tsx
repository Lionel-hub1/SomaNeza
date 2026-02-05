'use client';

import { GeneratedResult } from '@/lib/kinyarwanda';
import LetterCard from './LetterCard';

interface LetterDisplayProps {
    result: GeneratedResult | null;
    onReveal: (index: number) => void;
    onToggleHide: (index: number) => void;
    isTeacherMode: boolean;
}

export default function LetterDisplay({
    result,
    onReveal,
    onToggleHide,
    isTeacherMode
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

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Main letter display */}
            <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
                {result.letterStates.map((letterState, index) => (
                    <LetterCard
                        key={`${result.display}-${index}`}
                        letterState={letterState}
                        index={index}
                        onReveal={onReveal}
                        onToggleHide={onToggleHide}
                        isTeacherMode={isTeacherMode}
                    />
                ))}
            </div>

            {/* Pattern indicator */}
            <div className="text-sm md:text-base text-gray-500 font-medium">
                {getPatternLabel(result.pattern)}
            </div>

            {/* Teacher mode hint */}
            {isTeacherMode && (
                <div className="text-xs md:text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
                    👆 Tap any letter to hide/show it for the student
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
        case 'mixed':
            return '🎲 Mixed';
        default:
            return '';
    }
}
