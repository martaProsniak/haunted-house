import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", ...defaultTheme.fontFamily.sans],
        creepster: ['"Creepster"', ...defaultTheme.fontFamily.serif],
        luckiest: ["Luckiest Guy", ...defaultTheme.fontFamily.sans],
        indieFlower: ["Indie Flower", ...defaultTheme.fontFamily.serif],
        cherryBomb: ["Cherry Bomb One", ...defaultTheme.fontFamily.serif],
        candy: ["Emilys Candy", ...defaultTheme.fontFamily.serif],
        jersey: ["Jersey 15", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        ghostPink: "#ec3597",
        ghostBlue: "#2398ec",
        ghostGreen: "#45e732"
      }
    },
  },
  plugins: [],
}

