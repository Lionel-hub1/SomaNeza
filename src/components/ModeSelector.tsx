'use client';

import { LearningMode } from '@/lib/kinyarwanda';

interface ModeSelectorProps {
    currentMode: LearningMode;
    onModeChange: (mode: LearningMode) => void;
    isTeacherMode: boolean;
    onTeacherModeToggle: () => void;
}

const modes: { value: LearningMode; label: string; emoji: string; description: string }[] = [
    { value: 'read', label: 'Soma', emoji: '📖', description: 'Read Mode' },
    { value: 'guess', label: 'Shakisha', emoji: '🤔', description: 'Guess Mode' },
    { value: 'progressive', label: 'Iga', emoji: '📈', description: 'Progressive' }
];

export default function ModeSelector({
    currentMode,
    onModeChange,
    isTeacherMode,
    onTeacherModeToggle
}: ModeSelectorProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Learning Mode Selection */}
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                {modes.map(mode => (
                    <button
                        key={mode.value}
                        onClick={() => onModeChange(mode.value)}
                        className={`
              flex flex-col items-center gap-1
              px-4 py-3 md:px-6 md:py-4
              rounded-2xl
              transition-all duration-300
              ${currentMode === mode.value
                                ? 'bg-indigo-500 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-indigo-50 hover:shadow-md'
                            }
            `}
                    >
                        <span className="text-2xl md:text-3xl">{mode.emoji}</span>
                        <span className="font-semibold text-sm md:text-base">{mode.label}</span>
                        <span className="text-xs opacity-70">{mode.description}</span>
                    </button>
                ))}
            </div>

            {/* Teacher Mode Toggle */}
            <div className="flex justify-center">
                <button
                    onClick={onTeacherModeToggle}
                    className={`
            flex items-center gap-2
            px-4 py-2
            rounded-full
            text-sm font-medium
            transition-all duration-300
            ${isTeacherMode
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
          `}
                >
                    <span className="text-lg">{isTeacherMode ? '👨‍🏫' : '👶'}</span>
                    <span>{isTeacherMode ? 'Teacher Mode' : 'Student Mode'}</span>
                </button>
            </div>
        </div>
    );
}
