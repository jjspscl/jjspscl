import { defineConfig } from 'astro/config';
import basicSsl from '@vitejs/plugin-basic-ssl'
import sitemap from '@astrojs/sitemap';
import storyblok from '@storyblok/astro';
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: 'https://jjspscl.com',
  output: "hybrid",
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),
  vite: {
    plugins: [
      basicSsl()
    ],
    server: {
      https: true
    },
    build: {
      minify: true,
    }
  },
  i18n: {
    locales: ['en', 'tl'],
    defaultLocale: 'tl'
  },
  integrations: [
    sitemap(), 
    vue(),
    tailwind({
      applyBaseStyles: true,
    }),
    storyblok({
        accessToken: import.meta.env.PUBLIC_STORYBLOK_TOKEN,
        components: {
          'article': "components/storyblok/Article",
        }
  })]
});