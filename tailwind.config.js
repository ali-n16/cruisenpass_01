'use strict';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './src/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          active: '#00D1A0',
          electric: '#4F46E5',
          dark: '#0B0F19',
          lightBg: '#FFFFFF',
          surface: '#F8FAFC',
          accent: '#FF007A',
        }
      }
    }
  },
  plugins: [],
}
