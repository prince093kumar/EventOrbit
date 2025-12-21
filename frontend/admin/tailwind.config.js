/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                slate: {
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                    50: '#f8fafc',
                    // Add other slate colors as needed or rely on default
                },
                violet: {
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                }
            }
        },
    },
    plugins: [],
}
