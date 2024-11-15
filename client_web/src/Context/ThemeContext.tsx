import { createContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

type ThemeContextType = {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = Cookies.get('theme') as 'light' | 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const updateTheme = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        Cookies.set('theme', newTheme, { expires: 365 });
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
