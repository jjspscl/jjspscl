import typography from '@tailwindcss/typography';

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
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        code: {
                            backgroundColor: theme('colors.gray.100'),
                            borderRadius: theme('borderRadius.md'),
                            paddingTop: theme('spacing.1'),
                            paddingBottom: theme('spacing.1'),
                            paddingLeft: theme('spacing.1'),
                            paddingRight: theme('spacing.1'),
                            fontWeight: '400',
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                        pre: {
                            backgroundColor: '#1e1e1e',
                            color: '#d4d4d4',
                            borderRadius: theme('borderRadius.lg'),
                            padding: theme('spacing.4'),
                            overflowX: 'auto',
                        },
                        'pre code': {
                            backgroundColor: 'transparent',
                            borderRadius: '0',
                            padding: '0',
                            fontWeight: '400',
                            color: 'inherit',
                            fontSize: 'inherit',
                            fontFamily: 'inherit',
                            lineHeight: 'inherit',
                        },
                    },
                },
                invert: {
                    css: {
                        code: {
                            backgroundColor: theme('colors.gray.800'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [typography],
};
