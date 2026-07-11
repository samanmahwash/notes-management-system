/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        ink: '#23211D',
        'ink-dark': '#151412',
        surface: {
          light: '#FFFFFF',
          dark: '#24221E',
        },
        graphite: '#6B6560',
        gold: {
          DEFAULT: '#C89B3C',
          light: '#E0C179',
          dark: '#9C7A2C',
        },
        pine: {
          DEFAULT: '#2F5D50',
          light: '#4C8071',
        },
        clay: {
          DEFAULT: '#B5563C',
          light: '#D07B5F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(35, 33, 29, 0.08), 0 8px 24px -8px rgba(35, 33, 29, 0.10)',
        'soft-dark': '0 2px 10px -2px rgba(0, 0, 0, 0.35), 0 8px 24px -8px rgba(0, 0, 0, 0.45)',
        glow: '0 0 0 3px rgba(200, 155, 60, 0.25)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        card: '18px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
      },
    },
  },
  plugins: [],
};
