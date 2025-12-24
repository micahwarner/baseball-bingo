import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';

/**
 * Chart showing frequency of different win types
 */
const WinTypeFrequencyChart = ({ winTypeCounts, isDark }) => {
    const chartData = useMemo(() => {
        if (!winTypeCounts || Object.keys(winTypeCounts).length === 0) {
            return [];
        }

        return Object.entries(winTypeCounts)
            .map(([name, value]) => ({
                name: name.length > 15 ? `${name.substring(0, 15)}...` : name,
                fullName: name,
                value: value
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 win types
    }, [winTypeCounts]);

    // Theme-aware colors 
    const COLORS = isDark ? [
        '#3b82f6', // Lighter blue
        '#ef4444', // Lighter red
        '#10b981', // Lighter green
        '#f97316', // Orange
        '#06b6d4', // Cyan
        '#eab308', // Yellow
        '#34d399', // Emerald
        '#f472b6', // Pink
        '#2dd4bf', // Teal
        '#fb7185'  // Rose
    ] : [
        '#002D72', // Baseball blue
        '#BA0C2F', // Baseball red
        '#0A7C3A', // Grass green
        '#FF6B35', // Orange
        '#4ECDC4', // Teal
        '#FFE66D', // Yellow
        '#A8E6CF', // Light green
        '#FF8B94', // Pink
        '#95E1D3', // Mint
        '#F38181'  // Coral
    ];

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p>No win types recorded yet. Get some bingos to see win type frequency!</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, isDark }) => {
        if (active && payload && payload.length) {
            const gridColor = isDark ? '#374151' : '#e5e7eb';
            const labelColor = isDark ? '#f3f4f6' : '#111827';
            const textColor = isDark ? '#d1d5db' : '#374151';

            return (
                <div
                    style={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: `1px solid ${gridColor}`,
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <p style={{
                        fontWeight: 600,
                        color: labelColor,
                        marginBottom: '4px'
                    }}>
                        {payload[0].payload.fullName}
                    </p>
                    <p style={{
                        color: isDark ? '#60a5fa' : '#002D72',
                        fontSize: '14px'
                    }}>
                        Count: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    const textColor = isDark ? '#d1d5db' : '#374151'; // gray-300 : gray-700
    const labelColor = isDark ? '#f3f4f6' : '#111827'; // gray-100 : gray-900

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelStyle={{
                        fill: labelColor,
                        fontSize: 12,
                        fontWeight: 600
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke={isDark ? '#1f2937' : '#ffffff'}
                            strokeWidth={2}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend
                    wrapperStyle={{
                        paddingTop: '20px',
                        color: textColor,
                        fontSize: '14px'
                    }}
                    formatter={(value, entry) => {
                        const data = chartData.find(d => d.name === value);
                        return data ? `${data.fullName} (${data.value})` : value;
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default WinTypeFrequencyChart;

