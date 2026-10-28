// Genera src/global.css con las variables del tema a partir de tokens.json (claro)
// y dark-tokens.json (oscuro). NativeWind aplica .dark:root cuando colorScheme es "dark".
// Ejecutar: node scripts/build-theme-css.js  (la prueba src/theme/palettes.test.ts verifica que esté al día)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const light = require(path.join(root, 'src/theme/tokens.json')).colors;
const dark = require(path.join(root, 'src/theme/dark-tokens.json')).colors;

function toTriplet(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)).join(' ');
}

function block(selector, palette) {
  const lines = Object.entries(palette).map(([name, hex]) => `  --udec-${name}: ${toTriplet(hex)};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}

const css = [
  '@tailwind base;',
  '@tailwind components;',
  '@tailwind utilities;',
  '',
  '/* Generado por scripts/build-theme-css.js desde tokens.json y dark-tokens.json. No editar a mano. */',
  block(':root', light),
  '',
  block('.dark:root', dark),
  '',
].join('\n');

fs.writeFileSync(path.join(root, 'src/global.css'), css);
console.log('src/global.css actualizado');
