/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,tsx,vue}'],
  theme: {
    container: {
      padding: {
        DEFAULT: "4rem"
      }
    },
    extend: {
      fontFamily: {
        kagitingan: ['Kagitingan'],
        maragsa: ['Maragsa'],
        quiapo: ['Quiapo'],
      },
			colors: {
				'pinoy': {
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
          },
          "cream": "#FAE4BB",
          "cream": {
            400: "#FCE8B3",
            500: "#FAE4BB",
            600: "#F9E2C0"
          }
				}
			}
		},
  },
  plugins: [],
}

