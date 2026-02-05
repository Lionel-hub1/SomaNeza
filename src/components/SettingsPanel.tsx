'use client';

import { useState } from 'react';

interface SettingsPanelProps {
    lettersToHide: number;
    onLettersToHideChange: (count: number) => void;
    autoInterval: number | null;
    onAutoIntervalChange: (interval: number | null) => void;
    customClusters: string[];
    onCustomClustersChange: (clusters: string[]) => void;
}

export default function SettingsPanel({
    lettersToHide,
    onLettersToHideChange,
    autoInterval,
    onAutoIntervalChange,
    customClusters,
    onCustomClustersChange
}: SettingsPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newCluster, setNewCluster] = useState('');

    const handleAddCluster = () => {
        if (newCluster.trim() && !customClusters.includes(newCluster.trim().toLowerCase())) {
            onCustomClustersChange([...customClusters, newCluster.trim().toLowerCase()]);
            setNewCluster('');
        }
    };

    const handleRemoveCluster = (cluster: string) => {
        onCustomClustersChange(customClusters.filter(c => c !== cluster));
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-center gap-2 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
                <span className="text-lg">⚙️</span>
                <span className="text-sm font-medium">
                    {isOpen ? 'Hide Settings' : 'Show Settings'}
                </span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Settings Content */}
            {isOpen && (
                <div className="mt-4 p-4 bg-white rounded-2xl shadow-lg space-y-6 animate-fade-in">
                    {/* Letters to Hide */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Letters to Hide (Guess Mode)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="4"
                                value={lettersToHide}
                                onChange={(e) => onLettersToHideChange(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <span className="text-lg font-bold text-indigo-600 w-8 text-center">
                                {lettersToHide}
                            </span>
                        </div>
                    </div>

                    {/* Auto-Generation Timer */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Auto-Generate Timer
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {[null, 3000, 5000, 10000].map((interval) => (
                                <button
                                    key={interval ?? 'off'}
                                    onClick={() => onAutoIntervalChange(interval)}
                                    className={`
                    px-3 py-1.5
                    rounded-lg
                    text-sm font-medium
                    transition-all
                    ${autoInterval === interval
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                  `}
                                >
                                    {interval === null ? 'Off' : `${interval / 1000}s`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Clusters */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Consonant Clusters
                        </label>

                        {/* Add new cluster */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCluster}
                                onChange={(e) => setNewCluster(e.target.value)}
                                placeholder="Add cluster (e.g., nk, sh)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCluster()}
                            />
                            <button
                                onClick={handleAddCluster}
                                className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        {/* Cluster list */}
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                            {customClusters.map(cluster => (
                                <span
                                    key={cluster}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm group"
                                >
                                    {cluster}
                                    <button
                                        onClick={() => handleRemoveCluster(cluster)}
                                        className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-indigo-200 opacity-50 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Remove ${cluster}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
