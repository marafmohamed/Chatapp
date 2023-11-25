/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {

    },
    fontFamily:{
      Parr:['Quicksand'],
      Chat:['Archivo Black'],
      paragraph:['Source Sans 3'],
    },
  },
  plugins: [require("daisyui")],
}

