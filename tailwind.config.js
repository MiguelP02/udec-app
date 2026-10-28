const tokens = require('./src/theme/tokens.json');

// Los colores udec-* leen variables CSS (--udec-*) que el ThemeProvider define según el tema
// (claro u oscuro). Así las clases cambian de color sin recompilar. Ver src/theme/palettes.ts.
const udec = Object.fromEntries(Object.keys(tokens.colors).map((name) => [name, `var(--udec-${name})`]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: { extend: { colors: { udec }, borderRadius: tokens.radius } },
  plugins: [],
};
