import { cssVarsFor, darkPalette, lightPalette } from './palettes';

describe('paletas del tema', () => {
  it('la paleta oscura define exactamente los mismos colores que la clara', () => {
    expect(Object.keys(darkPalette).sort()).toEqual(Object.keys(lightPalette).sort());
  });

  it('el fondo y el texto cambian entre claro y oscuro', () => {
    expect(darkPalette.background).not.toBe(lightPalette.background);
    expect(darkPalette.text).not.toBe(lightPalette.text);
  });

  it('genera una variable --udec-* por cada color', () => {
    const vars = cssVarsFor(darkPalette);
    expect(vars['--udec-background']).toBe(darkPalette.background);
    expect(Object.keys(vars)).toHaveLength(Object.keys(darkPalette).length);
    expect(Object.keys(vars).every((name) => name.startsWith('--udec-'))).toBe(true);
  });
});
