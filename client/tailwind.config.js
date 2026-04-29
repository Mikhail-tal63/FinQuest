/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#1D4ED8',
          'blue-light': '#3B82F6',
          'blue-dark': '#1E3A8A',
          green: '#059669',
          'green-light': '#10B981',
        },
        surface: {
          DEFAULT: '#F1F3F7',
          card: '#FFFFFF',
          dock: '#FFFFFF',
          topbar: '#FFFFFF',
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.07)',
        dock: '2px 0 16px rgba(0,0,0,0.06)',
        topbar: '0 1px 8px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
