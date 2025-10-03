import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#ff00e1",
        secondary: "#f8b300",
        background: "#212227",
        light: "#f4f4f4",
        black: "#000",
        white: "#fff",
        notecolors1: "#fceda1",
        notecolors2: "#b3ff8d",
        notecolors3: "#82d2f4",
        notecolors4: "#fd9aff",
        notecolors5: "#ff7e7e",
        notecolorlight1: "#fff6ca",
        notecolorlight2: "#d0fcba",
        notecolorlight3: "#b2eefd",
        notecolorlight4: "#e4bce5",
        notecolorlight5: "#ffb3b3",
      },
      fontFamily: {
        bricolage: ["var(--font-bricolage)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
      boxShadow: {
        nav: "0 2px 10px rgba(255, 255, 255, 0.1)",
        navLight: "0 2px 10px rgba(0, 0, 0, 0.1)",
        modal: "0 5px 15px rgba(0,0,0,0.3)",
      },
      transitionTimingFunction: {
        regular: "ease",
      },
      keyframes: {
        delete: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0)", opacity: "0" },
        },
      },
      animation: {
        delete: "delete 0.6s forwards",
      },
    },
  },
  plugins: [],
};
export default config;
