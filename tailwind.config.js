import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'fira-sans-condensed':['Fira Sans Extra Condensed','sans-serif']
      },
      boxShadow: {
        'colored': '0px 4px 10px rgba(120, 0, 0, 0.5)', 
      },
      animation: {
        'gleam': 'gleam 2s infinite alternate'
      },
      keyframes: {
        'gleam': {
          '0%': { backgroundPosition: '-200% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
      },
    },
  },
  plugins: [
    daisyui,
  ],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#FDF0D5",
          secondary: "#C1121F",
          accent: "#003049",
          neutral: "#669BBC",
          "base-100": "#ffffff",
        },
      },
    ],
  },
  
}