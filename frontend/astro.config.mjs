// @ts-check
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import storyblok from '@storyblok/astro';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), ['STORYBLOK']);

// https://astro.build/config
export default defineConfig({
    site: 'https://jjspscl.com',
    output: "server",
    prefetch: true,
    integrations: [
        tailwind(), 
        react(),
        storyblok({
            accessToken: env.STORYBLOK_TOKEN,
            livePreview: import.meta.env.MODE === 'development',
            componentsDir: 'src/features',
            components: {
                'article': "blog/components/Blog",
            },
            apiOptions: {
                region: 'ap',
                rateLimit: 250
            }
        })
    ]
});