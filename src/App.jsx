import React, { useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import BingoCard from './components/BingoCard';
import WinModal from './components/WinModal';
import GameOverModal from './components/GameOverModal';
import WelcomeScreen from './components/WelcomeScreen';
import StatsModal from './components/StatsModal';
import ShareModal from './components/ShareModal';
import ConfettiEffect from './components/ConfettiEffect';
import ToastContainer from './components/ToastContainer';
import { useBingoLogic } from './hooks/useBingoLogic';
import { useTheme } from './hooks/useTheme';
import { useStats } from './hooks/useStats';
import { useSound } from './hooks/useSound';
import { useToast } from './hooks/useToast';
import { useSettings } from './hooks/useSettings';
import SettingsModal from './components/SettingsModal';
import { captureElementAsImage, shareImage, getShareText } from './utils/shareUtils';

function App() {
  const {
    card,
    cardId,
    winState,
    markedCount,
    toggleSquare,
    resetGame,
    initializeCard
  } = useBingoLogic();

  const [showWinModal, setShowWinModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const prevWinStateRef = useRef({ hasBingo: false, isBlackout: false, winType: null });
  const cardRef = useRef(null);
  const hasEndedInactiveGame = useRef(false);
  const lastCheckedGameId = useRef(null);
  const [gameOverTime, setGameOverTime] = useState(null);
  const [gameOverMarkedCount, setGameOverMarkedCount] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [statsOpenedFromGameOver, setStatsOpenedFromGameOver] = useState(false);
  const isUpdatingThemeFromSettings = useRef(false);
  const {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings
  } = useSettings();
  const [theme, toggleTheme] = useTheme();
  const {
    stats,
    recordGameStart,
    recordBingo,
    recordGameEnd,
    getMostCommonWinType,
    getCurrentGameTime,
    getAverageWinTime,
    getAverageBlackoutTime,
    resetStats
  } = useStats(settings.trackStatistics);
  // useSound with settings as ground truth
  const { playSound } = useSound(settings.soundEnabled, settings.soundVolume);
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast();
  const [currentWinTime, setCurrentWinTime] = useState(null);

  useEffect(() => {
    if (theme !== settings.theme) {
      if (settings.theme === 'dark' && theme === 'light') {
        toggleTheme();
      } else if (settings.theme === 'light' && theme === 'dark') {
        toggleTheme();
      }
    }
  }, [settings.theme, theme, toggleTheme]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    updateSetting('theme', newTheme);
  };

  const handleThemeChangeFromSettings = (newTheme) => {
    isUpdatingThemeFromSettings.current = true;
    if (newTheme !== theme) {
      if (newTheme === 'dark' && theme === 'light') {
        toggleTheme();
      } else if (newTheme === 'light' && theme === 'dark') {
        toggleTheme();
      }
    }
    setTimeout(() => {
      isUpdatingThemeFromSettings.current = false;
    }, 100);
  };

  const handleSoundToggle = () => {
    updateSetting('soundEnabled', !settings.soundEnabled);
  };

  const handleVolumeChange = (newVolume) => {
    updateSetting('soundVolume', newVolume);
  };

  const [lastActivityTime, setLastActivityTime] = useState(() => {
    try {
      const stored = localStorage.getItem('bingo_last_activity');
      return stored ? parseInt(stored, 10) : Date.now();
    } catch {
      return Date.now();
    }
  });

  useEffect(() => {
    const updateActivity = () => {
      const now = Date.now();
      setLastActivityTime(now);
      try {
        localStorage.setItem('bingo_last_activity', now.toString());
      } catch (error) {
        console.error('Error saving last activity:', error);
      }
    };

    const events = ['click', 'keydown', 'touchstart', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  useEffect(() => {
    const gameId = card && cardId ? `${cardId}-${stats.lastGameStartTime}` : null;

    // Skip if we've already checked this exact game
    if (gameId && lastCheckedGameId.current === gameId) return;
    if (hasEndedInactiveGame.current && gameId) return;

    const checkInactivity = () => {
      if (card && stats.lastGameStartTime && !hasEndedInactiveGame.current) {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityTime;
        const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds

        // If it's been more than 30 minutes since last activity, end the game
        if (timeSinceLastActivity > THIRTY_MINUTES) {
          hasEndedInactiveGame.current = true; // Prevent multiple calls
          if (gameId) {
            lastCheckedGameId.current = gameId; // Mark this game as checked
          }
          recordGameEnd(false);
          resetGame();
          setShowWelcomeScreen(true);
          showWarning('Your game was inactive for more than 30 minutes and has been ended.');
        } else if (gameId) {
          // Mark this game as checked (it's still active)
          lastCheckedGameId.current = gameId;
        }
      }
    };

    checkInactivity();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !hasEndedInactiveGame.current) {
        checkInactivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [card, cardId, stats.lastGameStartTime, lastActivityTime, recordGameEnd, resetGame, showWarning]);

  // Reset the flag when a new game starts (not from inactivity)
  useEffect(() => {
    if (card && stats.lastGameStartTime) {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;
      const THIRTY_MINUTES = 30 * 60 * 1000;
      // If we have recent activity, this is a legitimate new game - reset flags
      if (timeSinceLastActivity < THIRTY_MINUTES) {
        hasEndedInactiveGame.current = false;
        lastCheckedGameId.current = null;
      }
    } else if (!card) {
      // No card means no game, reset the flags
      hasEndedInactiveGame.current = false;
      lastCheckedGameId.current = null;
    }
  }, [card, stats.lastGameStartTime, lastActivityTime]);

  useEffect(() => {
    if (!card) {
      setShowWelcomeScreen(true);
    } else if (stats.lastGameStartTime === null) {
      recordGameStart();
    }
  }, [card, initializeCard, recordGameStart, stats.lastGameStartTime]);

  // Show win modal when bingo is achieved (detect changes to win state)
  useEffect(() => {
    const prevState = prevWinStateRef.current;
    const currentState = {
      hasBingo: winState.hasBingo,
      isBlackout: winState.isBlackout,
      winType: winState.winType
    };

    const isNewWin = winState.hasBingo && (
      !prevState.hasBingo ||
      (prevState.hasBingo && !prevState.isBlackout && currentState.isBlackout)
    );

    if (isNewWin) {
      setShowWinModal(true);

      const winTime = getCurrentGameTime();
      setCurrentWinTime(winTime);

      recordBingo(winState.winType, winState.isBlackout);

      if (winState.isBlackout) {
        playSound('blackout');
      } else {
        playSound('bingo');
      }
    }

    prevWinStateRef.current = currentState;
  }, [winState.hasBingo, winState.isBlackout, winState.winType, recordBingo, playSound, getCurrentGameTime]);

  // Apply high contrast class to body/html if needed
  useEffect(() => {
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    return () => {
      document.documentElement.classList.remove('high-contrast');
    };
  }, [settings.highContrast]);

  // Apply reduced motion class
  useEffect(() => {
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    return () => {
      document.documentElement.classList.remove('reduced-motion');
    };
  }, [settings.reducedMotion]);

  // Apply font size class
  useEffect(() => {
    const fontSizeClass = `font-size-${settings.fontSize || 'normal'}`;
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    document.body.classList.add(fontSizeClass);
  }, [settings.fontSize]);

  const handleReset = () => {
    try {
      // If giving up mid-game (game active but not won), show game over modal
      const isGivingUp = stats.lastGameStartTime && !winState.hasBingo;

      if (isGivingUp) {
        const currentGameTime = getCurrentGameTime();
        const currentMarkedCount = markedCount;

        recordGameEnd(false);

        // Set stats for modal display
        setGameOverTime(currentGameTime);
        setGameOverMarkedCount(currentMarkedCount);

        // Show game over modal 
        setShowGameOverModal(true);
      } else {
        // Normal reset - record and show welcome screen
        recordGameEnd(winState.hasBingo);
        resetGame();
        setShowWinModal(false);
        setShowGameOverModal(false);
        setShowWelcomeScreen(true);
        setCurrentWinTime(null);
        setGameOverTime(null);
        setGameOverMarkedCount(0);
        setStatsOpenedFromGameOver(false);
      }
    } catch (error) {
      console.error('Failed to reset game:', error);
      showError('Failed to reset game. Please try again.');
    }
  };

  const handleStartNewGame = () => {
    try {
      initializeCard();
      setShowWelcomeScreen(false);
      // Always start timer automatically when starting a new game
      recordGameStart();
      showSuccess('New game started!');
    } catch (error) {
      console.error('Failed to start new game:', error);
      showError('Failed to start new game. Please try again.');
    }
  };

  // Export stats as JSON
  const handleExportStats = () => {
    try {
      const statsData = {
        stats,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      const dataStr = JSON.stringify(statsData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `baseball-bingo-stats-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess('Statistics exported successfully!');
    } catch (error) {
      console.error('Failed to export stats:', error);
      showError('Failed to export statistics. Please try again.');
    }
  };

  // Clear all stats
  const handleClearStats = () => {
    try {
      resetStats();
      showSuccess('Statistics cleared successfully!');
    } catch (error) {
      console.error('Failed to clear stats:', error);
      showError('Failed to clear statistics. Please try again.');
    }
  };

  const handleNewGameFromGameOver = () => {
    try {
      setShowGameOverModal(false);
      setGameOverTime(null);
      setGameOverMarkedCount(0);
      setCurrentWinTime(null);
      setStatsOpenedFromGameOver(false);
      // reset the game and start a new one
      resetGame();
      handleStartNewGame();
    } catch (error) {
      console.error('Failed to start new game:', error);
      showError('Failed to start new game. Please try again.');
    }
  };

  const handleCloseGameOver = () => {
    setShowGameOverModal(false);
    setGameOverTime(null);
    setGameOverMarkedCount(0);
    setStatsOpenedFromGameOver(false);
    // Reset the game and show welcome screen when closing game over modal
    resetGame();
    setShowWelcomeScreen(true);
  };

  const handleNewGameFromModal = () => {
    try {
      recordGameEnd(winState.hasBingo);
      resetGame();
      setShowWinModal(false);
      setCurrentWinTime(null);
      showSuccess('New game started!');
    } catch (error) {
      console.error('Failed to start new game:', error);
      showError('Failed to start new game. Please try again.');
    }
  };

  // Share card as image
  const handleShareCard = async () => {
    if (!cardRef.current) return;

    try {
      const cardElement = cardRef.current;
      const animatedElements = cardElement.querySelectorAll('.animate-bounce-slow');
      animatedElements.forEach(el => el.classList.remove('animate-bounce-slow'));

      const blob = await captureElementAsImage(cardElement, {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff'
      });

      animatedElements.forEach(el => el.classList.add('animate-bounce-slow'));

      const shareText = getShareText(winState);
      const filename = `baseball-bingo-card-${Date.now()}.png`;

      const shared = await shareImage(blob, filename, shareText);
      if (!shared) {
        // If Web Share API not available, image was downloaded
        showSuccess('Card image downloaded!');
      } else {
        showSuccess('Card shared successfully!');
      }
    } catch (error) {
      console.error('Failed to share card:', error);
      const errorMessage = error.message || 'Failed to share card. Please try again.';
      showError(errorMessage);
    }
  };

  // Share win screenshot (card + win message overlay)
  const handleShareWin = async () => {
    if (!cardRef.current) return;

    try {
      const container = document.createElement('div');
      container.className = 'share-container';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = cardRef.current.offsetWidth + 'px';
      container.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
      container.style.padding = '40px 20px';
      container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      container.style.borderRadius = '16px';

      document.body.appendChild(container);

      const cardClone = cardRef.current.cloneNode(true);

      const animatedElements = cardClone.querySelectorAll('.animate-bounce-slow');
      animatedElements.forEach(el => el.classList.remove('animate-bounce-slow'));

      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '30px';

      const emoji = document.createElement('div');
      emoji.style.fontSize = '64px';
      emoji.style.marginBottom = '10px';
      emoji.textContent = winState.isBlackout ? '🎆' : '🏆';

      const title = document.createElement('div');
      title.style.fontSize = '48px';
      title.style.fontWeight = 'bold';
      title.style.color = theme === 'dark' ? '#ef4444' : '#BA0C2F';
      title.style.marginBottom = '10px';
      title.textContent = winState.isBlackout ? 'BLACKOUT!' : 'BINGO!';

      const subtitle = document.createElement('div');
      subtitle.style.fontSize = '24px';
      subtitle.style.color = theme === 'dark' ? '#60a5fa' : '#002D72';
      subtitle.style.fontWeight = '600';
      subtitle.textContent = winState.isBlackout
        ? 'Complete Mastery!'
        : (winState.winType ? `You got a ${winState.winType}!` : '');

      header.appendChild(emoji);
      header.appendChild(title);
      if (winState.winType || winState.isBlackout) {
        header.appendChild(subtitle);
      }

      container.appendChild(header);
      container.appendChild(cardClone);

      await new Promise(resolve => setTimeout(resolve, 200));

      const blob = await captureElementAsImage(container, {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        scale: 2
      });

      document.body.removeChild(container);

      const shareText = getShareText(winState);
      const filename = `baseball-bingo-${winState.isBlackout ? 'blackout' : 'bingo'}-${Date.now()}.png`;

      const shared = await shareImage(blob, filename, shareText);
      if (!shared) {
        // If Web Share API not available, image was downloaded
        showSuccess('Win image downloaded!');
      } else {
        showSuccess('Win shared successfully!');
      }
    } catch (error) {
      console.error('Failed to share win:', error);
      const errorMessage = error.message || 'Failed to share win. Please try again.';
      showError(errorMessage);
    }
  };

  // Show welcome screen if no card or if explicitly shown
  if (!card || showWelcomeScreen) {
    return (
      <>
        <WelcomeScreen
          onStartGame={handleStartNewGame}
          stats={stats}
          onShowStats={() => {
            setShowStatsModal(true);
          }}
        />
        {/* Stats Modal can be shown from welcome screen */}
        <StatsModal
          show={showStatsModal}
          onClose={() => {
            setShowStatsModal(false);
            // Don't go back to welcome screen if there's a card
            if (!card) {
              setShowWelcomeScreen(true);
            }
          }}
          stats={stats}
          getMostCommonWinType={getMostCommonWinType}
          getAverageWinTime={getAverageWinTime}
          getAverageBlackoutTime={getAverageBlackoutTime}
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-grass-green to-blue-100 dark:from-green-900 dark:to-blue-900 transition-colors ${settings.reducedMotion ? '' : 'duration-300'}`}>
      <Header
        markedCount={markedCount}
        onReset={handleReset}
        onToggleSound={handleSoundToggle}
        soundEnabled={settings.soundEnabled}
        volume={settings.soundVolume}
        onVolumeChange={handleVolumeChange}
        onToggleTheme={handleThemeToggle}
        isDark={theme === 'dark'}
        onShowStats={() => setShowStatsModal(true)}
        onShowShare={() => setShowShareModal(true)}
        onShowSettings={() => setShowSettingsModal(true)}
        gameStartTime={stats.lastGameStartTime}
        isPaused={winState.hasBingo}
      />

      <main className="container mx-auto py-4 sm:py-8 px-2 sm:px-4 w-full max-w-full overflow-x-hidden">
        {/* Instructions */}
        <div className="max-w-2xl mx-auto mb-6 bg-white dark:bg-slate-800/90 dark:border dark:border-blue-800/30 rounded-lg shadow-md dark:shadow-blue-950/50 p-4 transition-colors duration-300">
          <h3 className="font-bold text-lg mb-2 text-baseball-blue dark:text-blue-300">
            📋 How to Play:
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
            <li>✅ Tap a square when you see that event happen!</li>
            <li>🎯 Get 5 in a row (horizontal, vertical, or diagonal) or Blackout to win!</li>
            <li>🆓 The center square is FREE!</li>
            <li>🔄 Tap "New Card" to start fresh anytime</li>
          </ul>
        </div>

        {/* Bingo Card */}
        <div ref={cardRef}>
          <BingoCard
            card={card}
            onSquareToggle={(row, col) => {
              toggleSquare(row, col);
              // Play mark sound when a square is toggled
              if (card && !card[row][col].isFree) {
                playSound('mark');
              }
            }}
            winningCells={settings.showWinAnimations ? winState.winningCells : []}
            settings={settings}
          />
        </div>

        {/* Progress indicator */}
        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-white dark:bg-slate-800/90 dark:border dark:border-blue-800/30 rounded-lg shadow-md dark:shadow-blue-950/50 p-4 transition-colors duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Progress
              </span>
              <span className="text-sm font-semibold text-baseball-blue dark:text-blue-300">
                {markedCount}/25 marked
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700/50 rounded-full h-3">
              <div
                className="bg-baseball-red h-3 rounded-full transition-all duration-500"
                style={{ width: `${(markedCount / 25) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Win Modal */}
      <WinModal
        show={showWinModal}
        winType={winState.winType}
        isBlackout={winState.isBlackout}
        onClose={() => setShowWinModal(false)}
        onNewGame={handleNewGameFromModal}
        onShare={() => {
          setShowWinModal(false);
          setShowShareModal(true);
        }}
        winTime={currentWinTime}
        gameStartTime={stats.lastGameStartTime}
        settings={settings}
      />

      {/* Game Over Modal */}
      <GameOverModal
        show={showGameOverModal}
        onClose={handleCloseGameOver}
        onNewGame={handleNewGameFromGameOver}
        markedCount={gameOverMarkedCount}
        gameTime={gameOverTime}
        onShowStats={() => {
          setShowGameOverModal(false);
          setStatsOpenedFromGameOver(true);
          setShowStatsModal(true);
        }}
      />

      {/* Stats Modal */}
      <StatsModal
        show={showStatsModal}
        onClose={() => {
          setShowStatsModal(false);
          // If stats was opened from game over modal, show it again
          if (statsOpenedFromGameOver) {
            setShowGameOverModal(true);
            setStatsOpenedFromGameOver(false);
          }
        }}
        stats={stats}
        getMostCommonWinType={getMostCommonWinType}
        getAverageWinTime={getAverageWinTime}
        getAverageBlackoutTime={getAverageBlackoutTime}
      />

      {/* Share Modal */}
      <ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        card={card}
        winState={winState}
        onShareCard={handleShareCard}
        onShareWin={handleShareWin}
      />

      {/* Confetti */}
      <ConfettiEffect show={winState.hasBingo && settings.showConfetti} />

      {/* Settings Modal */}
      <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSetting={(key, value) => {
          updateSetting(key, value);
          if (key === 'theme') {
            handleThemeChangeFromSettings(value);
          }
        }}
        onResetSettings={() => {
          resetSettings();
          // Reset theme to default
          if (settings.theme !== 'light') {
            if (theme === 'dark') {
              toggleTheme();
            }
          }
          showSuccess('Settings reset to defaults!');
        }}
        onExportSettings={() => {
          if (exportSettings()) {
            showSuccess('Settings exported successfully!');
          } else {
            showError('Failed to export settings.');
          }
        }}
        onImportSettings={async (file) => {
          const success = await importSettings(file);
          if (success) {
            // Theme sync will happen automatically via useEffect when settings update
            showSuccess('Settings imported successfully!');
          } else {
            showError('Failed to import settings. Please check the file format.');
          }
          return success;
        }}
        onExportStats={handleExportStats}
        onClearStats={handleClearStats}
        hasStats={stats.totalGames > 0}
      />

      {/* Toast Notifications */}
      {settings.showToasts && (
        <ToastContainer
          toasts={toasts}
          onRemove={removeToast}
          defaultDuration={settings.toastDuration}
        />
      )}
    </div>
  );
}

export default App;