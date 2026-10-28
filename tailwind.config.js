const tokens = require('./src/theme/tokens.json');

// Los colores udec-* leen variables CSS (--udec-*, en formato "r g b") definidas en src/global.css:
// :root para el tema claro y .dark:root para el oscuro. NativeWind activa .dark:root con colorScheme.
// <alpha-value> permite modificadores de opacidad. Ver scripts/build-theme-css.js.
const udec = Object.fromEntries(
  Object.keys(tokens.colors).map((name) => [name, `rgb(var(--udec-${name}) / <alpha-value>)`]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: { extend: { colors: { udec }, borderRadius: tokens.radius } },
  plugins: [],
};
