import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('labocore_theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('labocore_theme', theme);
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--bg-color', '#0f172a');
      root.style.setProperty('--surface-color', '#1e293b');
      root.style.setProperty('--surface-hover', '#334155');
      root.style.setProperty('--text-main', '#f1f5f9');
      root.style.setProperty('--text-muted', '#cbd5e1');
      root.style.setProperty('--border-color', '#334155');
    } else {
      root.removeAttribute('data-theme');
      root.style.setProperty('--bg-color', '#f4f6fa');
      root.style.setProperty('--surface-color', '#ffffff');
      root.style.setProperty('--surface-hover', '#f8fafc');
      root.style.setProperty('--text-main', '#1e293b');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
