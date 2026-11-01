export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        atelier: {
          noir: '#1C1917',
          stone: '#44403C',
          gold: '#A16207',
          'gold-light': '#CA8A04',
          cream: '#FAFAF9',
          border: '#E7E5E4',
          muted: '#78716C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['Lato', 'Montserrat', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
