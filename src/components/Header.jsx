import React, { useState, useRef, useEffect } from 'react';
import Stopwatch from './Stopwatch';

const Header = ({ markedCount, onReset, onToggleSound, soundEnabled, volume, onVolumeChange, onToggleTheme, isDark, onShowStats, onShowShare, onShowSettings, gameStartTime, isPaused }) => {
    const [showVolumeMenu, setShowVolumeMenu] = useState(false);
    const volumeMenuRef = useRef(null);

    // Close volume menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (volumeMenuRef.current && !volumeMenuRef.current.contains(event.target)) {
                setShowVolumeMenu(false);
            }
        };

        if (showVolumeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showVolumeMenu]);

    return (
        <header className="bg-baseball-blue dark:bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 text-white p-2 sm:p-4 shadow-lg dark:shadow-blue-950 transition-colors duration-300 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0 flex-1">
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                        <img
                            src="/icons/baseballbingologo.png"
                            alt="Baseball Bingo"
                            className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 object-contain flex-shrink-0"
                        />
                        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold truncate">Baseball Bingo</h1>
                    </div>
                    <span className="bg-baseball-red dark:bg-red-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0">
                        {markedCount}/25
                    </span>
                    {gameStartTime && (
                        <div className="flex-shrink-0">
                            <Stopwatch
                                isRunning={true}
                                startTime={gameStartTime}
                                isPaused={isPaused}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-1 sm:gap-2 flex-wrap sm:flex-nowrap items-center justify-end w-full sm:w-auto">
                    {/* Share Button */}
                    <button
                        onClick={onShowShare}
                        className="p-1.5 sm:p-2 bg-white bg-opacity-20 hover:bg-opacity-30 dark:bg-opacity-30 dark:hover:bg-opacity-40 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Share card"
                        title="Share card"
                    >
                        <span className="text-lg sm:text-xl">
                            🔗
                        </span>
                    </button>

                    {/* Stats Button */}
                    <button
                        onClick={onShowStats}
                        className="p-1.5 sm:p-2 bg-white bg-opacity-20 hover:bg-opacity-30 dark:bg-opacity-30 dark:hover:bg-opacity-40 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Show statistics"
                        title="View statistics"
                    >
                        <span className="text-lg sm:text-xl">
                            📊
                        </span>
                    </button>

                    {/* Settings Button */}
                    <button
                        onClick={onShowSettings}
                        className="p-1.5 sm:p-2 bg-white bg-opacity-20 hover:bg-opacity-30 dark:bg-opacity-30 dark:hover:bg-opacity-40 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Open settings"
                        title="Settings"
                    >
                        <span className="text-lg sm:text-xl">
                            ⚙️
                        </span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={onToggleTheme}
                        className="p-1.5 sm:p-2 bg-white bg-opacity-20 hover:bg-opacity-30 dark:bg-opacity-30 dark:hover:bg-opacity-40 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Toggle theme"
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        <span className="text-lg sm:text-xl">
                            {isDark ? '☀️' : '🌙'}
                        </span>
                    </button>

                    {/* Sound Controls */}
                    <div className="relative flex-shrink-0" ref={volumeMenuRef}>
                        <button
                            onClick={onToggleSound}
                            onMouseEnter={() => soundEnabled && setShowVolumeMenu(true)}
                            className="p-1.5 sm:p-2 bg-white bg-opacity-20 hover:bg-opacity-30 dark:bg-opacity-30 dark:hover:bg-opacity-40 rounded-lg transition-colors"
                            aria-label="Toggle sound"
                            title="Sound settings"
                        >
                            <span className="text-lg sm:text-xl">
                                {soundEnabled ? '🔊' : '🔇'}
                            </span>
                        </button>

                        {/* Volume Control Dropdown */}
                        {showVolumeMenu && soundEnabled && (
                            <div
                                className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-[200px] z-50 border border-gray-200 dark:border-gray-700"
                                onMouseLeave={() => setShowVolumeMenu(false)}
                            >
                                <div className="mb-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Volume: {Math.round(volume * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-baseball-red"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Give Up / New Card Button - changes based on game state */}
                    {gameStartTime && !isPaused ? (
                        // Active game: Show Give Up button
                        <button
                            onClick={onReset}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0"
                            title="Give up current game (end as loss)"
                        >
                            <span className="text-sm sm:text-base">🏳️</span>
                            <span>Give Up</span>
                        </button>
                    ) : (
                        // Game won or no active game: Show New Card button
                        <button
                            onClick={onReset}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-baseball-red dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap flex-shrink-0"
                            title="Start a new game"
                        >
                            New Card
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;