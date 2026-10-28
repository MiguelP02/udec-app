import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { cssVarsFor, palettes, type Palette, type ThemeName } from './palettes';

export type ThemeChoice = 'claro' | 'oscuro' | 'sistema';

type ThemeValue = {
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
  /** Tema efectivo (resuelve "sistema" con el modo del dispositivo). */
  name: ThemeName;
  palette: Palette;
  cssVars: Record<string, string>;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [choice, setChoice] = useState<ThemeChoice>('claro');

  const value = useMemo<ThemeValue>(() => {
    const name: ThemeName =
      choice === 'oscuro' || (choice === 'sistema' && systemScheme === 'dark') ? 'dark' : 'light';
    const palette = palettes[name];
    return { choice, setChoice, name, palette, cssVars: cssVarsFor(palette) };
  }, [choice, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return value;
}

/** Colores del tema actual para props de React Native (íconos, placeholders, navegación). */
export function useThemeColors(): Palette {
  return useTheme().palette;
}
