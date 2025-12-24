import React from 'react';
import BingoSquare from './BingoSquare';

const BingoCard = ({ card, onSquareToggle, winningCells = [], settings = {} }) => {
    const isWinningCell = (row, col) => {
        return winningCells.some(cell => cell.row === row && cell.col === col);
    };

    const animationSyncKey = winningCells.length > 0
        ? winningCells.map(c => `${c.row}-${c.col}`).sort().join(',')
        : '';

    return (
        <div className="w-full max-w-2xl mx-auto p-2 sm:p-4">
            {/* Card Header */}
            <div className={`bg-baseball-red dark:bg-gradient-to-r dark:from-red-800 dark:to-red-900 text-white text-center py-3 rounded-t-lg mb-2 ${settings.reducedMotion ? '' : 'transition-colors duration-300'}`}>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-wider">
                    {settings.showEmojis !== false ? '⚾' : ''} BASEBALL BINGO {settings.showEmojis !== false ? '⚾' : ''}
                </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2 p-2 bg-gray-100 dark:bg-slate-800/80 dark:border dark:border-blue-800/30 rounded-b-lg shadow-xl dark:shadow-blue-950/50 transition-colors duration-300">
                {card.map((row, rowIndex) => (
                    row.map((cell, colIndex) => {
                        const isWinning = isWinningCell(rowIndex, colIndex);
                        const key = isWinning && animationSyncKey
                            ? `${rowIndex}-${colIndex}-${animationSyncKey}`
                            : `${rowIndex}-${colIndex}`;
                        return (
                            <BingoSquare
                                key={key}
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