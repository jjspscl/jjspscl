
import { useStoryblokApi } from "@storyblok/astro";

export const storyblokApi = useStoryblokApi();

export const getStoryblokVersion = () => {
    const version = import.meta.env.DEV ? 'draft' : 'published';
    return version;
}