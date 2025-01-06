import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        creepster: ['"Creepster"', ...defaultTheme.fontFamily.serif],
        candy: ["Emilys Candy", ...defaultTheme.fontFamily.serif],
        dynaPuff: ["DynaPuff", ...defaultTheme.fontFamily.serif],
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

