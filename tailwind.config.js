/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // <--- Adicione esta linha
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideUpAndFade: {
          "0%": { maxHeight: "200px", opacity: "1", marginBottom: "1rem" },
          "80%": { maxHeight: "200px", opacity: "0", marginBottom: "1rem" },
          "100%": {
            maxHeight: "0px",
            opacity: "0",
            marginBottom: "0px",
            padding: "0px",
            border: "0px",
          },
        },
      },
      animation: {
        "shrink-out": "slideUpAndFade 1s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
