import type { SitemapItem } from "@astrojs/sitemap";
import { EnumChangefreq } from "sitemap";
import StoryblokClient from "storyblok-js-client";

const SITE_URL = "https://jjspscl.com";

const STATIC_PAGES = [
    "/",
    "/about",
    "/blog",
    "/blog/tags",
    "/contact",
    "/projects",
];

interface StoryblokStory {
    full_slug: string;
    published_at: string;
    first_published_at: string;
}

interface StoryblokResponse {
    stories: StoryblokStory[];
}

export interface SitemapEntry {
    url: string;
    lastmod?: string;
}

const createBuildTimeClient = (accessToken: string) => {
    return new StoryblokClient({
        accessToken,
        region: "ap",
        rateLimit: 250,
    });
};

const getBlogSlugs = async (client: StoryblokClient): Promise<SitemapEntry[]> => {
    const res = await client.get("cdn/stories", {
        starts_with: "blog/",
        content_type: "article",
        version: "published",
        excluding_slugs: "blog/tags/*",
    });

    const data = res.data as StoryblokResponse;
    return (data?.stories || []).map((story) => ({
        url: `${SITE_URL}/${story.full_slug}`,
        lastmod: story.published_at || story.first_published_at,
    }));
};

const getTagSlugs = async (client: StoryblokClient): Promise<SitemapEntry[]> => {
    const res = await client.get("cdn/stories", {
        starts_with: "blog/tags/",
        content_type: "article-tag",
        version: "published",
    });

    const data = res.data as StoryblokResponse;
    return (data?.stories || []).map((story) => ({
        url: `${SITE_URL}/${story.full_slug}`,
        lastmod: story.published_at || story.first_published_at,
    }));
};

const getProjectSlugs = async (client: StoryblokClient): Promise<SitemapEntry[]> => {
    const res = await client.get("cdn/stories", {
        starts_with: "projects/",
        content_type: "project",
        version: "published",
    });

    const data = res.data as StoryblokResponse;
    return (data?.stories || []).map((story) => ({
        url: `${SITE_URL}/${story.full_slug}`,
        lastmod: story.published_at || story.first_published_at,
    }));
};

export const getSitemapEntries = async (storyblokToken: string): Promise<SitemapEntry[]> => {
    const client = createBuildTimeClient(storyblokToken);

    const staticEntries: SitemapEntry[] = STATIC_PAGES.map((page) => ({
        url: `${SITE_URL}${page}`,
    }));

    const [blogEntries, tagEntries, projectEntries] = await Promise.all([
        getBlogSlugs(client),
        getTagSlugs(client),
        getProjectSlugs(client),
    ]);

    return [...staticEntries, ...blogEntries, ...tagEntries, ...projectEntries];
};

export const getCustomPages = async (storyblokToken: string): Promise<string[]> => {
    const entries = await getSitemapEntries(storyblokToken);
    return entries.map((entry) => entry.url);
};

export const createSitemapSerializer = (storyblokToken: string) => {
    let entriesCache: Map<string, SitemapEntry> | null = null;

    return async (item: SitemapItem): Promise<SitemapItem> => {
        if (!entriesCache) {
            const entries = await getSitemapEntries(storyblokToken);
            entriesCache = new Map(entries.map((e) => [e.url, e]));
        }

        const entry = entriesCache.get(item.url);
        if (entry?.lastmod) {
            item.lastmod = new Date(entry.lastmod).toISOString();
        }

        if (item.url.includes("/blog/") && !item.url.includes("/tags/")) {
            item.changefreq = EnumChangefreq.MONTHLY;
            item.priority = 0.8;
        } else if (item.url.includes("/projects/")) {
            item.changefreq = EnumChangefreq.MONTHLY;
            item.priority = 0.7;
        } else if (item.url === `${SITE_URL}/` || item.url === `${SITE_URL}/blog`) {
            item.changefreq = EnumChangefreq.WEEKLY;
            item.priority = 1.0;
        }

        return item;
    };
};
