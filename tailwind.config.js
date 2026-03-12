/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Thofy Kids dark palette
                bg: '#0F0F0F',
                surface: '#1A1A1A',
                border: '#2A2A2A',
                accent: {
                    DEFAULT: '#F5C842',
                    hover: '#E0B030',
                },
                'text-primary': '#F5F5F5',
                'text-muted': '#888888',
                success: '#25D366',
                danger: '#E05555',
                'admin-bg': '#111111',
            },
            fontFamily: {
                display: ['Syne', 'sans-serif'],
                body: ['"DM Sans"', 'sans-serif'],
                mono: ['"DM Mono"', 'monospace'],
            },
            borderRadius: {
                card: '8px',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.4s ease-out forwards',
                slideIn: 'slideIn 0.3s ease-out forwards',
                shimmer: 'shimmer 1.5s infinite linear',
            },
            transitionDuration: {
                hover: '200ms',
            },
        },
    },
    plugins: [],
}
