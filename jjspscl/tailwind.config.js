/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
			colors: {
				'pinoy': {
          // '#354739'
					'green': {
            50: '#f0f7f0',
            100: '#f0f7f0',
            200: '#f0f7f0',
            300: '#d1e7d3',
            400: '#4a5d4d',
            500: '#354739',
            600: '#2d3a2e',
            700: '#26312a',
          },
          'blacked': {
            300: '#333333',
            400: '#262626',
            500: '#191919',
            600: '#121212',
            700: '#0b0b0b',
          }
				}
			}
		},
  },
  plugins: [],
}

