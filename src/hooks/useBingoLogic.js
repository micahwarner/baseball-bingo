import { useState, useCallback, useEffect, useRef } from 'react';
import { generateBingoCard, generateCardId } from '../utils/cardGenerator';
import { checkForBingo, countMarked, checkForBlackout } from '../utils/winDetection';
import { useLocalStorage } from './useLocalStorage';
import { decodeCardData } from '../utils/shareUtils';

export const useBingoLogic = () => {
    const [cardId, setCardId] = useLocalStorage('bingo_card_id', null);
    const [card, setCard] = useLocalStorage('bingo_card', null);
    const [winState, setWinState] = useState({ hasBingo: false, winType: null, isBlackout: false, winningCells: [] });
    const [markedCount, setMarkedCount] = useState(0);
    const [hasAchievedBingo, setHasAchievedBingo] = useLocalStorage('bingo_has_achieved_bingo', false);
    const urlCardLoaded = useRef(false);
    const lastCardIdRef = useRef(cardId);

    useEffect(() => {
        if (cardId !== lastCardIdRef.current) {
            setHasAchievedBingo(false);
            lastCardIdRef.current = cardId;
        }
    }, [cardId, setHasAchievedBingo]);

    // Load card from URL if someone shared a link
    // The ref makes sure we only do this once
    useEffect(() => {
        if (urlCardLoaded.current) return;

        const urlParams = new URLSearchParams(window.location.search);
        const cardParam = urlParams.get('card');

        if (cardParam) {
            const events = decodeCardData(cardParam);
            if (events) {
                const newCard = generateBingoCard(true, events);
                const newCardId = generateCardId();
                setCard(newCard);
                setCardId(newCardId);
                setWinState({ hasBingo: false, winType: null, isBlackout: false, winningCells: [] });
                setMarkedCount(1); // Free space is always marked
                setHasAchievedBingo(false);

                // Clean up URL so it doesn't reload on refresh
                window.history.replaceState({}, document.title, window.location.pathname);
                urlCardLoaded.current = true;
            }
        }
    }, [setCard, setCardId]);

    const initializeCard = useCallback(() => {
        try {
            const newCard = generateBingoCard(true);
            const newCardId = generateCardId();
            setCard(newCard);
            setCardId(newCardId);
            setWinState({ hasBingo: false, winType: null, isBlackout: false, winningCells: [] });
            setMarkedCount(1);
            setHasAchievedBingo(false);
        } catch (error) {
            console.error('Error initializing card:', error);
            setWinState({ hasBingo: false, winType: null, isBlackout: false, winningCells: [] });
            setMarkedCount(0);
            throw error;
        }
    }, [setCard, setCardId, setHasAchievedBingo]);

    const toggleSquare = useCallback((row, col) => {
        try {
            if (!card || !Array.isArray(card)) {
                console.error('Invalid card: card is not an array');
                return;
            }

            if (typeof row !== 'number' || typeof col !== 'number' ||
                row < 0 || row >= 5 || col < 0 || col >= 5) {
                console.error(`Invalid coordinates: row=${row}, col=${col}`);
                return;
            }

            if (!card[row] || !card[row][col]) {
                console.error(`Invalid card structure at [${row}][${col}]`);
                return;
            }

            if (card[row][col].isFree) return;

            const newCard = card.map((r, rowIndex) =>
                r.map((cell, colIndex) => {
                    if (rowIndex === row && colIndex === col) {
                        return { ...cell, marked: !cell.marked };
                    }
                    return cell;
                })
            );

            setCard(newCard);

            // Check for blackout first
            const isBlackout = checkForBlackout(newCard);
            if (isBlackout) {
                // Blackout means every cell wins
                const allWinningCells = newCard.flatMap((row, rowIndex) =>
                    row.map((_, colIndex) => ({ row: rowIndex, col: colIndex }))
                );
                setWinState({ hasBingo: true, winType: 'Blackout', isBlackout: true, winningCells: allWinningCells });
                setHasAchievedBingo(true);
            } else if (!hasAchievedBingo) {
                // Only check for bingo if we haven't won yet
                const result = checkForBingo(newCard);
                if (result.hasBingo) {
                    setWinState({ ...result, isBlackout: false });
                    setHasAchievedBingo(true);
                } else {
                    setWinState({ hasBingo: false, winType: null, isBlackout: false, winningCells: [] });
                }
            } else {
                // Already won, don't check again
                setWinState({ hasBingo: false, winType: null, isBlackout: false, winningCells: [] });
            }
            setMarkedCount(countMarked(newCard));
        } catch (error) {
            console.error('Error toggling square:', error);
        }
    }, [card, setCard, hasAchievedBingo]);

    const resetGame = useCallback(() => {
        initializeCard();
    }, [initializeCard]);

    return {
        card,
        cardId,
        winState,
        markedCount,
        toggleSquare,
        resetGame,
        initializeCard
    };
};