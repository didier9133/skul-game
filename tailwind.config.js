/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary':"#e31b6d",
        'secondary':"#04c2c9",
        'oscuro':"#1b242f",
        'blanco': "#ffffff",
        'gris-fondo':'#f5f5f5',
        'js':'#efd81d',
        'angular':'#bd002e',
        'html':'#dd4b25',
        'css':'#254bdd',
        'fondo-icono':"#161d26",
        'fondo-cremoso': '#feff9d'

      },
    },
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
