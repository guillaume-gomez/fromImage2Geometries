/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      mytheme: {
       "primary": "#FFBE0B",
       "secondary": "#FB5607",
       "accent": "#FF006E",
       "neutral": "#8338EC",
       "base-100": "#3A86FF",
       "info": "#66C7FF",
       "success": "#87D039",
       "warning": "#E3D664",
       "error": "#FF7070",
      },
    },
  },
  plugins: [require("daisyui")],
}
