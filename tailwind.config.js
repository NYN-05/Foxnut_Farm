/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Green
        brand: {
          green: '#74B72E',
          greenHover: '#5D9E24',
          greenLight: '#A8D672',
        },
        // Sunshine Yellow
        sunshine: {
          yellow: '#F9C74F',
          yellowHover: '#F7B733',
        },
        // Berry Pink
        berry: {
          pink: '#E76F51',
          pinkHover: '#D55A3F',
        },
        // Sky Blue
        sky: {
          blue: '#3B82F6',
        },
        // Backgrounds
        background: {
          light: '#FFFDF8',
          paleGreen: '#FAFFF7',
          white: '#FFFFFF',
        },
        // Text colors
        text: {
          primary: '#2F2F2F',
          secondary: '#555555',
        },
        // Footer
        footer: {
          bg: '#1C3126',
          text: '#D9E2D3',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #74B72E 0%, #A8D672 100%)',
        'subscribe-gradient': 'linear-gradient(145deg, #E76F51 0%, #F9C74F 100%)',
      },
    },
  },
  plugins: [],
}
