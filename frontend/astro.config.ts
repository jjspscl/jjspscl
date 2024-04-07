import { defineConfig } from 'astro/config';
import basicSsl from '@vitejs/plugin-basic-ssl'
import sitemap from '@astrojs/sitemap';
import storyblok from '@storyblok/astro';
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";

import { loadEnv } from 'vite';

const env = loadEnv("", process.cwd(), ['STORYBLOK']);
// https://astro.build/config
export default defineConfig({
  site: 'https://jjspscl.com',
  output: "hybrid",
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),
  prefetch: true,
  vite: {
    // plugins: [
    //   basicSsl()
    // ],
    // server: {
    //   https: true
    // },
    build: {
      minify: true,
    }
  },
  i18n: {
    locales: ['en', 'en-ph'],
    defaultLocale: 'en',
  },
  integrations: [
    sitemap(), 
    vue(),
    tailwind({
      applyBaseStyles: false,
    }),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      components: {
        'article': "components/storyblok/blog/Article",
      },
      apiOptions: {
        region: 'ap'
      }
  })]
});
