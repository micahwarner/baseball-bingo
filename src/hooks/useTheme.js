import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for theme management (light/dark mode)
 * Detects system preference on first load if no saved preference exists
 * @returns {[string, function, boolean]} [theme, toggleTheme, isDark]
 */
export const useTheme = () => {
    // Get initial theme - check system preference if no saved preference
    const getInitialTheme = () => {
        if (typeof window === 'undefined') return 'light';

        const saved = localStorage.getItem('theme');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return 'light';
            }
        }

        // Check system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    const [theme, setTheme] = useLocalStorage('theme', getInitialTheme());

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return [theme, toggleTheme, theme === 'dark'];
};
