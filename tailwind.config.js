/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          bg: '#FAF7F2',
          card: '#FFFFFF',
          sand: '#F4ECE1',
          sandDark: '#E5D8C7',
          border: '#E8DED1',
          slate: '#1A2332',
          slateMuted: '#475569',
          terracotta: '#D05A3F',
          terracottaDark: '#B3442B',
          terracottaLight: '#FBECE8',
          amber: '#C97716',
          amberLight: '#FEF3E2',
          forest: '#0E5C46',
          forestDark: '#0A4333',
          forestLight: '#E6F4EF',
          teal: '#0E766E',
          tealLight: '#E6F6F4',
          gold: '#B8860B',
        },
        customer: {
          primary: '#0D6E66',
          primaryHover: '#0A554F',
          accent: '#E06D53',
          bg: '#F8FAF9',
          card: '#FFFFFF',
          border: '#D9E8E5',
        },
        worker: {
          primary: '#C97716',
          primaryHover: '#A85F0C',
          accent: '#0E5C46',
          bg: '#FAF8F4',
          card: '#FFFFFF',
          border: '#EDDEC9',
        },
        admin: {
          primary: '#1A283C',
          primaryHover: '#111D2D',
          accent: '#2563EB',
          gold: '#C28B1E',
          bg: '#F4F6F9',
          card: '#FFFFFF',
          border: '#D8DFEB',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'civic': '0 2px 8px -1px rgba(26, 35, 50, 0.06), 0 1px 3px -1px rgba(26, 35, 50, 0.04)',
        'civic-hover': '0 10px 25px -3px rgba(26, 35, 50, 0.08), 0 4px 10px -2px rgba(26, 35, 50, 0.04)',
        'civic-lg': '0 20px 30px -8px rgba(26, 35, 50, 0.1), 0 8px 12px -4px rgba(26, 35, 50, 0.06)',
      }
    },
  },
  plugins: [],
}
