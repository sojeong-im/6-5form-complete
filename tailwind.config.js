/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'complete-green': '#A3FF00',
        'complete-dark': '#121212',
      },
      fontFamily: {
        'sans': ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
