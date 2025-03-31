import StoryblokClient from "storyblok-js-client";
import { getSecret } from "astro:env/server";

export const storyBlokClient = (() => {
    const client = new StoryblokClient({
        accessToken: getSecret("STORYBLOK_TOKEN"),
        region: "ap",
        rateLimit: 250,
    });

    return client;
})()