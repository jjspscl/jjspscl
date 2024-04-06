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
  output: "server",
  adapter: cloudflare(),
  vite: {
    plugins: [
      basicSsl()
    ],
    server: {
      https: true
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
        accessToken: 'Nky702assFDlL2pvSZEIhAtt',
        components: {
          'article': "components/storyblok/Article",
        }
  })]
});