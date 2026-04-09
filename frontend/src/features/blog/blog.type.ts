import type { SbBlokData, StoryblokRichTextNode } from "@storyblok/js";
import type { ITag, ITagAsset, ITagResolved } from "@lib/tag";

export interface IArticleTag extends ITag {
    icon: ITagAsset;
    component: "article-tag";
}

export type IArticleTagResolved = ITagResolved<IArticleTag>;

export interface IBlog {
    title: string;
    headline: string;
    content: unknown;
    tags: IArticleTagResolved[];
}

export interface IArticleBlok extends SbBlokData {
    title: string;
    subtitle: string;
    content: StoryblokRichTextNode<string>;
    tags: IArticleTagResolved[];
    created_at: string;
}

export interface GetBlogPostsOptions {
    tags?: string[];
}