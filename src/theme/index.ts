import {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
  PublicSans_800ExtraBold,
} from '@expo-google-fonts/public-sans';
import { useFonts } from 'expo-font';
import tokens from './tokens.json';

export const colors = tokens.colors;
export const radius = tokens.radius;

export type ColorToken = keyof typeof colors;

/** Colores que vienen de datos (canales, insignias). Tailwind no genera clases con plantillas: usa style. */
export type DataColor = 'green' | 'blue' | 'yellow' | 'purple' | 'rust' | 'red';

export const fontAssets = {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
  PublicSans_800ExtraBold,
};

export const fonts = {
  regular: 'PublicSans_400Regular',
  medium: 'PublicSans_500Medium',
  semibold: 'PublicSans_600SemiBold',
  bold: 'PublicSans_700Bold',
  extrabold: 'PublicSans_800ExtraBold',
} as const;

export type FontWeight = keyof typeof fonts;

/** Fuente monoespaciada del sistema para código (Menlo en iOS, monospace en el resto). */
export const monoFont = process.env.EXPO_OS === 'ios' ? 'Menlo' : 'monospace';

export const shadows = {
  card: '0 1px 3px rgba(19,35,58,0.12)',
} as const;

/** true cuando las fuentes ya están cargadas. */
export function useAppFonts(): boolean {
  const [loaded] = useFonts(fontAssets);
  return loaded;
}
