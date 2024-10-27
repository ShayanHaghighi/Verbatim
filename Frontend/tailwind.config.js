/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bkg: "rgb(var(--color-bkg) / <alpha-value>)",
        notbkg: "rgb(var(--color-notbkg) / <alpha-value>)",
        purple: "rgb(var(--color-purple) / <alpha-value>)",
        wht: "rgb(var(--color-wht) / <alpha-value>)",
        blk: "rgb(var(--color-blk) / <alpha-value>)",
        darkpurple: "rgb(var(--color-darkpurple) / <alpha-value>)",
        lightpurple: "rgb(var(--color-lightpurple) / <alpha-value>)",
        accent1: "rgb(var(--color-accent1) / <alpha-value>)",
        accent2: "rgb(var(--color-accent2) / <alpha-value>)",
        gray: "rgb(var(--color-gray) / <alpha-value>)",
        whtpp: "rgb(var(--color-whtpp) / <alpha-value>)",
        whtdarkpp: "rgb(var(--color-whtdarkpp) / <alpha-value>)",
        ppwht: "rgb(var(--color-ppwht) / <alpha-value>)",
        optionbg: "rgb(var(--color-optionbg) / <alpha-value>)",
        optionlight: "rgb(var(--color-optionlight) / <alpha-value>)",
      },
    },
    fontFamily: {
      josefin: ['"Josefin Sans"', "Helvetica", "system-ui"],
      indie: ['"Indie Flower","Josefin Sans"', "Helvetica", "system-ui"],
      rubik: ['"Rubik Mono One","Josefin Sans"', "Helvetica", "system-ui"],
    },
  },
  plugins: [],
};
