import React from 'react';

const GameOverModal = ({ 
    show, 
    onClose, 
    onNewGame, 
    markedCount, 
    gameTime,
    onShowStats
}) => {
    // Format time helper
    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined) return '00:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    if (!show) return null;

    const progressPercentage = Math.round((markedCount / 25) * 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-80">
            <div className="bg-white dark:bg-slate-800/95 dark:border dark:border-blue-800/40 rounded-2xl shadow-2xl dark:shadow-blue-950/50 max-w-md w-full p-8 transform transition-all duration-300">
                {/* Game Over Icon */}
                <div className="text-center mb-6">
                    <span className="text-8xl">🏳️</span>
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold text-center text-orange-500 dark:text-orange-400 mb-4">
                    Game Over
                </h2>

                {/* Message */}
                <p className="text-center text-gray-600 dark:text-gray-200 mb-6">
                    You gave up on this game. Better luck next time!
                </p>

                {/* Game Stats */}
                <div className="bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg p-4 mb-6 space-y-3">
                    {/* Progress */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Progress
                            </span>
                            <span className="text-sm font-semibold text-baseball-blue dark:text-blue-400">
                                {markedCount}/25 squares ({progressPercentage}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-600/50 rounded-full h-3">
                            <div
                                className="bg-baseball-red h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Time Played */}
                    {gameTime !== null && gameTime !== undefined && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-blue-800/30">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Time Played
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">⏱️</span>
                                <span className="font-mono font-bold text-baseball-blue dark:text-blue-400">
                                    {formatTime(gameTime)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onNewGame}
                        className="w-full bg-baseball-red dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Start New Game
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onShowStats}
                            className="flex-1 bg-baseball-blue dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📊</span>
                            <span>View Stats</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 dark:bg-slate-700/80 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;

