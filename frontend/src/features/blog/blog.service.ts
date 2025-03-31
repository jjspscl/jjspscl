import { getStoryblokVersion } from "@sb/utils"
import type { IBlog } from "./blog.type";
import type { ISbResponses, ISbResult } from "@sb/storyblok.types";
import { storyBlokClient } from "../storyblok/client";

export const getBlogPosts = async () => {
    let blogData: ISbResult<IBlog>[] = [];
    const res = await storyBlokClient.get("cdn/stories", {
        starts_with: "blog/",
        sort_by: "first_published_at:desc",
        content_type: "article",
        version: getStoryblokVersion(),
    });

    const data = res.data as ISbResponses<IBlog>;
    if (data?.stories && data.stories.length > 0) {
        blogData = data.stories;
    }

    return blogData;
}

export const getBlogPost = async (slug: string) => {
    const res = await storyBlokClient.get(`cdn/stories/blog/${slug}`, {
        version: getStoryblokVersion(),
    });

    const data = res.data;
    return data;
}