/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff9f0',
          100: '#ffeed6',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        tiranga: {
          orange: '#FF671F',
          white: '#FFFFFF',
          green: '#046A38',
          blue: '#06038D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
