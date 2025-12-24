import React, { useRef, useEffect, useState } from 'react';
import BingoSquare from './BingoSquare';

const BingoCard = ({ card, onSquareToggle, winningCells = [], settings = {} }) => {
    const isWinningCell = (row, col) => {
        return winningCells.some(cell => cell.row === row && cell.col === col);
    };

    const animationSyncKey = winningCells.length > 0
        ? winningCells.map(c => `${c.row}-${c.col}`).sort().join(',')
        : '';

    const squareRefs = useRef({});
    const gridRef = useRef(null);
    const [squareHeight, setSquareHeight] = useState(null);

    // Measure all squares and set uniform height
    useEffect(() => {
        const measureAndAdjust = () => {
            if (!gridRef.current) return;

            // Get all square measurements
            const heights = [];
            Object.values(squareRefs.current).forEach(ref => {
                if (ref && ref.current) {
                    const height = ref.current.measureHeight();
                    if (height) {
                        heights.push(height);
                    }
                }
            });

            if (heights.length === 0) return;

            // Find the maximum height needed
            const maxHeight = Math.max(...heights);

            // Get the grid width to maintain aspect ratio as much as possible
            const gridWidth = gridRef.current.clientWidth;
            const padding = parseFloat(getComputedStyle(gridRef.current).padding) * 2;
            const gap = parseFloat(getComputedStyle(gridRef.current).gap) || 8;
            const availableWidth = gridWidth - padding - (gap * 4); // 4 gaps for 5 columns
            const baseSquareWidth = availableWidth / 5;

            // Use the larger of: max content height or square width (to maintain reasonable aspect)
            // But allow vertical growth if content needs it
            const minHeight = baseSquareWidth; // Minimum square height (aspect-square)
            const finalHeight = Math.max(maxHeight, minHeight);

            setSquareHeight(finalHeight);
        };

        // Measure after a short delay to ensure layout is complete
        const timeout = setTimeout(measureAndAdjust, 100);

        // Also measure on resize
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(timeout);
            setTimeout(measureAndAdjust, 50);
        });

        if (gridRef.current) {
            resizeObserver.observe(gridRef.current);
        }

        return () => {
            clearTimeout(timeout);
            resizeObserver.disconnect();
        };
    }, [card, settings.fontSize, settings.showEmojis]);

    const setSquareRef = (row, col, ref) => {
        const key = `${row}-${col}`;
        if (ref) {
            squareRefs.current[key] = ref;
        } else {
            delete squareRefs.current[key];
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-2 sm:p-4">
            {/* Card Header */}
            <div className={`bg-baseball-red dark:bg-gradient-to-r dark:from-red-800 dark:to-red-900 text-white text-center py-3 rounded-t-lg mb-2 ${settings.reducedMotion ? '' : 'transition-colors duration-300'}`}>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-wider">
                    {settings.showEmojis !== false ? '⚾' : ''} BASEBALL BINGO {settings.showEmojis !== false ? '⚾' : ''}
                </h2>
            </div>

            <div
                ref={gridRef}
                className="bingo-card-grid grid grid-cols-5 gap-1 sm:gap-2 p-2 bg-gray-100 dark:bg-slate-800/80 dark:border dark:border-blue-800/30 rounded-b-lg shadow-xl dark:shadow-blue-950/50 transition-colors duration-300"
                style={squareHeight ? { gridAutoRows: `${squareHeight}px` } : {}}
            >
                {card.map((row, rowIndex) => (
                    row.map((cell, colIndex) => {
                        const isWinning = isWinningCell(rowIndex, colIndex);
                        const key = isWinning && animationSyncKey
                            ? `${rowIndex}-${colIndex}-${animationSyncKey}`
                            : `${rowIndex}-${colIndex}`;
                        return (
                            <BingoSquare
                                key={key}
                                ref={(ref) => setSquareRef(rowIndex, colIndex, { current: ref })}
                                cell={cell}
                                row={rowIndex}
                                col={colIndex}
                                onToggle={onSquareToggle}
                                isWinning={isWinning}
                                animationSyncKey={animationSyncKey}
                                settings={settings}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default BingoCard;