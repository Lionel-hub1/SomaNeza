'use client';

import { useState, useMemo, useEffect } from 'react';
import { CONSONANTS, DEFAULT_CONSONANT_CLUSTERS } from '@/lib/kinyarwanda';

interface SettingsPanelProps {
    lettersToHide: number;
    onLettersToHideChange: (count: number) => void;
    autoInterval: number | null;
    onAutoIntervalChange: (interval: number | null) => void;
    customClusters: string[];
    onCustomClustersChange: (clusters: string[]) => void;
    clusterConsonantCounts: number[] | 'all';
    onClusterConsonantCountsChange: (counts: number[] | 'all') => void;
    prioritizedConsonants: string[];
    onPrioritizedConsonantsChange: (consonants: string[]) => void;
    prioritizedClusters: string[];
    onPrioritizedClustersChange: (clusters: string[]) => void;
    hideTarget: 'vowels' | 'consonants' | 'both';
    onHideTargetChange: (target: 'vowels' | 'consonants' | 'both') => void;
    wordFilter: 'all' | 'no-clusters' | 'only-clusters';
    onWordFilterChange: (filter: 'all' | 'no-clusters' | 'only-clusters') => void;
    showImages: boolean;

    onShowImagesChange: (show: boolean) => void;
    clusterFilterContains: string[];
    onClusterFilterContainsChange: (filters: string[]) => void;
    clusterFilterVowel: string | 'all';
    onClusterFilterVowelChange: (vowel: string | 'all') => void;
    wordFilterClusters: string[];
    onWordFilterClustersChange: (clusters: string[]) => void;
}

