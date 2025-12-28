// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { storyblok } from '@storyblok/astro';
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';

import { getCustomPages, createSitemapSerializer } from './src/features/sitemap/sitemap.service';

const env = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");
const storyblokToken = env.STORYBLOK_TOKEN;

// https://astro.build/config
export default defineConfig({
    site: "https://jjspscl.com",
    env: {
        validateSecrets: true,
        schema: {
            STORYBLOK_TOKEN: envField.string({
                context: "server",
                access: "secret",
                optional: false,
            }),
            TURNSTILE_SITE_KEY: envField.string({
                context: "client",
                access: "public",
                optional: false,
            }),
            TURNSTILE_SECRET_KEY: envField.string({
                context: "server",
                access: "secret",
                optional: false,
            })
        }
    },
    server: {
        allowedHosts: true,
    },

    output: "server",
    adapter: cloudflare({
        platformProxy: {
            enabled: true
        },
    }),
    prefetch: true,
    build: {
        
    },
    integrations: [
        sitemap({
            customPages: storyblokToken ? await getCustomPages(storyblokToken) : [],
            filter: (page) => !page.endsWith('/') || page === 'https://jjspscl.com/',
            serialize: storyblokToken ? createSitemapSerializer(storyblokToken) : undefined,
            changefreq: "weekly",
            priority: 0.5,
            lastmod: new Date(),
            namespaces: {
                news: false,
                video: false,
            },
        }),
        tailwind(),
        react(),
        storyblok({
            accessToken: env.STORYBLOK_TOKEN,
            livePreview: import.meta.env.MODE === "development",
            componentsDir: "src/features",
            components: {
                article: "blog/components/Blog",
                "article-tag": "blog/components/ArticleTag",
            },
            apiOptions: {
                region: "ap",
                rateLimit: 250,
            },
        }),
    ],
    vite: {
        build: {
            minify: false
        },
        resolve: {
            alias: import.meta.env.PROD ? {
                "react-dom/server": "react-dom/server.edge",
            } : {},
        },
    },
});