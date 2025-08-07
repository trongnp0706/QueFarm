
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Logo-inspired color palette
        'brand': {
          'green': {
            '50': '#f0fdf2',
            '100': '#dcfce7',
            '200': '#bbf7d0',
            '300': '#86efac',
            '400': '#4ade80',
            '500': '#2dd653', // Warmer, more natural green from logo
            '600': '#22a043',
            '700': '#1e7e3a',
            '800': '#166534', // Rich forest green
            '900': '#14532d',
            '950': '#052e16',
          },
          'brown': {
            '50': '#fdf8f6',
            '100': '#f2e8e5',
            '200': '#eaddd7',
            '300': '#e0cec7',
            '400': '#d2bab0',
            '500': '#bfa094', // Warm brown from logo
            '600': '#a18072',
            '700': '#977669',
            '800': '#846358',
            '900': '#43302b',
            '950': '#2d1b1a',
          },
          'yellow': {
            '50': '#fefce8',
            '100': '#fef9c3',
            '200': '#fef08a',
            '300': '#fde047',
            '400': '#facc15',
            '500': '#eab308', // Sunny yellow from logo
            '600': '#ca8a04',
            '700': '#a16207',
            '800': '#854d0e',
            '900': '#713f12',
            '950': '#422006',
          },
          'cream': {
            '50': '#fefefe',
            '100': '#fefefe',
            '200': '#fdfcfb',
            '300': '#faf8f5',
            '400': '#f5f2ed',
            '500': '#ede8e0', // Cream color from logo
            '600': '#d4cbbf',
            '700': '#b8a99a',
            '800': '#9a8a7a',
            '900': '#7d6e5f',
            '950': '#4a3f35',
          },
          'background': '#fefce8', // Light yellow background from logo
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
