import tokens from './tokens.json';

export type ColorName = keyof typeof tokens.colors;
export type Palette = Record<ColorName, string>;
export type ThemeName = 'light' | 'dark';

/** Paleta clara: fuente de verdad de tokens.json (paleta UDEC Fresca). */
export const lightPalette: Palette = tokens.colors;

/**
 * Paleta oscura. Mismas claves que la clara. Los colores de marca se aclaran
 * para leerse sobre fondo oscuro; el texto sobre amarillo se mantiene oscuro.
 */
export const darkPalette: Palette = {
  primary: '#3D72C9',
  'primary-hover': '#2F5FAE',
  'primary-soft': '#1B2E4D',
  secondary: '#3FB37A',
  'secondary-soft': '#133524',
  accent: '#F3B414',
  'accent-soft': '#3A2E0B',
  'on-accent': '#13233A',
  background: '#131C2C',
  surface: '#0B1220',
  field: '#1B2638',
  border: '#2B3A52',
  text: '#E7EDF7',
  muted: '#A3B1C6',
  green: '#3FB37A',
  blue: '#3D72C9',
  yellow: '#F3B414',
  purple: '#9B84E0',
  rust: '#E08A5F',
  red: '#F07167',
  'code-bg': '#0A0F18',
  'code-text': '#DBE8DF',
  'code-string': '#7FD3A0',
  'code-number': '#8FB6FF',
  'code-comment': '#7F9A8A',
};

export const palettes: Record<ThemeName, Palette> = { light: lightPalette, dark: darkPalette };

/** Variables CSS que leen las clases de Tailwind (bg-udec-*, text-udec-*...). */
export function cssVarsFor(palette: Palette): Record<string, string> {
  return Object.fromEntries(Object.entries(palette).map(([name, value]) => [`--udec-${name}`, value]));
}
