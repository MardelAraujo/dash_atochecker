/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                premium: {
                    magenta: '#FF0057',
                    purple: '#8B0E7A',
                    deep: '#050014', // Darker deep for better contrast
                    dark: '#0A0A0C', // Darker background
                    gray: '#1F1F22',
                    light: '#E5E5E5',
                    border: '#2A2A2E',
                    neon: '#FF0057', // Main neon color
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon': '0 0 10px rgba(255, 0, 87, 0.5), 0 0 20px rgba(255, 0, 87, 0.3)',
                'neon-hover': '0 0 15px rgba(255, 0, 87, 0.7), 0 0 30px rgba(255, 0, 87, 0.5)',
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
}
