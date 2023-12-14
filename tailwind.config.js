const plugin = require('tailwindcss/plugin')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-gray': 'linear-gradient(180deg,#ffffff 0%,#F2ECFF 100%,#FFFFFF 69.56261626455561%)'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '0.5rem',
          sm: '2rem',
          lg: '3rem',
          xl: '5rem',
          '2xl': '6rem',
        }
      },
      colors: {
        "primary": "#060097",
        "secondary": "#8b5cf6",
        "accent": "#fdfcff",
        "neutral": "#0d0c22",
        "base-100": "#67768e",
        "base-200": "#5e6067",
        "white": "#ffffff"
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        'h1, .h1': {
          fontFamily: 'Poppins, sans-serif',
          fontSize: "calc(38px + (64 - 38) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2,
          fontWeight: 600,
        },
        'h2, .h2': {
          fontFamily: 'Poppins, sans-serif',
          fontSize: "calc(28px + (40 - 28) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2,
          fontWeight: 600
        },
        'h3, .h3': {
          fontFamily: 'Poppins, sans-serif',
          fontSize: "calc(20px + (26 - 20) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.25,
          fontWeight: 500
        },
        'h4, h5, .h4': {
          fontFamily: 'Poppins, sans-serif',
          fontSize: "calc(16px + (18 - 16) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2
        },
        '.parrafo': {
          fontFamily: 'Poppins, sans-serif',
          fontSize: "calc(15px + (16 - 15) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.4,
          fontWeight: 300,
          letterSpacing: 0.32
        },
        '.small': {
          fontFamily: 'Poppins, sans-serif',
          fontSize: "calc(12px + (14 - 12) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2,
          fontWeight: 600,
          letterSpacing: 0.5
        },
        '.btn-font': {
          fontFamily: 'Poppins, sans-serif',
          fontSize: "calc(13px + (16 - 13) * ((100vw - 300px) / (2300 - 300)))",
          lineHeight: 1.2,
          fontWeight: 600
        },
      })
    })
  ]
}

