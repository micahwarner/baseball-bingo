import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook for app settings
 * @returns {Object} Settings object and functions to update settings
 */
export const useSettings = () => {
    const [settings, setSettings] = useLocalStorage('app_settings', {
        // Sound settings
        soundEnabled: false,
        soundVolume: 0.5,

        // Theme settings
        theme: 'light', // light or dark

        // Game settings
        showWinAnimations: true,
        showConfetti: true,
        showEmojis: true,

        // Display settings
        animationSpeed: 'normal', // slow, normal, fast
        fontSize: 'normal', // small, normal, large

        // Accessibility settings
        reducedMotion: false,
        highContrast: false,

        // Statistics settings
        trackStatistics: true,

        // Notifications
        showToasts: true,
        toastDuration: 3000
    });

    const updateSetting = useCallback((key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setSettings]);

    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => ({
            ...prev,
            ...newSettings
        }));
    }, [setSettings]);

    const resetSettings = useCallback(() => {
        setSettings({
            soundEnabled: false,
            soundVolume: 0.5,
            theme: 'light',
            showWinAnimations: true,
            showConfetti: true,
            showEmojis: true,
            animationSpeed: 'normal',
            fontSize: 'normal',
            reducedMotion: false,
            highContrast: false,
            trackStatistics: true,
            showToasts: true,
            toastDuration: 3000
        });
    }, [setSettings]);

    const exportSettings = useCallback(() => {
        try {
            const dataStr = JSON.stringify(settings, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `baseball-bingo-settings-${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Failed to export settings:', error);
            return false;
        }
    }, [settings]);

    const importSettings = useCallback(async (file) => {
        try {
            const text = await file.text();
            const imported = JSON.parse(text);

            const validKeys = [
                'soundEnabled', 'soundVolume', 'theme',
                'showWinAnimations', 'showConfetti', 'showEmojis',
                'animationSpeed', 'fontSize', 'reducedMotion',
                'highContrast', 'trackStatistics', 'showToasts', 'toastDuration'
            ];

            const validated = {};
            validKeys.forEach(key => {
                if (key in imported) {
                    validated[key] = imported[key];
                }
            });

            setSettings(prev => ({
                ...prev,
                ...validated
            }));

            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }, [setSettings]);

    return {
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        exportSettings,
        importSettings
    };
};

