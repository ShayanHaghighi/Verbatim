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
        accent1: "rgb(var(--color-accent1) / <alpha-value>)",
        accent2: "rgb(var(--color-accent2) / <alpha-value>)",
      },
    },
    fontFamily: {
      jockey: ['"Jockey One"', "Inter", "system-ui"],
    },
  },
  plugins: [],
};
