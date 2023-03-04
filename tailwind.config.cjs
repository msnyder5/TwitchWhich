/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': colors.zinc,
        'secondary': colors.slate,
        'accent': colors.violet,
      }
    }
  },
  plugins: [],
}
