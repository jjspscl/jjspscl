import { getStoryblokVersion } from "@sb/storyblok.util"
import type { IBlog, IArticleTag, GetBlogPostsOptions } from "./blog.type";
import type { ISbResponses, ISbResult } from "@sb/storyblok.type";
import { getStoryblokClient } from "../storyblok/storyblok.client";

export const getBlogPosts = async (options: GetBlogPostsOptions = {}) => {
    let blogData: ISbResult<IBlog>[] = [];
    const client = getStoryblokClient();
    const res = await client.get("cdn/stories", {
        starts_with: "blog/",
        sort_by: "first_published_at:desc",
        content_type: "article",
        version: getStoryblokVersion(),
        resolve_relations: "article.tags",
    });

    const data = res.data as ISbResponses<IBlog>;
    if (data?.stories && data.stories.length > 0) {
        blogData = data.stories;
        
        if (options.tags && options.tags.length > 0) {
            const filterTags = options.tags.map(t => t.toLowerCase());
            blogData = blogData.filter(story => {
                const storyTags = story.content.tags || [];
                return storyTags.some(tag => 
                    filterTags.includes(tag.content?.title?.toLowerCase() || "")
                );
            });
        }
    }

    return blogData;
}

export const getBlogPost = async (slug: string) => {
    const client = getStoryblokClient();
    const res = await client.get(`cdn/stories/blog/${slug}`, {
        version: getStoryblokVersion(),
        resolve_relations: "article.tags",
    });

    const data = res.data;
    return data;
}

export const getAllTags = async (): Promise<ISbResult<IArticleTag>[]> => {
    const client = getStoryblokClient();
    const res = await client.get("cdn/stories", {
        starts_with: "blog/tags/",
        content_type: "article-tag",
        version: getStoryblokVersion(),
    });

    const data = res.data as ISbResponses<IArticleTag>;
    return data?.stories || [];
}
