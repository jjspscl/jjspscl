import type { SitemapItem } from "@astrojs/sitemap";
import { EnumChangefreq } from "sitemap";
import StoryblokClient from "storyblok-js-client";
import { SITE_URL } from "../seo/seo.constant";

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

interface ProjectStoryblokStory extends StoryblokStory {
    slug: string;
    content?: {
        component?: string;
        seo_noindex?: boolean;
    };
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

const normalizeLastmod = (value?: string | null): string | undefined => {
    if (!value || !Number.isFinite(Date.parse(value))) {
        return undefined;
    }
    return value;
};

const getResponseTotal = (response: { total?: unknown; headers?: unknown }): number | undefined => {
    if (typeof response.total === "number") {
        return response.total;
    }
    if (response.headers instanceof Headers) {
        const value = Number(response.headers.get("total"));
        return Number.isFinite(value) ? value : undefined;
    }
    if (typeof response.headers === "object" && response.headers !== null && "total" in response.headers) {
        const value = Number(response.headers.total);
        return Number.isFinite(value) ? value : undefined;
    }
    return undefined;
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
        lastmod: normalizeLastmod(story.published_at || story.first_published_at),
    }));
};

const getProjectSlugs = async (client: StoryblokClient): Promise<SitemapEntry[]> => {
    const stories: ProjectStoryblokStory[] = [];
    let page = 1;
    let total = 0;

    while (page === 1 || stories.length < total) {
        const response = await client.get("cdn/stories", {
            starts_with: "projects/",
            content_type: "project",
            version: "published",
            page,
            per_page: 100,
        });
        const data = response.data as StoryblokResponse;
        const pageStories = (data?.stories || []) as ProjectStoryblokStory[];
        stories.push(...pageStories.filter((story) =>
            story.content?.component === "project" &&
            story.content.seo_noindex !== true &&
            !story.slug.includes("/") &&
            story.full_slug === `projects/${story.slug}`
        ));
        const responseTotal = getResponseTotal(response) ?? 0;
        total = responseTotal > 0 ? responseTotal : stories.length;
        if (pageStories.length === 0) {
            break;
        }
        page += 1;
    }

    return stories.map((story) => ({
        url: `${SITE_URL}/${story.full_slug}`,
        lastmod: normalizeLastmod(story.published_at || story.first_published_at),
    }));
};

export const getSitemapEntries = async (storyblokToken: string): Promise<SitemapEntry[]> => {
    const client = createBuildTimeClient(storyblokToken);

    const staticEntries: SitemapEntry[] = STATIC_PAGES.map((page) => ({
        url: `${SITE_URL}${page}`,
    }));

    try {
        const blogEntries = await getBlogSlugs(client);
        const projectEntries = await getProjectSlugs(client);
        return [...staticEntries, ...blogEntries, ...projectEntries];
    } catch (error: unknown) {
        console.error("Failed to fetch dynamic sitemap entries", error);
        return staticEntries;
    }
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
        if (entry?.lastmod && Number.isFinite(Date.parse(entry.lastmod))) {
            item.lastmod = new Date(entry.lastmod).toISOString();
        }

        if (item.url.includes("/blog/") && !item.url.endsWith("/blog/tags")) {
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
