import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check local storage or system preference
        if (localStorage.getItem('theme') === 'dark') {
            return true;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newIsDarkMode = !prev;
            const newTheme = newIsDarkMode ? 'dark' : 'light';

            // Sync with Backend Cookie
            import('../api/apiClient').then(({ default: client }) => {
                client.post('/theme', { theme: newTheme }).catch(err => console.error("Theme sync failed", err));
            });

            return newIsDarkMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
