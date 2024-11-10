/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['media', 'selector'],
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                "vhs": {
                    "black": "var(--color-black)",
                    "cream": "var(--color-cream)",
                    "grey": "var(--color-grey)",
                    "red": "var(--color-red)",
                    "yellow": "var(--color-yellow)",
                    "green": "var(--color-green)",
                    "blue": "var(--color-blue)",
                }
            }
        },
    },
    plugins: [],
};