export default function SettingsPanel({
    lettersToHide,
    onLettersToHideChange,
    autoInterval,
    onAutoIntervalChange,
    customClusters,
    onCustomClustersChange,
    clusterConsonantCounts,
    onClusterConsonantCountsChange,
    prioritizedConsonants,
    onPrioritizedConsonantsChange,
    prioritizedClusters,
    onPrioritizedClustersChange,
    hideTarget,
    onHideTargetChange,
    wordFilter,
    onWordFilterChange,
    showImages,

    onShowImagesChange,
    clusterFilterContains,
    onClusterFilterContainsChange,
    clusterFilterVowel,
    onClusterFilterVowelChange,
    wordFilterClusters,
    onWordFilterClustersChange,
}: SettingsPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'consonants' | 'clusters' | 'words'>('general');

    // Get available consonant counts from current clusters
    const availableCounts = useMemo(() => {
        const counts = new Set(DEFAULT_CONSONANT_CLUSTERS.map(c => c.length));
        return Array.from(counts).sort((a, b) => a - b);
    }, []);

    const handleToggleCount = (count: number) => {
        if (clusterConsonantCounts === 'all') {
            onClusterConsonantCountsChange([count]);
        } else {
            if (clusterConsonantCounts.includes(count)) {
                if (clusterConsonantCounts.length === 1) {
                    onClusterConsonantCountsChange('all');
                } else {
                    onClusterConsonantCountsChange(clusterConsonantCounts.filter(c => c !== count));
                }
            } else {
                onClusterConsonantCountsChange([...clusterConsonantCounts, count]);
            }
        }
    };

    const togglePriority = (item: string, list: string[], setter: (newList: string[]) => void) => {
        const newList = list.includes(item)
            ? list.filter(i => i !== item)
            : [...list, item];
        setter(newList);
    };

    // Prevent body scroll when mobile modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.touchAction = 'auto';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.touchAction = 'auto';
        };
    }, [isOpen]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-4 text-gray-600 hover:text-gray-900 transition-colors bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm active:scale-[0.98]"
            >
                <span className="text-xl">⚙️</span>
                <span className="text-sm font-bold uppercase tracking-wider">
                    Fungura Igenamiterere (Settings)
                </span>
            </button>

            {/* Modal/Panel Overlay */}
            <div className={`
                fixed inset-0 z-[100] flex items-end md:items-center justify-center
                transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
            `}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />

                {/* Panel */}
                <div className={`
                    relative w-full md:w-[90%] md:max-w-2xl h-[90vh] md:h-auto md:max-h-[85vh]
                    bg-white md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col
                    transition-transform duration-300 ease-in-out overflow-hidden
                    ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full md:translate-y-10 md:scale-95'}
                `}>

                    {/* Header - Fixed */}
                    <div className="flex-none p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">⚙️</span>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 leading-tight">Igenamiterere</h2>
                                <p className="text-xs text-gray-400 font-medium">Settings</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors active:scale-90"
                        >
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs - Sticky */}
                    <div className="flex-none px-4 pb-2 border-b border-gray-50 overflow-x-auto scrollbar-hide bg-white z-10">
                        <div className="flex gap-2 min-w-max">
                            {[
                                { id: 'general', label: 'Rusange', sub: 'General' },
                                { id: 'consonants', label: 'Ingombajwi', sub: 'Consonants' },
                                { id: 'clusters', label: 'Ibihekane', sub: 'Clusters' },
                                { id: 'words', label: 'Amagambo', sub: 'Words' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`
                                        flex flex-col items-center justify-center
                                        py-2 px-4 rounded-xl transition-all min-w-[90px]
                                        ${activeTab === tab.id
                                            ? 'bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-200'
                                            : 'text-gray-500 hover:bg-gray-50 font-medium'
                                        }
                                    `}
                                >
                                    <span className="text-sm">{tab.label}</span>
                                    <span className="text-[9px] uppercase tracking-wider opacity-60">{tab.sub}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-gray-50/50 overscroll-contain">
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Word Filter Type */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                                    <div>
                                        <label className="text-sm font-bold text-gray-800">
                                            Ubwoko bw'amagambo
                                        </label>
                                        <span className="block text-xs text-gray-400">Word Filter Mode</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'all', label: 'Yose', sub: 'All' },
                                            { id: 'no-clusters', label: 'Matoya', sub: 'Simple' },
                                            { id: 'only-clusters', label: 'Ibihekane', sub: 'Clusters' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => onWordFilterChange(opt.id as any)}
                                                className={`
                                                    py-2 rounded-xl border transition-all flex flex-col items-center
                                                    ${wordFilter === opt.id
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                                        : 'bg-gray-50 text-gray-500 border-gray-100'
                                                    }
                                                `}
                                            >
                                                <span className="text-xs font-bold">{opt.label}</span>
                                                <span className="text-[8px] opacity-70 uppercase tracking-tighter">{opt.sub}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Cluster Consonant Count Filter */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                                    <div>
                                        <label className="text-sm font-bold text-gray-800">
                                            Uburebure bw'ibihekane
                                        </label>
                                        <span className="block text-xs text-gray-400">Filter by Consonant Count</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => onClusterConsonantCountsChange('all')}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${clusterConsonantCounts === 'all'
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-gray-50 text-gray-500 border-gray-100'
                                                }`}
                                        >
                                            YOSE (ALL)
                                        </button>
                                        {availableCounts.map(count => (
                                            <button
                                                key={count}
                                                onClick={() => handleToggleCount(count)}
                                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${clusterConsonantCounts !== 'all' && clusterConsonantCounts.includes(count)
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                    : 'bg-gray-50 text-gray-500 border-gray-100'
                                                    }`}
                                            >
                                                {count} {count === 1 ? 'LET' : 'LETS'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Letters to Hide Selection (Guess Mode Target) */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                                    <div>
                                        <label className="text-sm font-bold text-gray-800">
                                            Inyuguti zihishwa (Guess Mode)
                                        </label>
                                        <span className="block text-xs text-gray-400">Target for Hiding</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'vowels', label: 'Inyajwi', sub: 'Vowels' },
                                            { id: 'consonants', label: 'Ingombajwi', sub: 'Cons.' },
                                            { id: 'both', label: 'Byose', sub: 'Both' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => onHideTargetChange(opt.id as any)}
                                                className={`
                                                    py-2 rounded-xl border transition-all flex flex-col items-center
                                                    ${hideTarget === opt.id
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                                        : 'bg-gray-50 text-gray-500 border-gray-100'
                                                    }
                                                `}
                                            >
                                                <span className="text-xs font-bold">{opt.label}</span>
                                                <span className="text-[8px] opacity-70 uppercase tracking-tighter">{opt.sub}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Hidden Letters Count */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <label className="text-sm font-bold text-gray-800">
                                                Umubare w'inyuguti zihishwa
                                            </label>
                                            <span className="block text-xs text-gray-400">Number of Hidden Letters</span>
                                        </div>
                                        <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-black text-xl">
                                            {lettersToHide}
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="4"
                                        value={lettersToHide}
                                        onChange={(e) => onLettersToHideChange(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                                        <span>1</span>
                                        <span>4</span>
                                    </div>
                                </div>

                                {/* Show Images Toggle */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-bold text-gray-800">
                                            Kwerekana amashusho
                                        </label>
                                        <span className="block text-xs text-gray-400">Show Word Images</span>
                                    </div>
                                    <button
                                        onClick={() => onShowImagesChange(!showImages)}
                                        className={`
                                            w-14 h-8 rounded-full transition-colors relative
                                            ${showImages ? 'bg-indigo-500' : 'bg-gray-200'}
                                        `}
                                    >
                                        <span className={`
                                            absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300
                                            ${showImages ? 'translate-x-6' : 'translate-x-0'}
                                        `} />
                                    </button>
                                </div>

                                {/* Auto-Generation Timer */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                                    <div>
                                        <label className="text-sm font-bold text-gray-800">
                                            Igihe cyo guhindura
                                        </label>
                                        <span className="block text-xs text-gray-400">Auto-Timer</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[null, 3000, 5000, 10000].map((interval) => (
                                            <button
                                                key={interval ?? 'off'}
                                                onClick={() => onAutoIntervalChange(interval)}
                                                className={`
                                                    py-2.5 rounded-xl text-xs font-bold transition-all border
                                                    ${autoInterval === interval
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                                                        : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                                                    }
                                                `}
                                            >
                                                {interval === null ? 'OFF' : `${interval / 1000}s`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'consonants' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                                    <p className="text-xs text-blue-800 font-medium">
                                        Hitamo inyuguti ushaka kwiga (CV)
                                        <span className="block opacity-60 mt-0.5">Select consonants for CV mode</span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 pb-8">
                                    {CONSONANTS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => togglePriority(c, prioritizedConsonants, onPrioritizedConsonantsChange)}
                                            className={`
                                                aspect-square flex items-center justify-center rounded-2xl text-xl font-bold transition-all relative
                                                shadow-sm border
                                                active:scale-95 touch-manipulation
                                                ${prioritizedConsonants.includes(c)
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200'
                                                    : 'bg-white text-gray-500 border-gray-200'
                                                }
                                            `}
                                        >
                                            {c}
                                            {prioritizedConsonants.includes(c) && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'clusters' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
                                {/* Fixed Vowel Selection */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <label className="text-sm font-bold text-gray-800">
                                                Hitamo inyajwi
                                            </label>
                                            <span className="block text-xs text-gray-400">Fixed Vowel</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        <button
                                            onClick={() => onClusterFilterVowelChange('all')}
                                            className={`
                                                flex-none w-12 h-12 rounded-xl text-lg font-bold transition-all flex items-center justify-center border
                                                ${clusterFilterVowel === 'all'
                                                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                                                }
                                            `}
                                        >
                                            *
                                        </button>
                                        {['a', 'e', 'i', 'o', 'u'].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => onClusterFilterVowelChange(v)}
                                                className={`
                                                    flex-none w-12 h-12 rounded-xl text-xl font-bold transition-all flex items-center justify-center border
                                                    ${clusterFilterVowel === v
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                                        : 'bg-gray-50 text-gray-500 border-gray-200'
                                                    }
                                                `}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Cluster Content Filter */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                                    <div>
                                        <label className="text-sm font-bold text-gray-800">
                                            Ibihekane birimo...
                                        </label>
                                        <span className="block text-xs text-gray-400">Clusters Containing...</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['w', 'y', 'n', 'm', 's', 'sh'].map(char => (
                                            <button
                                                key={char}
                                                onClick={() => togglePriority(char, clusterFilterContains, onClusterFilterContainsChange)}
                                                className={`
                                                    px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-grow sm:flex-grow-0 border
                                                    ${clusterFilterContains.includes(char)
                                                        ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                                    }
                                                `}
                                            >
                                                {char}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
                                        <p className="text-xs text-purple-800 font-medium">
                                            Kanda ku gakwata ushaka kwiga (Cluster+V)
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {customClusters.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => togglePriority(c, prioritizedClusters, onPrioritizedClustersChange)}
                                                className={`
                                                    px-3 py-2 rounded-xl text-sm font-bold transition-all relative border
                                                    active:scale-95 touch-manipulation
                                                    ${prioritizedClusters.includes(c)
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                        : 'bg-white text-gray-500 border-gray-200'
                                                    }
                                                `}
                                            >
                                                {c}
                                                {prioritizedClusters.includes(c) && (
                                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'words' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <div className="flex gap-3">
                                        <span className="text-2xl">🔍</span>
                                        <div>
                                            <p className="text-sm text-amber-900 font-bold">
                                                Hitamo ibihekane
                                            </p>
                                            <p className="text-xs text-amber-700 mt-1 opacity-80">
                                                Select clusters to filter generated words. Only words containing selected clusters will be shown.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {DEFAULT_CONSONANT_CLUSTERS.map(cluster => {
                                        const isSelected = wordFilterClusters.includes(cluster);
                                        return (
                                            <button
                                                key={cluster}
                                                onClick={() => togglePriority(cluster, wordFilterClusters, onWordFilterClustersChange)}
                                                className={`
                                                    py-3 px-2 rounded-xl text-sm font-bold transition-all border
                                                    active:scale-95 touch-manipulation
                                                    ${isSelected
                                                        ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-200 transform scale-105'
                                                        : 'bg-white text-gray-600 border-gray-200'
                                                    }
                                                `}
                                            >
                                                {cluster}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
