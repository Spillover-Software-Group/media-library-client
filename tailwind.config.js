module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./dummy/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        robotoCondensed: ["Roboto Condensed", "sans-serif"],
      },
      colors: {
        spillover: {
          color1: "#000000", // Black
          color2: "#561513", // Red
          color3: "#AFB7BC", // Gray
          color4: "#0E7F82", // Green
          color5: "#561713", // Red
          color6: "#666666", // Gray
          color7: "#DDDDDD", // LighGray
          color8: "#047E82", // Green
          color9: "#F57200", // Orange
          color10: "#222222", // OffBlack
          color11: "#A71E22", // Red Spillover
        },
      },
    },
  },
  plugins: [],
};
