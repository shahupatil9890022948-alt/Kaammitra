import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from './theme';
import { ThemeMode } from '../models/types';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: 'system',
});

export function ThemeProvider({
  mode,
  children,
}: {
  mode: ThemeMode;
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();
  const value = useMemo<ThemeContextValue>(() => {
    const resolved =
      mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
    return { theme: resolved === 'dark' ? darkTheme : lightTheme, mode };
  }, [mode, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}
