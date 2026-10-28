import darkTokens from './dark-tokens.json';
import tokens from './tokens.json';

export type ColorName = keyof typeof tokens.colors;
export type Palette = Record<ColorName, string>;
export type ThemeName = 'light' | 'dark';

/** Paleta clara: fuente de verdad de tokens.json (paleta UDEC Fresca). */
export const lightPalette: Palette = tokens.colors;

/**
 * Paleta oscura (dark-tokens.json). Mismas claves que la clara. Los colores de marca se aclaran
 * para leerse sobre fondo oscuro; el texto sobre amarillo se mantiene oscuro.
 */
export const darkPalette: Palette = darkTokens.colors;

export const palettes: Record<ThemeName, Palette> = { light: lightPalette, dark: darkPalette };

/** "#RRGGBB" -> "r g b" (formato que usa Tailwind con <alpha-value>). */
export function toRgbTriplet(hex: string): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
