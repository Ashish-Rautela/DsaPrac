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
          blue: '#2563EB',       // Modern vibrant periwinkle blue matching reference
          lightBlue: '#1D4ED8',
          gold: '#F59E0B',        // Warm aesthetic amber matching reference
          goldHover: '#D97706',
          dark: '#0F172A',
        },
        brand: {
          50: '#EEF2F8',
          100: '#E0E7F5',
          200: '#C7D2FE',
          500: '#4F6BF5',
          600: '#3B82F6',
          700: '#2563EB',
        },
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 12px 40px rgba(0, 0, 0, 0.05)',
        'pill': '0 4px 14px rgba(59, 130, 246, 0.25)',
      },
    },
  },
  plugins: [],
};
