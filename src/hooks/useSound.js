import { useEffect, useCallback, useRef } from 'react';

// Sound file paths 
const SOUND_FILES = {
    mark: '/audio/mark.mp3',
    bingo: '/audio/bingo.mp3',
    blackout: '/audio/blackout.mp3'
};

/**
 * Hook for sound effects
 * @param {boolean} enabled - Whether sound is enabled (from settings)
 * @param {number} volume - Volume level 0-1 (from settings)
 * @returns {Object} Sound controls
 */
export const useSound = (enabled = false, volume = 0.5) => {
    const audioRefs = useRef({});

    useEffect(() => {
        Object.entries(SOUND_FILES).forEach(([key, path]) => {
            if (!audioRefs.current[key]) {
                const audio = new Audio(path);
                audio.preload = 'auto';
                audio.addEventListener('error', () => {
                    console.warn(`Failed to load sound: ${path}`);
                });
                audioRefs.current[key] = audio;
            }
        });
    }, []);

    useEffect(() => {
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) {
                audio.volume = volume;
            }
        });
    }, [volume]);

    const playSound = useCallback((soundName) => {
        if (!enabled) return;

        const audio = audioRefs.current[soundName];
        if (audio) {
            const audioClone = audio.cloneNode();
            audioClone.volume = volume;

            audioClone.play().catch(error => {
                if (error.name !== 'NotAllowedError') {
                    console.warn(`Failed to play sound ${soundName}:`, error);
                }
            });
        }
    }, [enabled, volume]);

    return {
        playSound
    };
};
