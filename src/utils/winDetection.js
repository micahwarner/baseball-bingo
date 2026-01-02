/**
 * Check if there's a bingo
 * Returns ALL bingos found, not just the first one
 * @param {Array<Array<Object>>} card - The bingo card grid
 * @returns {Object} { hasBingo: boolean, winType: string, winningCells: Array }
 */
export const checkForBingo = (card) => {
    const size = 5;
    const allWinningCells = [];
    const winTypes = [];

    // Check rows
    for (let row = 0; row < size; row++) {
        if (card[row].every(cell => cell.marked)) {
            const winningCells = card[row].map((_, col) => ({ row, col }));
            allWinningCells.push(...winningCells);
            winTypes.push(`Row ${row + 1}`);
        }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
        const column = card.map(row => row[col]);
        if (column.every(cell => cell.marked)) {
            const winningCells = card.map((_, row) => ({ row, col }));
            allWinningCells.push(...winningCells);
            winTypes.push(`Column ${col + 1}`);
        }
    }

    // Check top-left to bottom-right diagonal
    const diagonal1 = card.map((row, i) => row[i]);
    if (diagonal1.every(cell => cell.marked)) {
        const winningCells = card.map((_, i) => ({ row: i, col: i }));
        allWinningCells.push(...winningCells);
        winTypes.push('Diagonal \\\\');
    }

    // Check top-right to bottom-left diagonal
    const diagonal2 = card.map((row, i) => row[size - 1 - i]);
    if (diagonal2.every(cell => cell.marked)) {
        const winningCells = card.map((_, i) => ({ row: i, col: size - 1 - i }));
        allWinningCells.push(...winningCells);
        winTypes.push('Diagonal //');
    }

    // Remove duplicates (a cell can be in multiple winning lines)
    // Use Map to dedupe by row-col combo
    const uniqueWinningCells = Array.from(
        new Map(allWinningCells.map(cell => [`${cell.row}-${cell.col}`, cell])).values()
    );

    if (winTypes.length > 0) {
        return {
            hasBingo: true,
            winType: winTypes.join(', '),
            winningCells: uniqueWinningCells
        };
    }

    return { hasBingo: false, winType: null, winningCells: [] };
};

/**
 * Count how many squares are marked
 */
export const countMarked = (card) => {
    return card.flat().filter(cell => cell.marked).length;
};

/**
 * Check if there's a blackout (all 25 squares marked)
 * @param {Array<Array<Object>>} card - The bingo card grid
 * @returns {boolean} true if all squares are marked
 */
export const checkForBlackout = (card) => {
    return card.flat().every(cell => cell.marked);
};