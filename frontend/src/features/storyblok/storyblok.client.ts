import StoryblokClient from "storyblok-js-client";
import { getSecret } from "astro:env/server";

export function getStoryblokClient(): StoryblokClient {
  return new StoryblokClient({
    accessToken: getSecret("STORYBLOK_TOKEN"),
    region: "ap",
    rateLimit: 250,
  });
}
