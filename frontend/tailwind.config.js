/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Activation du mode sombre via la classe 'dark'
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6', // blue-500
                secondary: '#64748b', // slate-500
                danger: '#ef4444', // red-500
                success: '#22c55e', // green-500
                warning: '#eab308', // yellow-500
                background: '#f8fafc', // slate-50
                surface: '#ffffff',
                'dark-background': '#0f172a', // slate-900
                'dark-surface': '#1e293b', // slate-800
            }
        },
    },
    plugins: [],
}
