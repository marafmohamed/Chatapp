/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridRow: {
        'span-12': 'span 12 / span 12',
        'span-9': 'span 1 / span 9',
      },
      colors: {
        'bubble': '#0A7CFF',
      },
    
    },
    fontFamily:{
      Parr:['Quicksand'],
      Chat:['Archivo Black'],
      paragraph:['Source Sans 3'],
    },
  },
  plugins: [require("daisyui")],
}

