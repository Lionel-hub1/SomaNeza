'use client';

import { useState, useMemo } from 'react';
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
    soundEnabled: boolean;
    onSoundEnabledChange: (enabled: boolean) => void;
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
    soundEnabled,
    onSoundEnabledChange
}: SettingsPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'consonants' | 'clusters'>('general');

    // Get available consonant counts from current clusters
    const availableCounts = useMemo(() => {
        const counts = new Set(customClusters.map(c => c.length));
        return Array.from(counts).sort((a, b) => a - b);
    }, [customClusters]);

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
        if (list.includes(item)) {
            setter(list.filter(i => i !== item));
        } else {
            setter([...list, item]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-center gap-2 py-4 text-gray-500 hover:text-gray-700 transition-colors bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm"
            >
                <span className="text-xl">⚙️</span>
                <span className="text-sm font-bold uppercase tracking-wider">
                    {isOpen ? 'Funga Igenamiterere (Close)' : 'Fungura Igenamiterere (Settings)'}
                </span>
            </button>

            {/* Settings Content */}
            {isOpen && (
                <div className="mt-4 p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        {[
                            { id: 'general', label: 'Rusange', sub: 'General' },
                            { id: 'consonants', label: 'Ingombajwi', sub: 'Consonants' },
                            { id: 'clusters', label: 'ibihekane', sub: 'Clusters' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-3 px-4 rounded-lg transition-all ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-md scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <div className="text-sm font-bold leading-none">{tab.label}</div>
                                <div className="text-[10px] uppercase tracking-tighter opacity-70 mt-1">{tab.sub}</div>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[300px]">
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                {/* Sound Toggle */}
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                        Amajwi (Sound)
                                        <span className="block text-[10px] text-gray-400 font-normal">Enable/disable app sounds</span>
                                    </label>
                                    <button
                                        onClick={() => onSoundEnabledChange(!soundEnabled)}
                                        className={`w-14 h-8 rounded-full transition-all relative ${soundEnabled ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${soundEnabled ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                                {/* Letters to Hide */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                            Umubare w'inyuguti zihishwa
                                            <span className="block text-[10px] text-gray-400 font-normal">Letters to Hide (Guess Mode)</span>
                                        </label>
                                        <span className="text-2xl font-black text-indigo-600">{lettersToHide}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="4"
                                        value={lettersToHide}
                                        onChange={(e) => onLettersToHideChange(parseInt(e.target.value))}
                                        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                {/* Auto-Generation Timer */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                        Igihe cyo guhindura imyitozo
                                        <span className="block text-[10px] text-gray-400 font-normal">Auto-Generate Timer</span>
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[null, 3000, 5000, 10000].map((interval) => (
                                            <button
                                                key={interval ?? 'off'}
                                                onClick={() => onAutoIntervalChange(interval)}
                                                className={`
                                                    py-3 rounded-xl text-sm font-bold transition-all
                                                    ${autoInterval === interval
                                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                                                        : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                                                    }
                                                `}
                                            >
                                                {interval === null ? 'Off' : `${interval / 1000}s`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Cluster Length Filter */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                        Uburebure bw'ibihekane
                                        <span className="block text-[10px] text-gray-400 font-normal">Filter by Consonant Count</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => onClusterConsonantCountsChange('all')}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${clusterConsonantCounts === 'all'
                                                ? 'bg-indigo-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            Yose (All)
                                        </button>
                                        {availableCounts.map(count => (
                                            <button
                                                key={count}
                                                onClick={() => handleToggleCount(count)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${clusterConsonantCounts !== 'all' && clusterConsonantCounts.includes(count)
                                                    ? 'bg-indigo-500 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {count} {count === 1 ? 'consonant' : 'consonants'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'consonants' && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <p className="text-xs text-indigo-700 font-medium">
                                        Uraka kanda ku nyuguti ushaka ko ziza kenshi mu myitozo (CV).
                                        <span className="block opacity-75">Tap a consonant to prioritize it in CV mode.</span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                                    {CONSONANTS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => togglePriority(c, prioritizedConsonants, onPrioritizedConsonantsChange)}
                                            className={`aspect-square flex items-center justify-center rounded-xl text-lg font-bold transition-all relative ${prioritizedConsonants.includes(c)
                                                ? 'bg-indigo-500 text-white shadow-md scale-110 z-10'
                                                : 'bg-white text-gray-500 border border-gray-100 hover:border-indigo-300'
                                                }`}
                                        >
                                            {c}
                                            {prioritizedConsonants.includes(c) && (
                                                <span className="absolute -top-1 -right-1 text-[10px]">⭐</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'clusters' && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                                    <p className="text-xs text-purple-700 font-medium">
                                        Kanda ku gakwata ushaka ko gashimangirwa (Cluster + V).
                                        <span className="block opacity-75">Tap a cluster to prioritize it in Cluster mode.</span>
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-indigo-200">
                                    {customClusters.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => togglePriority(c, prioritizedClusters, onPrioritizedClustersChange)}
                                            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all relative ${prioritizedClusters.includes(c)
                                                ? 'bg-purple-500 text-white shadow-md scale-105 z-10'
                                                : 'bg-white text-gray-500 border border-gray-100 hover:border-purple-300'
                                                }`}
                                        >
                                            {c}
                                            {prioritizedClusters.includes(c) && (
                                                <span className="absolute -top-1 -right-1 text-[8px]">⭐</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-top border-gray-50 text-center">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
                            Igenamiterere ribikwa mu gihe ririmo gukoreshwa
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
