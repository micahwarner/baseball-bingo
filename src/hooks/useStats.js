import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing game statistics
 * @param {boolean} trackStats - Whether to track statistics (from settings)
 * @returns {Object} Stats object and functions to update stats
 */
export const useStats = (trackStats = true) => {
    const [stats, setStats] = useLocalStorage('bingo_stats', {
        totalGames: 0,
        totalBingos: 0,
        totalBlackouts: 0,
        gamesWithWins: 0, // Games that ended with at least one bingo
        currentWinStreak: 0,
        longestWinStreak: 0,
        fastestBingoTime: null, // in seconds
        fastestBlackoutTime: null, // in seconds
        winTimes: [], // Array of all win times in seconds (excluding blackouts)
        blackoutTimes: [], // Array of all blackout times in seconds
        winTypeCounts: {}, // { "Row 1": 5, "Column 2": 3, etc }
        lastGameStartTime: null,
        currentGameHasWin: false, // Track if current game has had a bingo
        gameHistory: [] // Array of { date: timestamp, won: boolean } for win rate tracking
    });

    const recordGameStart = useCallback(() => {
        if (!trackStats) return;
        setStats(prev => ({
            ...prev,
            lastGameStartTime: Date.now(),
            currentGameHasWin: false
        }));
    }, [setStats, trackStats]);

    const recordBingo = useCallback((winType, isBlackout = false) => {
        if (!trackStats) return;
        setStats(prev => {
            const gameStartTime = prev.lastGameStartTime;
            const now = Date.now();
            const gameTime = gameStartTime ? Math.floor((now - gameStartTime) / 1000) : null; // in seconds

            // Track how many times each win type happened
            const newWinTypeCounts = { ...prev.winTypeCounts };
            if (isBlackout) {
                newWinTypeCounts['Blackout'] = (newWinTypeCounts['Blackout'] || 0) + 1;
            } else if (winType) {
                // Win type can be multiple types like "Row 1, Column 2"
                const winTypes = winType.split(',').map(w => w.trim());
                winTypes.forEach(wt => {
                    newWinTypeCounts[wt] = (newWinTypeCounts[wt] || 0) + 1;
                });
            }

            let fastestBingoTime = prev.fastestBingoTime;
            let fastestBlackoutTime = prev.fastestBlackoutTime;
            const newWinTimes = [...(prev.winTimes || [])];
            const newBlackoutTimes = [...(prev.blackoutTimes || [])];

            if (gameTime !== null && gameTime > 0) {
                if (isBlackout) {
                    newBlackoutTimes.push(gameTime);
                    if (fastestBlackoutTime === null || gameTime < fastestBlackoutTime) {
                        fastestBlackoutTime = gameTime;
                    }
                } else {
                    newWinTimes.push(gameTime);
                    if (fastestBingoTime === null || gameTime < fastestBingoTime) {
                        fastestBingoTime = gameTime;
                    }
                }
            }
            // Only count the first win for streaks (multiple bingos in one game = one win)
            const isFirstWinOfGame = !prev.currentGameHasWin;
            const newCurrentStreak = isFirstWinOfGame ? prev.currentWinStreak + 1 : prev.currentWinStreak;
            const newLongestStreak = Math.max(prev.longestWinStreak, newCurrentStreak);

            return {
                ...prev,
                totalBingos: prev.totalBingos + 1,
                totalBlackouts: isBlackout ? prev.totalBlackouts + 1 : prev.totalBlackouts,
                currentWinStreak: newCurrentStreak,
                longestWinStreak: newLongestStreak,
                fastestBingoTime,
                fastestBlackoutTime,
                winTimes: newWinTimes,
                blackoutTimes: newBlackoutTimes,
                winTypeCounts: newWinTypeCounts,
                currentGameHasWin: true
            };
        });
    }, [setStats]);

    const recordGameEnd = useCallback((hasWon = false) => {
        if (!trackStats) return;
        setStats(prev => {
            const gameHistory = [...(prev.gameHistory || [])];
            gameHistory.push({
                date: Date.now(),
                won: hasWon
            });

            // Keep only the last 100 games so localStorage doesn't get huge
            const trimmedHistory = gameHistory.slice(-100);

            return {
                ...prev,
                totalGames: prev.totalGames + 1,
                gamesWithWins: hasWon ? prev.gamesWithWins + 1 : prev.gamesWithWins,
                // Reset streak if they lost, otherwise keep it going
                currentWinStreak: hasWon ? prev.currentWinStreak : 0,
                lastGameStartTime: Date.now(),
                currentGameHasWin: false,
                gameHistory: trimmedHistory
            };
        });
    }, [setStats, trackStats]);

    const getMostCommonWinType = useCallback(() => {
        const winTypeCounts = stats.winTypeCounts || {};
        if (Object.keys(winTypeCounts).length === 0) return null;

        let maxCount = 0;
        let mostCommon = null;

        Object.entries(winTypeCounts).forEach(([winType, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = winType;
            }
        });

        return mostCommon ? { winType: mostCommon, count: maxCount } : null;
    }, [stats.winTypeCounts]);

    const getCurrentGameTime = useCallback(() => {
        if (!stats.lastGameStartTime) return 0;
        return Math.floor((Date.now() - stats.lastGameStartTime) / 1000);
    }, [stats.lastGameStartTime]);

    const getAverageWinTime = useCallback(() => {
        const winTimes = stats.winTimes || [];
        if (winTimes.length === 0) return null;
        const sum = winTimes.reduce((acc, time) => acc + time, 0);
        return Math.floor(sum / winTimes.length);
    }, [stats.winTimes]);

    const getAverageBlackoutTime = useCallback(() => {
        const blackoutTimes = stats.blackoutTimes || [];
        if (blackoutTimes.length === 0) return null;
        const sum = blackoutTimes.reduce((acc, time) => acc + time, 0);
        return Math.floor(sum / blackoutTimes.length);
    }, [stats.blackoutTimes]);

    const resetStats = useCallback(() => {
        setStats({
            totalGames: 0,
            totalBingos: 0,
            totalBlackouts: 0,
            gamesWithWins: 0,
            currentWinStreak: 0,
            longestWinStreak: 0,
            fastestBingoTime: null,
            fastestBlackoutTime: null,
            winTimes: [],
            blackoutTimes: [],
            winTypeCounts: {},
            lastGameStartTime: Date.now(),
            currentGameHasWin: false,
            gameHistory: []
        });
    }, [setStats]);

    return {
        stats,
        recordGameStart,
        recordBingo,
        recordGameEnd,
        getMostCommonWinType,
        getCurrentGameTime,
        getAverageWinTime,
        getAverageBlackoutTime,
        resetStats
    };
};
