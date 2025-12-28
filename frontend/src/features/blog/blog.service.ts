import { getStoryblokVersion } from "@sb/utils"
import type { IBlog, IArticleTag } from "./blog.type";
import type { ISbResponses, ISbResult } from "@sb/storyblok.types";
import { storyBlokClient } from "../storyblok/client";

export interface GetBlogPostsOptions {
    tags?: string[];
}

export const getBlogPosts = async (options: GetBlogPostsOptions = {}) => {
    let blogData: ISbResult<IBlog>[] = [];
    const res = await storyBlokClient.get("cdn/stories", {
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
    const res = await storyBlokClient.get(`cdn/stories/blog/${slug}`, {
        version: getStoryblokVersion(),
        resolve_relations: "article.tags",
    });

    const data = res.data;
    return data;
}

export const getAllTags = async (): Promise<ISbResult<IArticleTag>[]> => {
    const res = await storyBlokClient.get("cdn/stories", {
        starts_with: "blog/tags/",
        content_type: "article-tag",
        version: getStoryblokVersion(),
    });

    const data = res.data as ISbResponses<IArticleTag>;
    return data?.stories || [];
}

export const getTagBySlug = async (slug: string) => {
    const res = await storyBlokClient.get(`cdn/stories/blog/tags/${slug}`, {
        version: getStoryblokVersion(),
    });

    return res.data;
}