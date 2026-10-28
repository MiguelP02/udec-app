import { darkPalette, lightPalette, toRgbTriplet } from './palettes';

// src/global.css se genera con scripts/build-theme-css.js a partir de estas paletas.
// Tras cambiar un color, ejecutar: node scripts/build-theme-css.js

describe('paletas del tema', () => {
  it('la paleta oscura define exactamente los mismos colores que la clara', () => {
    expect(Object.keys(darkPalette).sort()).toEqual(Object.keys(lightPalette).sort());
  });

  it('el fondo y el texto cambian entre claro y oscuro', () => {
    expect(darkPalette.background).not.toBe(lightPalette.background);
    expect(darkPalette.text).not.toBe(lightPalette.text);
  });

  it('convierte #RRGGBB al formato "r g b" de Tailwind', () => {
    expect(toRgbTriplet('#163F80')).toBe('22 63 128');
  });
});
