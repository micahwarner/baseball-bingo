import React, { useState, useEffect } from 'react';
import WinRateChart from './charts/WinRateChart';
import TimeDistributionChart from './charts/TimeDistributionChart';
import WinTypeFrequencyChart from './charts/WinTypeFrequencyChart';

const StatsModal = ({ show, onClose, stats, getMostCommonWinType, getAverageWinTime, getAverageBlackoutTime }) => {
    const [showCharts, setShowCharts] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        
        checkDarkMode();
        
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        return () => observer.disconnect();
    }, []);

    if (!show) return null;

    const mostCommon = getMostCommonWinType();
    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-80">
            <div className={`bg-white dark:bg-slate-800/95 dark:border dark:border-blue-800/40 rounded-2xl shadow-2xl dark:shadow-blue-950/50 w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
                showCharts ? 'max-w-5xl' : 'max-w-2xl'
            }`}>
                {/* Header */}
                <div className="sticky top-0 bg-baseball-blue dark:bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
                    <h2 className="text-3xl font-bold">📊 Game Statistics</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowCharts(!showCharts)}
                            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-sm font-semibold flex items-center gap-2"
                            aria-label={showCharts ? 'Hide charts' : 'Show charts'}
                        >
                            {showCharts ? '📊 Hide Charts' : '📈 Show Charts'}
                        </button>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-300 text-2xl font-bold transition-colors"
                            aria-label="Close statistics"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Overall Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Games Played</div>
                            <div className="text-3xl font-bold text-baseball-blue dark:text-blue-300">
                                {stats.totalGames}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Bingos</div>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {stats.totalBingos}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Blackouts</div>
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {stats.totalBlackouts}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Win Rate</div>
                            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                {stats.totalGames > 0
                                    ? Math.round((stats.gamesWithWins / stats.totalGames) * 100)
                                    : 0}%
                            </div>
                        </div>
                    </div>

                    {/* Streaks */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</div>
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                {stats.currentWinStreak} 🔥
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Longest Streak</div>
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                {stats.longestWinStreak} 🏆
                            </div>
                        </div>
                    </div>

                    {/* Timing Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Fastest Bingo */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fastest Bingo</div>
                            <div className="text-2xl font-bold text-baseball-red dark:text-red-400">
                                {formatTime(stats.fastestBingoTime)} ⚡
                            </div>
                        </div>

                        {/* Average Bingo Time */}
                        {getAverageWinTime && getAverageWinTime() !== null && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Bingo Time</div>
                                <div className="text-2xl font-bold text-baseball-blue dark:text-blue-400">
                                    {formatTime(getAverageWinTime())} 📊
                                </div>
                            </div>
                        )}

                        {/* Fastest Blackout */}
                        {stats.fastestBlackoutTime !== null && stats.fastestBlackoutTime !== undefined && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fastest Blackout</div>
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {formatTime(stats.fastestBlackoutTime)} 🎆
                                </div>
                            </div>
                        )}

                        {/* Average Blackout Time */}
                        {getAverageBlackoutTime && getAverageBlackoutTime() !== null && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Blackout Time</div>
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {formatTime(getAverageBlackoutTime())} 📊
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Win Times */}
                    {(stats.winTimes && stats.winTimes.length > 0) && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Recent Bingo Times ({stats.winTimes.length} total)
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {stats.winTimes.slice(-10).reverse().map((time, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-mono font-semibold text-baseball-blue dark:text-blue-400"
                                    >
                                        {formatTime(time)}
                                    </span>
                                ))}
                                {stats.winTimes.length > 10 && (
                                    <span className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400">
                                        +{stats.winTimes.length - 10} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recent Blackout Times */}
                    {(stats.blackoutTimes && stats.blackoutTimes.length > 0) && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Recent Blackout Times ({stats.blackoutTimes.length} total)
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {stats.blackoutTimes.slice(-10).reverse().map((time, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-mono font-semibold text-purple-600 dark:text-purple-400"
                                    >
                                        {formatTime(time)}
                                    </span>
                                ))}
                                {stats.blackoutTimes.length > 10 && (
                                    <span className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400">
                                        +{stats.blackoutTimes.length - 10} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Most Common Win Type */}
                    {mostCommon && (
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Most Common Win</div>
                            <div className="text-xl font-bold text-baseball-blue dark:text-blue-400">
                                {mostCommon.winType}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Won {mostCommon.count} time{mostCommon.count !== 1 ? 's' : ''}
                            </div>
                        </div>
                    )}

                    {/* Win Type Breakdown */}
                    {Object.keys(stats.winTypeCounts || {}).length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Win Type Breakdown
                            </div>
                            <div className="space-y-2">
                                {Object.entries(stats.winTypeCounts)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([winType, count]) => (
                                        <div
                                            key={winType}
                                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded"
                                        >
                                            <span className="text-gray-700 dark:text-gray-300">{winType}</span>
                                            <span className="font-bold text-baseball-blue dark:text-blue-400">
                                                {count}x
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Advanced Charts Section */}
                    {showCharts && (
                        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                📈 Advanced Statistics
                            </div>

                            {/* Win Rate Over Time Chart */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                    Win Rate Over Time
                                </h3>
                                <WinRateChart gameHistory={stats.gameHistory || []} isDark={isDark} />
                            </div>

                            {/* Time Distribution Chart */}
                            {(stats.winTimes?.length > 0 || stats.blackoutTimes?.length > 0) && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Win Time Distribution
                                    </h3>
                                    <TimeDistributionChart
                                        winTimes={stats.winTimes || []}
                                        blackoutTimes={stats.blackoutTimes || []}
                                        isDark={isDark}
                                    />
                                </div>
                            )}

                            {/* Win Type Frequency Chart */}
                            {Object.keys(stats.winTypeCounts || {}).length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Win Type Frequency
                                    </h3>
                                    <WinTypeFrequencyChart
                                        winTypeCounts={stats.winTypeCounts || {}}
                                        isDark={isDark}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900/90 p-4 rounded-b-2xl border-t border-gray-200 dark:border-blue-800/30">
                    <button
                        onClick={onClose}
                        className="w-full bg-baseball-red dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsModal;
