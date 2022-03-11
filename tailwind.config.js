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
      fontSize: {
        "2xs": ["0.6rem", { lineHeight: "1" }],
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5715" }],
        base: ["1rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        lg: ["1.125rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
        "3xl": ["1.88rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
        "4xl": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      height: {
        128: "40rem",
      },
      transitionProperty: {
        width: "width",
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
