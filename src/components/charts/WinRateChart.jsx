import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

/**
 * Chart showing win rate over time
 */
const WinRateChart = ({ gameHistory, isDark = false }) => {
    const chartData = useMemo(() => {
        if (!gameHistory || gameHistory.length === 0) {
            return [];
        }

        // Group games by date (day)
        const gamesByDate = {};
        gameHistory.forEach(game => {
            const date = new Date(game.date);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

            if (!gamesByDate[dateKey]) {
                gamesByDate[dateKey] = { wins: 0, total: 0 };
            }

            gamesByDate[dateKey].total++;
            if (game.won) {
                gamesByDate[dateKey].wins++;
            }
        });

        // Convert to array and calculate win rates
        return Object.entries(gamesByDate)
            .map(([dateKey, stats]) => {
                const date = new Date(dateKey);
                return {
                    dateKey,
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    dateValue: date.getTime(),
                    winRate: Math.round((stats.wins / stats.total) * 100),
                    games: stats.total,
                    wins: stats.wins
                };
            })
            .sort((a, b) => a.dateValue - b.dateValue)
            .slice(-30) // Show last 30 days
            .map(({ dateKey, dateValue, ...rest }) => rest); // Remove helper fields
    }, [gameHistory]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p>No game history available yet. Play some games to see your win rate over time!</p>
            </div>
        );
    }

    const textColor = isDark ? '#d1d5db' : '#374151'; // gray-300 : gray-700
    const gridColor = isDark ? '#374151' : '#e5e7eb'; // gray-700 : gray-200
    const labelColor = isDark ? '#f3f4f6' : '#111827'; // gray-100 : gray-900

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={gridColor}
                    opacity={0.3}
                />
                <XAxis
                    dataKey="date"
                    tick={{ fill: textColor, fontSize: 12 }}
                    stroke={gridColor}
                />
                <YAxis
                    label={{ 
                        value: 'Win Rate (%)', 
                        angle: -90, 
                        position: 'insideLeft',
                        fill: textColor,
                        style: { fontSize: 12 }
                    }}
                    domain={[0, 100]}
                    tick={{ fill: textColor, fontSize: 12 }}
                    stroke={gridColor}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: `1px solid ${gridColor}`,
                        borderRadius: '8px',
                        color: labelColor,
                        boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => {
                        if (name === 'winRate') return [`${value}%`, 'Win Rate'];
                        if (name === 'games') return [value, 'Games Played'];
                        if (name === 'wins') return [value, 'Wins'];
                        return value;
                    }}
                    labelStyle={{ color: labelColor, fontWeight: 600 }}
                />
                <Legend 
                    wrapperStyle={{ color: textColor, fontSize: '14px' }}
                    iconType="line"
                />
                <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke="#BA0C2F"
                    strokeWidth={2}
                    name="Win Rate"
                    dot={{ fill: '#BA0C2F', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#BA0C2F', stroke: isDark ? '#1f2937' : '#ffffff', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default WinRateChart;

