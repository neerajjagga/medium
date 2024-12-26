/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "904px",
        xl: "1440px",
      },
      colors: {
        primary: "#F7F4ED",
      },
      boxShadow: {
        'box': '0px 2px 4px rgba(0, 0, 0, 0.18)',
      }
    },
  },
  plugins: [require('daisyui')],
};
