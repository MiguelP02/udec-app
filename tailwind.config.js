const tokens = require('./src/theme/tokens.json');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: { colors: { udec: tokens.colors }, borderRadius: tokens.radius } },
  plugins: [],
};
