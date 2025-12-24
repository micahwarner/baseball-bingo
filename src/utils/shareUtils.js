import html2canvas from 'html2canvas';

/**
 * Encode card data to a URL-friendly string
 * @param {Array<Array<Object>>} card - The bingo card
 * @returns {string} Encoded card string
 * @throws {Error} If card is invalid or encoding fails
 */
export const encodeCardData = (card) => {
    if (!card) {
        throw new Error('Card is required for encoding');
    }

    if (!Array.isArray(card) || card.length !== 5) {
        throw new Error('Invalid card structure: must be a 5x5 array');
    }

    const events = [];
    for (let row = 0; row < 5; row++) {
        if (!Array.isArray(card[row]) || card[row].length !== 5) {
            throw new Error(`Invalid card structure: row ${row} is not a valid array`);
        }
        for (let col = 0; col < 5; col++) {
            if (!card[row][col] || typeof card[row][col] !== 'object') {
                throw new Error(`Invalid card structure: cell at [${row}][${col}] is invalid`);
            }
            if (!card[row][col].isFree) {
                if (!card[row][col].event || typeof card[row][col].event !== 'string') {
                    throw new Error(`Invalid card structure: event at [${row}][${col}] is invalid`);
                }
                events.push(card[row][col].event);
            }
        }
    }

    if (events.length !== 24) {
        throw new Error(`Invalid card: expected 24 events, got ${events.length}`);
    }

    try {
        const jsonString = JSON.stringify(events);
        return btoa(jsonString);
    } catch (error) {
        throw new Error(`Failed to encode card: ${error.message}`);
    }
};

/**
 * Decode card data from URL string
 * @param {string} encodedData - Encoded card string
 * @returns {Array<string>|null} Array of event names or null if invalid
 */
export const decodeCardData = (encodedData) => {
    if (!encodedData || typeof encodedData !== 'string') {
        return null;
    }

    try {
        const jsonString = atob(encodedData);
        const events = JSON.parse(jsonString);

        if (!Array.isArray(events)) {
            console.warn('Decoded data is not an array');
            return null;
        }

        if (events.length !== 24) {
            console.warn(`Expected 24 events, got ${events.length}`);
            return null;
        }

        if (!events.every(event => typeof event === 'string' && event.length > 0)) {
            console.warn('Decoded events contain invalid entries');
            return null;
        }

        return events;
    } catch (error) {
        console.error('Failed to decode card:', error);
        return null;
    }
};

/**
 * Generate a shareable URL for the current card
 * @param {Array<Array<Object>>} card - The bingo card
 * @returns {string} Shareable URL (returns base URL if encoding fails)
 */
export const generateCardUrl = (card) => {
    if (!card) return window.location.href;

    try {
        const encoded = encodeCardData(card);
        if (!encoded) return window.location.href;

        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?card=${encoded}`;
    } catch (error) {
        console.error('Failed to generate card URL:', error);
        return window.location.href;
    }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

/**
 * Capture element as image
 * @param {HTMLElement} element - Element to capture
 * @param {Object} options - html2canvas options
 * @returns {Promise<Blob>} Image blob
 * @throws {Error} If element is invalid or capture fails
 */
export const captureElementAsImage = async (element, options = {}) => {
    if (!element || !(element instanceof HTMLElement)) {
        throw new Error('Invalid element: must be a valid HTML element');
    }

    const defaultOptions = {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: false,
        ...options
    };

    try {
        const canvas = await html2canvas(element, defaultOptions);

        if (!canvas) {
            throw new Error('Failed to create canvas from element');
        }

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to convert canvas to blob'));
                        return;
                    }
                    resolve(blob);
                },
                'image/png',
                1.0
            );
        });
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to capture image';
        console.error('Failed to capture image:', error);
        throw new Error(errorMessage);
    }
};

/**
 * Download image as file
 * @param {Blob} blob - Image blob
 * @param {string} filename - Filename
 * @throws {Error} If blob is invalid or download fails
 */
export const downloadImage = (blob, filename) => {
    if (!blob || !(blob instanceof Blob)) {
        throw new Error('Invalid blob: must be a valid Blob object');
    }

    if (!filename || typeof filename !== 'string') {
        throw new Error('Invalid filename: must be a non-empty string');
    }

    try {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);

        try {
            link.click();
        } catch (clickError) {
            console.error('Failed to trigger download:', clickError);
            // Fallback: try opening in new window
            window.open(url, '_blank');
        } finally {
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        }
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to download image';
        console.error('Failed to download image:', error);
        throw new Error(errorMessage);
    }
};

/**
 * Share image using Web Share API or download
 * @param {Blob} blob - Image blob
 * @param {string} filename - Filename
 * @param {string} text - Share text
 * @returns {Promise<boolean>} Success status (true if shared, false if downloaded)
 * @throws {Error} If sharing or download fails
 */
export const shareImage = async (blob, filename, text = 'Check out my Baseball Bingo card!') => {
    if (!blob || !(blob instanceof Blob)) {
        throw new Error('Invalid blob: must be a valid Blob object');
    }

    if (!filename || typeof filename !== 'string') {
        throw new Error('Invalid filename: must be a non-empty string');
    }

    try {
        const file = new File([blob], filename, { type: 'image/png' });

        // Try Web Share API if available
        if (navigator.share && navigator.canShare) {
            try {
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Baseball Bingo Card',
                        text: text
                    });
                    return true;
                }
            } catch (shareError) {
                if (shareError.name === 'AbortError') {
                    return false;
                }
                console.warn('Web Share API failed, falling back to download:', shareError);
            }
        }

        downloadImage(blob, filename);
        return false;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to share image';
        console.error('Failed to share image:', error);
        throw new Error(errorMessage);
    }
};

/**
 * Share to Twitter
 * @param {string} text - Tweet text
 * @param {string} url - URL to share (optional)
 */
export const shareToTwitter = (text, url = '') => {
    const tweetText = url ? `${text} ${url}` : text;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
};

/**
 * Share to Facebook
 * @param {string} text - Share text
 * @param {string} url - URL to share (optional)
 */
export const shareToFacebook = (text, url = '') => {
    const shareText = url ? `${text} ${url}` : text;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
};

/**
 * Get share text based on win state
 * @param {Object} winState - Win state object
 * @returns {string} Share text
 */
export const getShareText = (winState) => {
    if (winState.isBlackout) {
        return `🎆 BLACKOUT! I completed every square on my Baseball Bingo card! ⚾`;
    } else if (winState.hasBingo && winState.winType) {
        return `🏆 BINGO! I got a ${winState.winType} on my Baseball Bingo card! ⚾`;
    } else {
        return `⚾ Check out my Baseball Bingo card!`;
    }
};
