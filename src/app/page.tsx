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
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 md:p-8"
      onDoubleClick={appView === 'learn' ? handleRevealAll : undefined}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer"
            onClick={() => setAppView('learn')}
          >
            SomaNeza 📚
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Iga gusoma Ikinyarwanda! 🇷🇼
          </p>
          <p className="text-sm text-gray-500">
            Learn to read Kinyarwanda
          </p>
        </header>

        {/* Navigation tabs */}
        <nav className="flex justify-center gap-4">
          <button
            onClick={() => setAppView('learn')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${appView === 'learn'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/50 text-gray-700 hover:bg-white/80'
              }`}
          >
            📖 Iga (Learn)
          </button>
          <button
            onClick={() => setAppView('games')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${appView === 'games' || appView === 'playing' || appView === 'complete'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
              : 'bg-white/50 text-gray-700 hover:bg-white/80'
              }`}
          >
            🎮 Imikino (Games)
          </button>
        </nav>

        {/* Learn View */}
        {appView === 'learn' && (
          <>
            {/* Mode Selector */}
            <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-lg">
              <ModeSelector
                currentMode={learningMode}
                onModeChange={handleModeChange}
                isTeacherMode={isTeacherMode}
                onTeacherModeToggle={() => setIsTeacherMode(prev => !prev)}
              />
            </section>

            {/* Progressive Mode Stats */}
            {learningMode === 'progressive' && (
              <div className="flex items-center justify-center gap-6 text-center">
                <div className="bg-white rounded-2xl px-6 py-3 shadow-md">
                  <span className="text-2xl font-bold text-indigo-600">{progressiveLevel}</span>
                  <span className="text-sm text-gray-500 block">Level</span>
                </div>
                <div className="bg-white rounded-2xl px-6 py-3 shadow-md">
                  <span className="text-2xl font-bold text-emerald-600">{progressiveScore}</span>
                  <span className="text-sm text-gray-500 block">Score</span>
                </div>
              </div>
            )}

            {/* Pattern Controls (hidden in progressive mode) */}
            {learningMode !== 'progressive' && (
              <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-lg">
                <PatternControls
                  enabledPatterns={enabledPatterns}
                  onTogglePattern={handleTogglePattern}
                />
              </section>
            )}

            {/* Main Display Area */}
            <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-xl min-h-[250px] md:min-h-[350px] flex items-center justify-center">
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
            <section className="flex justify-center">
              <GenerateButton onClick={handleGenerate} />
            </section>

            {/* Settings Panel */}
            <section>
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
              />
            </section>

            {/* Help Text */}
            <footer className="text-center text-sm text-gray-500 space-y-1">
              <p>
                {learningMode === 'guess' && '👆 Tap ? to reveal hidden letters • Double-tap to reveal all'}
                {learningMode === 'read' && '📖 Read the letters aloud!'}
                {learningMode === 'progressive' && '🎯 Progress through levels by revealing letters correctly!'}
              </p>
              {isTeacherMode && (
                <p className="text-amber-600">
                  👨‍🏫 Teacher Mode: Tap any letter to hide/show it
                </p>
              )}
            </footer>
          </>
        )}

        {/* Games View */}
        {appView === 'games' && (
          <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-xl">
            {/* Difficulty selector */}
            <div className="mb-6 flex justify-center gap-2">
              {(['easy', 'medium', 'hard'] as GameDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setGameDifficulty(diff)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${gameDifficulty === diff
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-xl">
            {renderGame()}
          </section>
        )}

        {/* Complete View */}
        {appView === 'complete' && completedGameState && (
          <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-xl">
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
