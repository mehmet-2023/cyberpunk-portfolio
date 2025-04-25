/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'neon-pink': '#FF6EC7',
          'neon-cyan': '#00FFFF',
          'neon-glow': '#1a1a2e',
        },
        dropShadow: {
          neon: "0 0 10px #FF6EC7",
        },
      },
    },
    plugins: [],
  }
  