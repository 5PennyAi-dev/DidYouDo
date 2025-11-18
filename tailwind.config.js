/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',        // Orange principal
        'primary-light': '#FFB380', // Orange clair
        'primary-dark': '#E85A2B',  // Orange foncé
        cream: '#FFFDF7',           // Fond crème
        text: '#2D3142',            // Texte principal

        // Priorités des tâches
        priority: {
          high: '#EF4444',     // Rouge
          medium: '#FBBF24',   // Jaune
          low: '#10B981',      // Vert
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen',
               'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
               'sans-serif'],
      },
    },
  },
  plugins: [],
}
