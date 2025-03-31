// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { storyblok } from '@storyblok/astro';
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
const env = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
    site: "https://jjspscl.com",
    env: {
        schema: {
            STORYBLOK_TOKEN: envField.string({
                context: "server",
                access: "secret",
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
        tailwind(),
        react(),
        storyblok({
            accessToken: env.STORYBLOK_TOKEN,
            livePreview: import.meta.env.MODE === "development",
            componentsDir: "src/features",
            components: {
                article: "blog/components/Blog",
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