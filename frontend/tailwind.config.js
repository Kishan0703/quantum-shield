/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0a0e1a',
        'panel': '#111827',
        'panel-light': '#1f2937',
        'red-team': '#ef4444',
        'blue-team': '#3b82f6',
        'amber-warn': '#f59e0b',
        'green-ok': '#10b981',
      },
    },
  },
  plugins: [],
}
