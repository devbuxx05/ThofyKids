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
                    DEFAULT: '#C98B8B',
                    light: '#E8BFBF',
                    dark: '#A06060',
                },
                cream: {
                    DEFAULT: '#FAF7F3',
                    dark: '#F0EAE0',
                },
                slate: {
                    brand: '#3D3535',
                }
            },
            fontFamily: {
                display: ['"Playfair Display"', 'serif'],
                body: ['Inter', 'sans-serif'],
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
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.4s ease-out forwards',
                slideIn: 'slideIn 0.3s ease-out forwards',
                shimmer: 'shimmer 1.5s infinite linear',
            }
        },
    },
    plugins: [],
}
