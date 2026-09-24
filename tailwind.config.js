/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0E14",
        neonCyan: "#00FFFF",
        neonPurple: "#8A2BE2",
      },
      fontFamily: {
        mono: ['"Roboto Mono"', 'Orbitron', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 255, 255, 0.3)',
        'neon-purple': '0 0 15px rgba(138, 43, 226, 0.3)',
      }
    },
  },
  plugins: [],
}
