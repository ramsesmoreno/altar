/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      colors: {
        // Día de Muertos color palette
        'marigold': {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe799',
          300: '#ffdb66',
          400: '#ffcf33',
          500: '#ffc300',  // Primary marigold
          600: '#cc9c00',
          700: '#997500',
          800: '#664e00',
          900: '#332700',
        },
        'vibrant-pink': {
          50: '#ffe6f0',
          100: '#ffcce0',
          200: '#ff99c2',
          300: '#ff66a3',
          400: '#ff3385',
          500: '#ff0066',  // Primary vibrant pink
          600: '#cc0052',
          700: '#99003d',
          800: '#660029',
          900: '#330014',
        },
        'deep-purple': {
          50: '#f0e6ff',
          100: '#e0ccff',
          200: '#c299ff',
          300: '#a366ff',
          400: '#8533ff',
          500: '#6600ff',  // Primary deep purple
          600: '#5200cc',
          700: '#3d0099',
          800: '#290066',
          900: '#140033',
        },
        'altar-orange': {
          50: '#fff4e6',
          100: '#ffe9cc',
          200: '#ffd399',
          300: '#ffbd66',
          400: '#ffa733',
          500: '#ff9100',  // Warm altar orange
          600: '#cc7400',
          700: '#995700',
          800: '#663a00',
          900: '#331d00',
        },
      },
    },
  },
  plugins: [],
}
