// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// 





const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your custom Tailwind CSS theme extensions go here
      colors: {
        // Example: Adding a custom color
        // customColor: '#999999',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), require('tailwind-scrollbar')]
}

// import {heroui} = require("@heroui/react");
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}", // Your app files
//     "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}", // HeroUI components
//   ],
//   theme: {
//     extend: {
//       // Custom theme extensions here
//       colors: {
//         // Example: custom colors
//         // primary: '#1E90FF',
//       },
//     },
//   },
//   darkMode: "class",
//   plugins: [
//     require("@heroui/react"), // ✅ HeroUI plugin
//     require("tailwind-scrollbar"), // Optional
//   ],
// }

