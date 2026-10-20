/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B6B53',
          50: '#F0F9F6',
          100: '#DCF1EB',
          200: '#BCE2D7',
          300: '#8DCAB9',
          400: '#53AA94',
          500: '#0B6B53',
          600: '#095B46',
          700: '#084A3A',
          800: '#073C2F',
          900: '#052C23',
        },
        secondary: {
          DEFAULT: '#1B8F6B',
          50: '#F0FBF7',
          100: '#DCF6EC',
          200: '#BCECDA',
          300: '#8BDFC1',
          400: '#50CAA2',
          500: '#1B8F6B',
          600: '#147657',
          700: '#125E46',
          800: '#104B39',
          900: '#0E3E30',
        },
        accent: {
          DEFAULT: '#F5B642',
          50: '#FEF9EE',
          100: '#FDF1D5',
          200: '#FBE3AA',
          300: '#F8D076',
          400: '#F5B642',
          500: '#EA9C1E',
          600: '#C77914',
          700: '#9C5813',
          800: '#7E4717',
          900: '#683B17',
        },
        sidebar: {
          DEFAULT: '#0D2B23',
          dark: '#081E18',
          light: '#133D32',
          border: 'rgba(255, 255, 255, 0.08)',
          active: '#154A3D',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F7F6',
          border: 'rgba(0, 0, 0, 0.06)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 8px 30px -4px rgba(13, 43, 35, 0.06), 0 2px 8px -2px rgba(13, 43, 35, 0.03)',
        'glow-primary': '0 8px 25px -4px rgba(11, 107, 83, 0.35)',
        'glow-accent': '0 8px 25px -4px rgba(245, 182, 66, 0.35)',
        'sidebar-nav': '0 4px 14px rgba(11, 107, 83, 0.4)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
}
