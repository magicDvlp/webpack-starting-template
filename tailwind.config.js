const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,hbs,js,jsx,ts,tsx}"],
  safelist: [],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Museo", ...defaultTheme.fontFamily.sans],
      },
      margin: {
        column: ".625rem",
      },
      gap: {
        column: "1.25rem",
      },
      colors: {
        marigold: {
          light: "#E7BA5B",
          DEFAULT: "#E1A932",
          dark: "#B48728",
        },
      },
    },
    screens: {
      "2xl": { max: "1535px" }, // => @media (max-width: 1535px) { ... }
      xl: { max: "1279px" }, // => @media (max-width: 1279px) { ... }
      lg: { max: "1023px" }, // => @media (max-width: 1023px) { ... }
      md: { max: "767px" }, // => @media (max-width: 767px) { ... }
      sm: { max: "639px" }, // => @media (max-width: 639px) { ... }
    },
    fontSize: {
      sm: ["0.75rem", "1.33"],
      base: ["1.2rem", "1.5"],
      lg: ["1.25rem", "1.2"],
      xl: ["1.5rem", "1.33"],
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".container": {
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          "@media(min-width: calc(theme(screens[sm].max) + 1px))": {
            maxWidth: "600px",
          },
          "@media(min-width: calc(theme(screens[md].max) + 1px))": {
            maxWidth: "760px",
          },
          "@media(min-width: calc(theme(screens[lg].max) + 1px))": {
            maxWidth: "1000px",
          },
          "@media(min-width: calc(theme(screens[xl].max) + 1px))": {
            maxWidth: "1200px",
          },
          "@media(min-width: calc(theme(screens[2xl].max) + 1px))": {
            maxWidth: "1500px",
          },
        },
      });
    }),
  ],
};
