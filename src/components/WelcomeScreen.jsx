import React from 'react';

const WelcomeScreen = ({ onStartGame, stats, onShowStats }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-grass-green to-blue-100 dark:from-green-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-800/95 dark:border dark:border-blue-800/40 rounded-2xl shadow-2xl p-8 md:p-12 transform transition-all duration-300">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/icons/baseballbingologo.png"
                            alt="Baseball Bingo"
                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain max-w-[144px]"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-baseball-blue dark:text-blue-300 mb-2">
                        Baseball Bingo
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-200">
                        Fun bingo game for baseball fans at the stadium!
                    </p>
                </div>

                {/* Quick Stats (if available) */}
                {stats && stats.totalGames > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-baseball-blue dark:text-blue-300">
                                {stats.totalGames}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Games</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.totalBingos}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Bingos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {stats.totalBlackouts}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Blackouts</div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="mb-8 space-y-3">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                        📋 How to Play:
                    </h2>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✅</span>
                            <span>Tap a square when you see that event happen during the game!</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-baseball-blue">🎯</span>
                            <span>Get 5 in a row (horizontal, vertical, or diagonal) or Blackout to win!</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-baseball-red">🆓</span>
                            <span>The center square is FREE!</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500">🏳️</span>
                            <span>You can give up anytime if you want to start fresh</span>
                        </li>
                    </ul>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onStartGame}
                        className="flex-1 bg-baseball-red dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-lg"
                    >
                        🎮 Start New Game
                    </button>
                    {stats && stats.totalGames > 0 && (
                        <button
                            onClick={onShowStats}
                            className="flex-1 bg-baseball-blue dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📊</span>
                            <span>View Statistics</span>
                        </button>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-8">
                    Mark events as they happen and try to get a Bingo!
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;

