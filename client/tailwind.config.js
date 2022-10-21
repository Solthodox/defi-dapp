/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        smd:'900px'
      },
      colors:{
        "d":"#171717",
        "l":"#f8fafc"
      },

    },
  },
  plugins: [],
}