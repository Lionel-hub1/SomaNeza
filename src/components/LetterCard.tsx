'use client';

import { LetterState } from '@/lib/kinyarwanda';

interface LetterCardProps {
    letterState: LetterState;
    index: number;
    onReveal: (index: number) => void;
    onToggleHide: (index: number) => void;
    isTeacherMode: boolean;
}

export default function LetterCard({
    letterState,
    index,
    onReveal,
    onToggleHide,
    isTeacherMode
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

    return (
        <button
            onClick={handleClick}
            className={`
        relative
        min-w-[80px] md:min-w-[120px] lg:min-w-[150px]
        aspect-square
        rounded-3xl
        flex items-center justify-center
        text-5xl md:text-7xl lg:text-8xl
        font-bold
        transition-all duration-300
        transform
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
