/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          50: '#E6FAF8',
          100: '#CCF5F1',
          200: '#99EBE3',
          300: '#66E0D5',
          400: '#33D6C7',
          500: '#0F766E',
          600: '#0D5E57',
          700: '#0A4740',
          800: '#082F29',
          900: '#051812',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          50: '#FEF7E6',
          100: '#FDEECC',
          200: '#FBDD99',
          300: '#F9CC66',
          400: '#F7BB33',
          500: '#F59E0B',
          600: '#C47F09',
          700: '#935F07',
          800: '#624004',
          900: '#312002',
        },
        accent: '#22C55E',
        dark: '#0F172A',
        muted: '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
}
