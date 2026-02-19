'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LearningMode,
  PatternType,
  GeneratedResult,
  DEFAULT_SETTINGS,
  DEFAULT_CONSONANT_CLUSTERS,
  getPatternsForDifficulty,
  DifficultyLevel,
  GameType,
  GameDifficulty,
  GameState,
  LetterState,
} from '@/lib/kinyarwanda';
import {
  generate,
  hideRandomLetters,
  revealLetter,
  toggleLetterHidden,
  showAllLetters,
  revealAllLetters
} from '@/lib/generator';
import LetterDisplay from '@/components/LetterDisplay';
import GenerateButton from '@/components/GenerateButton';
import ModeSelector from '@/components/ModeSelector';
import PatternControls from '@/components/PatternControls';
import SettingsPanel from '@/components/SettingsPanel';
import {
  GameSelector,
  SyllableMatchGame,
  MissingLetterGame,
  WordScrambleGame,
  FlashCardGame,
  GameComplete,
} from '@/components/games';

type AppView = 'learn' | 'games' | 'playing' | 'complete';

export default function Home() {
  // App view state
  const [appView, setAppView] = useState<AppView>('learn');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>('easy');
  const [completedGameState, setCompletedGameState] = useState<GameState | null>(null);

  // Core state
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [learningMode, setLearningMode] = useState<LearningMode>('read');
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  // Settings state
  const [enabledPatterns, setEnabledPatterns] = useState<PatternType[]>(
    DEFAULT_SETTINGS.enabledPatterns
  );
  const [lettersToHide, setLettersToHide] = useState(DEFAULT_SETTINGS.lettersToHide);
  const [autoInterval, setAutoInterval] = useState<number | null>(
    DEFAULT_SETTINGS.autoGenerateInterval
  );
  const [customClusters, setCustomClusters] = useState<string[]>(
    [...DEFAULT_CONSONANT_CLUSTERS]
  );
  const [clusterConsonantCounts, setClusterConsonantCounts] = useState<number[] | 'all'>(
    DEFAULT_SETTINGS.clusterConsonantCounts
  );
  const [prioritizedConsonants, setPrioritizedConsonants] = useState<string[]>(
    DEFAULT_SETTINGS.prioritizedConsonants
  );
  const [prioritizedClusters, setPrioritizedClusters] = useState<string[]>(
    DEFAULT_SETTINGS.prioritizedClusters
  );
  const [hideTarget, setHideTarget] = useState<'vowels' | 'consonants' | 'both'>(
    DEFAULT_SETTINGS.hideTarget
  );
  const [wordFilter, setWordFilter] = useState<'all' | 'no-clusters' | 'only-clusters'>(
    DEFAULT_SETTINGS.wordFilter
  );
  const [showImages, setShowImages] = useState(DEFAULT_SETTINGS.showImages);
  const [clusterFilterContains, setClusterFilterContains] = useState<string[]>(
    DEFAULT_SETTINGS.clusterFilterContains
  );
  const [clusterFilterVowel, setClusterFilterVowel] = useState<string | 'all'>(
    DEFAULT_SETTINGS.clusterFilterVowel
  );

  const [wordFilterClusters, setWordFilterClusters] = useState<string[]>(
    DEFAULT_SETTINGS.wordFilterClusters
  );

  // Progressive mode state
  const [progressiveLevel, setProgressiveLevel] = useState<DifficultyLevel>(1);
  const [progressiveScore, setProgressiveScore] = useState(0);

  // Generate new syllable
  const handleGenerate = useCallback(() => {
    let patterns = enabledPatterns;

    // Use progressive patterns if in progressive mode
    if (learningMode === 'progressive') {
      patterns = getPatternsForDifficulty(progressiveLevel);
    }

    let newResult = generate(patterns, {
      customClusters,
      clusterConsonantCounts,
      prioritizedConsonants,
      prioritizedClusters,

      wordFilter,
      wordFilterClusters, // Pass the new filter state
      clusterFilterContains,
      clusterFilterVowel,
    });

    // Apply hiding based on mode
    if (learningMode === 'guess') {
      newResult = hideRandomLetters(newResult, lettersToHide, hideTarget);
    }

    setResult(newResult);
  }, [
    enabledPatterns,
    learningMode,
    progressiveLevel,
    customClusters,
    lettersToHide,
    clusterConsonantCounts,
    prioritizedConsonants,
    prioritizedClusters,
    hideTarget,

    wordFilter,
    wordFilterClusters,
    clusterFilterContains,
    clusterFilterVowel,
  ]);

  // Handle letter reveal (for guess mode)
  const handleReveal = useCallback((index: number) => {
    if (result) {
      const newResult = revealLetter(result, index);
      setResult(newResult);

      // Check if all revealed in progressive mode
      if (learningMode === 'progressive') {
        const allRevealed = newResult.letterStates.every(
          (s: LetterState) => !s.isHidden || s.isRevealed
        );
        if (allRevealed) {
          setProgressiveScore(prev => prev + 1);
          // Level up every 5 correct
          if ((progressiveScore + 1) % 5 === 0 && progressiveLevel < 3) {
            setProgressiveLevel(prev => (prev + 1) as DifficultyLevel);
          }
        }
      }
    }
  }, [result, learningMode, progressiveLevel, progressiveScore]);

  // Handle teacher toggling letter visibility
  const handleToggleHide = useCallback((index: number) => {
    if (result && isTeacherMode) {
      setResult(toggleLetterHidden(result, index));
    }
  }, [result, isTeacherMode]);

  // Handle mode change
  const handleModeChange = useCallback((mode: LearningMode) => {
    setLearningMode(mode);

    // Reset progressive state when entering progressive mode
    if (mode === 'progressive') {
      setProgressiveLevel(1);
      setProgressiveScore(0);
    }

    // Update current result based on new mode
    if (result) {
      if (mode === 'read') {
        setResult(showAllLetters(result));
      } else if (mode === 'guess') {
        setResult(hideRandomLetters(result, lettersToHide));
      }
    }
  }, [result, lettersToHide]);

  // Handle pattern toggle
  const handleTogglePattern = useCallback((pattern: PatternType) => {
    setEnabledPatterns(prev => {
      if (prev.includes(pattern)) {
        // Don't allow removing last pattern
        if (prev.length === 1) return prev;
        return prev.filter(p => p !== pattern);
      }
      return [...prev, pattern];
    });
  }, []);

  // Auto-generation effect
  useEffect(() => {
    if (autoInterval) {
      const timer = setInterval(handleGenerate, autoInterval);
      return () => clearInterval(timer);
    }
  }, [autoInterval, handleGenerate]);

  // Reveal all shortcut (double-tap anywhere)
  const handleRevealAll = useCallback(() => {
    if (result && learningMode === 'guess') {
      setResult(revealAllLetters(result));
    }
  }, [result, learningMode]);

  // Game handlers
  const handleSelectGame = (game: GameType) => {
    setSelectedGame(game);
    setAppView('playing');
  };

  const handleGameComplete = (state: GameState) => {
    setCompletedGameState(state);
    setAppView('complete');
  };

  const handlePlayAgain = () => {
    setAppView('playing');
    setCompletedGameState(null);
  };

  const handleBackToGames = () => {
    setAppView('games');
    setSelectedGame(null);
    setCompletedGameState(null);
  };

  // Render the current game
  const renderGame = () => {
    if (!selectedGame) return null;

    const gameProps = {
      difficulty: gameDifficulty,
      onComplete: handleGameComplete,
      onBack: handleBackToGames,
    };

    switch (selectedGame) {
      case 'syllablematch':
        return <SyllableMatchGame {...gameProps} />;
      case 'missingletter':
        return <MissingLetterGame {...gameProps} />;
      case 'wordscramble':
        return <WordScrambleGame {...gameProps} />;
      case 'flashcard':
        return <FlashCardGame {...gameProps} />;
      default:
        return null;
    }
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 md:p-8 overflow-x-hidden"
      onDoubleClick={appView === 'learn' ? handleRevealAll : undefined}
    >
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20 md:pb-0">
        {/* Header */}
        <header className="text-center space-y-2 pt-2">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer tracking-tight"
            onClick={() => setAppView('learn')}
          >
            SomaNeza 📚
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium">
            Iga gusoma Ikinyarwanda! 🇷🇼
          </p>
        </header>

        {/* Navigation tabs */}
        <nav className="flex justify-center gap-3 md:gap-4 p-1">
          <button
            onClick={() => setAppView('learn')}
            className={`flex-1 md:flex-none px-4 py-3 md:px-6 rounded-2xl font-bold text-sm md:text-base transition-all active:scale-95 touch-manipulation shadow-sm ${appView === 'learn'
              ? 'bg-white text-indigo-600 ring-2 ring-indigo-100 shadow-md'
              : 'bg-white/60 text-gray-500 hover:bg-white/80'
              }`}
          >
            📖 Iga (Learn)
          </button>
          <button
            onClick={() => setAppView('games')}
            className={`flex-1 md:flex-none px-4 py-3 md:px-6 rounded-2xl font-bold text-sm md:text-base transition-all active:scale-95 touch-manipulation shadow-sm ${appView === 'games' || appView === 'playing' || appView === 'complete'
              ? 'bg-white text-rose-600 ring-2 ring-rose-100 shadow-md'
              : 'bg-white/60 text-gray-500 hover:bg-white/80'
              }`}
          >
            🎮 Imikino (Games)
          </button>
        </nav>

        {/* Learn View */}
        {appView === 'learn' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Mode Selector */}
            <section className="bg-white/60 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-sm border border-white/50">
              <ModeSelector
                currentMode={learningMode}
                onModeChange={handleModeChange}
                isTeacherMode={isTeacherMode}
                onTeacherModeToggle={() => setIsTeacherMode(prev => !prev)}
              />
            </section>

            {/* Progressive Mode Stats */}
            {learningMode === 'progressive' && (
              <div className="flex items-center justify-center gap-4 text-center">
                <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-indigo-50 w-32">
                  <span className="text-3xl font-black text-indigo-600 block leading-none mb-1">{progressiveLevel}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Level</span>
                </div>
                <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-emerald-50 w-32">
                  <span className="text-3xl font-black text-emerald-600 block leading-none mb-1">{progressiveScore}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Score</span>
                </div>
              </div>
            )}

            {/* Pattern Controls (hidden in progressive mode) */}
            {learningMode !== 'progressive' && (
              <section className="bg-white/60 backdrop-blur-md rounded-3xl p-1 shadow-sm border border-white/50">
                <PatternControls
                  enabledPatterns={enabledPatterns}
                  onTogglePattern={handleTogglePattern}
                />
              </section>
            )}

            {/* Main Display Area */}
            <section className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-4 md:p-10 shadow-xl shadow-indigo-100/50 min-h-[280px] md:min-h-[350px] flex items-center justify-center relative overflow-hidden border border-white">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 -z-10" />
              <LetterDisplay
                result={result}
                onReveal={handleReveal}
                onToggleHide={handleToggleHide}
                isTeacherMode={isTeacherMode}
                learningMode={learningMode}
                showImages={showImages}
              />
            </section>

            {/* Generate Button */}
            <section className="flex justify-center py-2">
              <GenerateButton onClick={handleGenerate} />
            </section>

            {/* Settings Panel */}
            <section className="relative z-10">
              <SettingsPanel
                lettersToHide={lettersToHide}
                onLettersToHideChange={setLettersToHide}
                autoInterval={autoInterval}
                onAutoIntervalChange={setAutoInterval}
                customClusters={customClusters}
                onCustomClustersChange={setCustomClusters}
                clusterConsonantCounts={clusterConsonantCounts}
                onClusterConsonantCountsChange={setClusterConsonantCounts}
                prioritizedConsonants={prioritizedConsonants}
                onPrioritizedConsonantsChange={setPrioritizedConsonants}
                prioritizedClusters={prioritizedClusters}
                onPrioritizedClustersChange={setPrioritizedClusters}
                hideTarget={hideTarget}
                onHideTargetChange={setHideTarget}
                wordFilter={wordFilter}
                onWordFilterChange={setWordFilter}
                showImages={showImages}
                onShowImagesChange={setShowImages}
                clusterFilterContains={clusterFilterContains}
                onClusterFilterContainsChange={setClusterFilterContains}
                clusterFilterVowel={clusterFilterVowel}
                onClusterFilterVowelChange={setClusterFilterVowel}
                wordFilterClusters={wordFilterClusters}
                onWordFilterClustersChange={setWordFilterClusters}
              />
            </section>

            {/* Help Text */}
            <footer className="text-center text-xs md:text-sm text-gray-400 space-y-1 pb-10">
              <p>
                {learningMode === 'guess' && '👆 Kanda ku ?  cyangwa ukande kabiri hose'}
                {learningMode === 'read' && '📖 Soma inyuguti cyangwa ijambo!'}
                {learningMode === 'progressive' && '🎯 Tera imbere ugenda ufungura inyuguti!'}
              </p>
            </footer>
          </div>
        )}

        {/* Games View */}
        {appView === 'games' && (
          <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/50">
            {/* Difficulty selector */}
            <div className="mb-8 flex justify-center gap-2">
              {(['easy', 'medium', 'hard'] as GameDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setGameDifficulty(diff)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${gameDifficulty === diff
                    ? 'bg-rose-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {diff === 'easy' ? '⭐ Byoroshye' : diff === 'medium' ? '⭐⭐ Hagati' : '⭐⭐⭐ Bigoye'}
                </button>
              ))}
            </div>
            <GameSelector onSelectGame={handleSelectGame} />
          </section>
        )}

        {/* Playing View */}
        {appView === 'playing' && (
          <section className="bg-white/80 backdrop-blur-md rounded-3xl p-4 md:p-8 shadow-xl border border-white/50 h-[80vh] flex flex-col">
            {renderGame()}
          </section>
        )}

        {/* Complete View */}
        {appView === 'complete' && completedGameState && (
          <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/50">
            <GameComplete
              state={completedGameState}
              onPlayAgain={handlePlayAgain}
              onBackToMenu={handleBackToGames}
            />
          </section>
        )}
      </div>
    </main>
  );
}
