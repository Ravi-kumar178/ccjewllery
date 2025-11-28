/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#C9A961',
        charcoal: '#5A5A5A',
        pearl: '#F5F5F0',
        champagne: '#E8DCC4',
        emerald: '#50C878',
        sapphire: '#0F52BA',
        ruby: '#E0115F',
        diamond: '#B9F2FF',
        amethyst: '#9966CC',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
