import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { colorScheme } from 'nativewind';
import { palettes, type Palette, type ThemeName } from './palettes';

export type ThemeChoice = 'claro' | 'oscuro' | 'sistema';

type ThemeValue = {
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
  /** Tema efectivo (resuelve "sistema" con el modo del dispositivo). */
  name: ThemeName;
  palette: Palette;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [choice, setChoice] = useState<ThemeChoice>('claro');

  const name: ThemeName =
    choice === 'oscuro' || (choice === 'sistema' && systemScheme === 'dark') ? 'dark' : 'light';

  // NativeWind aplica las variables de .dark:root (src/global.css) cuando el esquema es "dark".
  useEffect(() => {
    colorScheme.set(name);
  }, [name]);

  const value = useMemo<ThemeValue>(
    () => ({ choice, setChoice, name, palette: palettes[name] }),
    [choice, name],
  );

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
