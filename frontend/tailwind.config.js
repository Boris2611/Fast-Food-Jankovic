/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accentRed: "#dd2129",
        accentOrange: "#faa91a",
      },
    },
  },
  plugins: [],
};
