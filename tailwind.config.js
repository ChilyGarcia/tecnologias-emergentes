/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Incluye todos los archivos HTML y TypeScript en el directorio src
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
