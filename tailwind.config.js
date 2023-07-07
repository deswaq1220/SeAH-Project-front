/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'seahColor' :'#e64d2c',
        'seahDeep' : '#d82800'
      },
      spacing :{
        '1200' : '1200px'
      }
    },
  },
  plugins: [],
}

