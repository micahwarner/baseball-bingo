import { BINGO_EVENTS } from "./bingoEvents";

/**
 * Shuffle array using Fisher-Yates algorithm
 * Works by swapping each element with a random element before it
 * This gives a truly random shuffle
 */
const shuffleArray = (array) => {
    const shuffled = [...array];
    // Go backwards through the array
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Pick a random spot from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap them
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Generate a random 5x5 bingo card
 * @param {boolean} includeFreeSspace - Whether to include a free space in the center
 * @param {Array<string>} events - Optional array of 24 events to use (for recreating from URL)
 * @returns {Array<Array<string>>} 5x5 grid of events
 */
export const generateBingoCard = (includeFreeSpace = true, events = null) => {
    let eventList;

    if (events && Array.isArray(events) && events.length === 24) {
        eventList = events;
    } else {
        const shuffled = shuffleArray(BINGO_EVENTS);
        eventList = shuffled.slice(0, 24);
    }

    const card = [];
    let eventIndex = 0;

    for (let row = 0; row < 5; row++) {
        card[row] = [];
        for (let col = 0; col < 5; col++) {
            if (includeFreeSpace && row === 2 && col === 2) {
                card[row][col] = {
                    event: "FREE SPACE",
                    isFree: true,
                    marked: true
                };
            } else {
                card[row][col] = {
                    event: eventList[eventIndex],
                    isFree: false,
                    marked: false
                };
                eventIndex++;
            }
        }
    }

    return card;
};

/**
 * Create a unique card ID for tracking
 */
export const generateCardId = () => {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};