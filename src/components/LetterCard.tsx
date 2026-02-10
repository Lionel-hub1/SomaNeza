'use client';

import { LetterState } from '@/lib/kinyarwanda';

interface LetterCardProps {
    letterState: LetterState;
    index: number;
    onReveal: (index: number) => void;
    onToggleHide: (index: number) => void;
    isTeacherMode: boolean;
    size?: 'normal' | 'compact' | 'tiny' | 'fluid';
}

export default function LetterCard({
    letterState,
    index,
    onReveal,
    onToggleHide,
    isTeacherMode,
    size = 'normal'
}: LetterCardProps) {
    const { letter, isHidden, isRevealed } = letterState;

    // Determine what to show
    const showLetter = !isHidden || isRevealed;

    const handleClick = () => {
        if (isTeacherMode) {
            // Teacher can toggle hide state
            onToggleHide(index);
        } else if (isHidden && !isRevealed) {
            // Student can reveal hidden letters
            onReveal(index);
        }
    };

    // Dynamic classes based on size
    const sizeClasses = {
        normal: 'w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 text-5xl md:text-7xl lg:text-8xl',
        compact: 'w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-4xl md:text-6xl lg:text-7xl',
        tiny: 'w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-2xl md:text-4xl lg:text-5xl',
        fluid: 'flex-1 min-w-0 aspect-square max-w-[80px] h-auto text-xl md:text-3xl' // Fluid width for very long words
    };

    return (
        <button
            onClick={handleClick}
            className={`
        relative
        aspect-square
        rounded-xl md:rounded-3xl
        flex items-center justify-center
        font-bold
        transition-all duration-300
        transform
        ${sizeClasses[size]}
        ${showLetter
                    ? 'bg-white shadow-lg text-indigo-600 hover:shadow-xl'
                    : 'bg-gradient-to-br from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 cursor-pointer'
                }
        ${isTeacherMode
                    ? 'ring-4 ring-offset-2 ' + (isHidden ? 'ring-rose-400' : 'ring-emerald-400')
                    : ''
                }
        ${!showLetter ? 'animate-pulse hover:animate-none' : ''}
        active:scale-95
      `}
            aria-label={showLetter ? `Letter ${letter}` : 'Hidden letter, tap to reveal'}
        >
            {showLetter ? (
                <span className={`
          ${isRevealed ? 'animate-bounce-in' : ''}
        `}>
                    {letter}
                </span>
            ) : (
                <span className="text-4xl md:text-6xl">?</span>
            )}

            {/* Teacher mode indicator */}
            {isTeacherMode && (
                <span className={`
          absolute -top-2 -right-2
          w-6 h-6 md:w-8 md:h-8
          rounded-full
          flex items-center justify-center
          text-xs md:text-sm
          font-semibold
          ${isHidden ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}
        `}>
                    {isHidden ? '👁️‍🗨️' : '👁️'}
                </span>
            )}
        </button>
    );
}
