import { heroui } from "@heroui/react";
import scrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
  extend: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
  },
},
  darkMode: "class",
  plugins: [heroui(), scrollbar],
};
