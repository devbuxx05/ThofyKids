/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                accent: {
                    DEFAULT: '#F5C842',
                    dark:   '#E0B030',
                    light:   '#FDF3C0',
                },
                bg: {
                    DEFAULT: '#0F0F0F',
                    surface: '#1A1A1A',
                    elevated:'#222222',
                },
                border: {
                    DEFAULT: '#2A2A2A',
                    muted:   '#1F1F1F',
                },
                text: {
                    primary: '#F5F5F5',
                    muted:   '#888888',
                    inverse: '#0F0F0F',
                },
                success: '#25D366',
                danger:  '#E05555',
            },
            fontFamily: {
                display: ['"Syne"', 'sans-serif'],
                body:    ['"DM Sans"', 'sans-serif'],
                mono:    ['"DM Mono"', 'monospace'],
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%':   { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%':   { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                fadeIn:  'fadeIn 0.4s ease-out forwards',
                slideIn: 'slideIn 0.3s ease-out forwards',
                shimmer: 'shimmer 1.5s infinite linear',
            },
            borderRadius: {
                card: '8px',
            },
        },
    },
    plugins: [],
}