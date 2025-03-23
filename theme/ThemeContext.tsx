import React, { createContext, useContext } from 'react';

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
}

interface Theme {
  colors: ThemeColors;
}

const lightTheme: Theme = {
  colors: {
    primary: '#0891b2',
    background: '#ffffff',
    card: '#f1f5f9',
    text: '#0f172a',
    border: '#e2e8f0',
    notification: '#0891b2',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

const darkTheme: Theme = {
  colors: {
    primary: '#06b6d4',
    background: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    border: '#334155',
    notification: '#06b6d4',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 