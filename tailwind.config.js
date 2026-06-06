/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Helvetica', 'Arial', ...fontFamily.sans],
        serif: ['Merriweather', 'Georgia', ...fontFamily.serif],
      },
    },
  },
  plugins: [
    // require('@tailwindcss/typography'), // Temporarily disabled to fix build
    // require('@tailwindcss/aspect-ratio'), // Temporarily disabled to fix build
  ],
};