/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        visa: {
          blue: '#1A1F71',
          lightBlue: '#2A3B90',
          gold: '#F7B600',
          goldHover: '#E5A700',
          dark: '#0A0E2A',
        },
      },
    },
  },
  plugins: [],
};
