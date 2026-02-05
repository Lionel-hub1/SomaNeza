'use client';

import { PatternType } from '@/lib/kinyarwanda';

interface PatternControlsProps {
    enabledPatterns: PatternType[];
    onTogglePattern: (pattern: PatternType) => void;
    disabled?: boolean;
}

const patterns: { value: PatternType; label: string; emoji: string; example: string }[] = [
    { value: 'vowel', label: 'Inyajwi', emoji: '🔴', example: 'a, e, i' },
    { value: 'consonant', label: 'Ingombajwi', emoji: '🔵', example: 'b, k, m' },
    { value: 'cv', label: 'C+V', emoji: '🟢', example: 'ba, ke, mi' },
    { value: 'cluster', label: 'Cluster+V', emoji: '🟣', example: 'kwa, nya, shya' }
];

export default function PatternControls({
    enabledPatterns,
    onTogglePattern,
    disabled = false
}: PatternControlsProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {patterns.map(pattern => {
                const isEnabled = enabledPatterns.includes(pattern.value);

                return (
                    <button
                        key={pattern.value}
                        onClick={() => onTogglePattern(pattern.value)}
                        disabled={disabled}
                        className={`
              flex items-center gap-2
              px-3 py-2 md:px-4 md:py-2.5
              rounded-xl
              text-sm md:text-base
              font-medium
              transition-all duration-200
              ${isEnabled
                                ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        <span>{pattern.emoji}</span>
                        <span>{pattern.label}</span>
                        <span className="text-xs opacity-60">({pattern.example})</span>
                    </button>
                );
            })}
        </div>
    );
}
