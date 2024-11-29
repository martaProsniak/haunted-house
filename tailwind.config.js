import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        freckle: ['"Freckle Face"', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}

