/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'custom-md': { 'max': '903px' }, // Custom breakpoint for max-width 903px
        'custom-sm': { 'max': '403px' }, // Custom breakpoint for max-width 403px
      },
      colors: {
        primary: "#F7F4ED",
      },
      boxShadow: {
        'box': '0px 2px 4px rgba(0, 0, 0, 0.18)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#F7F4ED",
          "secondary": "#E0E0E0",
          "accent": "#D0D0D0",
          "neutral": "#3D3D3D",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },
};
