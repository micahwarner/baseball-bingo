import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

/**
 * Format time range for display
 */
const formatTimeRange = (startTime, bucketSize) => {
    const startMins = Math.floor(startTime / 60);
    const startSecs = startTime % 60;
    const endTime = startTime + bucketSize;
    const endMins = Math.floor(endTime / 60);
    const endSecs = endTime % 60;

    if (startMins === 0 && endMins === 0) {
        return `${startSecs}s-${endSecs}s`;
    }
    if (startMins === endMins) {
        return `${startMins}m${startSecs > 0 ? startSecs : ''}`;
    }
    return `${startMins}m-${endMins}m`;
};

/**
 * Chart showing distribution of win times
 */
const TimeDistributionChart = ({ winTimes, blackoutTimes, isDark }) => {
    const chartData = useMemo(() => {
        const allTimes = [...(winTimes || []), ...(blackoutTimes || [])];
        if (allTimes.length === 0) {
            return [];
        }

        // Create time buckets (bins)
        const maxTime = Math.max(...allTimes);
        const bucketSize = Math.max(30, Math.ceil(maxTime / 20)); // 20 buckets, minimum 30 seconds
        
        const buckets = {};
        
        allTimes.forEach(time => {
            const bucket = Math.floor(time / bucketSize) * bucketSize;
            if (!buckets[bucket]) {
                buckets[bucket] = 0;
            }
            buckets[bucket]++;
        });

        // Convert to array and format
        return Object.entries(buckets)
            .map(([time, count]) => ({
                timeRange: formatTimeRange(parseInt(time), bucketSize),
                count: count,
                time: parseInt(time)
            }))
            .sort((a, b) => a.time - b.time);
    }, [winTimes, blackoutTimes]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p>No win times available yet. Get some bingos to see the time distribution!</p>
            </div>
        );
    }

    const textColor = isDark ? '#d1d5db' : '#374151'; // gray-300 : gray-700
    const gridColor = isDark ? '#374151' : '#e5e7eb'; // gray-700 : gray-200
    const labelColor = isDark ? '#f3f4f6' : '#111827'; // gray-100 : gray-900
    const barColor = isDark ? '#3b82f6' : '#002D72'; // Lighter blue for dark mode, original for light

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={gridColor}
                    opacity={0.3}
                />
                <XAxis
                    dataKey="timeRange"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: textColor, fontSize: 12 }}
                    stroke={gridColor}
                />
                <YAxis
                    label={{ 
                        value: 'Number of Wins', 
                        angle: -90, 
                        position: 'insideLeft',
                        fill: textColor,
                        style: { fontSize: 12 }
                    }}
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
                    formatter={(value) => [value, 'Wins']}
                    labelStyle={{ color: labelColor, fontWeight: 600 }}
                />
                <Legend 
                    wrapperStyle={{ color: textColor, fontSize: '14px' }}
                />
                <Bar
                    dataKey="count"
                    fill={barColor}
                    name="Number of Wins"
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TimeDistributionChart;

