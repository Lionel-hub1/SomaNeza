'use client';

interface GenerateButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export default function GenerateButton({ onClick, disabled = false }: GenerateButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        relative
        px-12 py-5 md:px-16 md:py-6
        text-2xl md:text-3xl
        font-bold
        text-white
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        rounded-full
        shadow-lg
        transition-all duration-300
        transform
        hover:shadow-2xl hover:scale-105
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        overflow-hidden
        group
      `}
        >
            {/* Animated background */}
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Sparkle effects */}
            <span className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full opacity-70 animate-ping" />
            <span className="absolute bottom-3 right-6 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-ping animation-delay-200" />

            {/* Button text */}
            <span className="relative flex items-center gap-3">
                <span className="text-3xl">✨</span>
                <span>Kora!</span>
                <span className="text-3xl">✨</span>
            </span>
        </button>
    );
}
