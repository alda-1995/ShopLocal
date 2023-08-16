const plugin = require('tailwindcss/plugin')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
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
  darkMode: "class",
  plugins: [
    require("tw-elements/dist/plugin.cjs"),
    plugin(function ({ addBase }) {
      addBase({
        'h1, .h1': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: "calc(32px + (38 - 32) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.1
        },
        'h2, .h2': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: "calc(28px + (32 - 28) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2
        },
        'h3, .h3': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: "calc(24px + (26 - 24) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.25,
          fontWeight: 300
        },
        'h4, h5, .h4': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: "calc(16px + (20 - 16) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.35
        },
        '.parrafo': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: "calc(13px + (16 - 13) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2,
          fontWeight: 300,
          letterSpacing: 0.32
        },
        '.small': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: "calc(10px + (10 - 10) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2,
          fontWeight: 300,
          letterSpacing: 0.5
        },
        '.btn-font': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: "calc(13px + (16 - 13) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2,
        },
      })
    })
  ]
}

