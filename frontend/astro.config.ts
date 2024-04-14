import { defineConfig } from 'astro/config';
// import basicSsl from '@vitejs/plugin-basic-ssl'
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
  output: "server",
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
    },
    ssr: {
      target: 'webworker'
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
      accessToken: env.STORYBLOK_TOKEN as string,
      components: {
        'article': "storyblok/blog/Article",
        'all-articles': "storyblok/blog/AllArticle",
        'all-work': "storyblok/work/AllWork",
        'landing': "storyblok/Landing",
      },
      apiOptions: {
        region: 'ap',
        rateLimit: 250
      }
  })]
});
