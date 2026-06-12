/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'smoke': 'smoke 2.5s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-8px) translateX(6px)' },
        },
        smoke: {
          '0%': { transform: 'translateY(5px) scale(0.5)', opacity: '0' },
          '30%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-35px) scale(1.5)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
