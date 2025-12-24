import React, { useEffect, useState } from 'react';

const WinModal = ({ show, winType, onClose, onNewGame, isBlackout = false, onShare, winTime, gameStartTime, settings = {} }) => {
    const showEmojis = settings.showEmojis !== false; // Default to true
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [show]);

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-80">
            <div className="bg-white dark:bg-slate-800/95 dark:border dark:border-blue-800/40 rounded-2xl shadow-2xl dark:shadow-blue-950/50 max-w-md w-full p-8 transform transition-all duration-300">
                {/* Trophy Icon */}
                {showEmojis && (
                    <div className="text-center mb-6">
                        <span className="text-8xl">{isBlackout ? '🎆' : '🏆'}</span>
                    </div>
                )}

                {/* Title */}
                <h2 className="text-4xl font-bold text-center text-baseball-red dark:text-red-300 mb-4">
                    {isBlackout ? 'BLACKOUT!' : 'BINGO!'}
                </h2>

                {/* Win Type */}
                {isBlackout ? (
                    <p className="text-xl text-center text-gray-700 dark:text-gray-200 mb-4">
                        <span className="font-bold text-baseball-blue dark:text-blue-300">Complete Mastery!</span>
                    </p>
                ) : (
                    <p className="text-xl text-center text-gray-700 dark:text-gray-200 mb-4">
                        You got a <span className="font-bold text-baseball-blue dark:text-blue-300">{winType}</span>!
                    </p>
                )}

                {/* Win Time */}
                {winTime !== null && winTime !== undefined && (
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            {isBlackout ? 'Blackout completed in' : 'Bingo achieved in'}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 px-4 py-2 rounded-full">
                            <span className="text-2xl">⏱️</span>
                            <span className="font-mono font-bold text-lg text-baseball-red dark:text-red-300">
                                {formatTime(winTime)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Message */}
                <p className="text-center text-gray-600 dark:text-gray-200 mb-8">
                    {isBlackout
                        ? "Incredible! You've marked every single square on the card! This is the ultimate achievement!"
                        : "Congratulations! You've got a Bingo! Reset or start a new game."}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 dark:bg-slate-700/80 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            {isBlackout ? 'Admire Card' : 'Keep Playing'}
                        </button>
                        <button
                            onClick={onNewGame}
                            className="flex-1 bg-baseball-red dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            New Game
                        </button>
                    </div>
                    {onShare && (
                        <button
                            onClick={onShare}
                            className="w-full bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {showEmojis && <span>🔗</span>} Share Your Win!
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WinModal;