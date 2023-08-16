/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',
          sm: '2rem',
          lg: '3rem',
          xl: '3rem',
          '2xl': '6rem',
        }
      },
      colors: {
        "primary": "#EB6435",
        "secondary": "#026C80",
        "accent": "#003262",
        "neutral": "#111111",
        "base-100": "#dddddd",
      },
    },
  },
  plugins: [],
}

