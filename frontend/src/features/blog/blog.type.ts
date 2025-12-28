import type { ITag, ITagAsset, ITagResolved, TagColor } from "@lib/tag";
import { TAG_COLORS, getTagColor } from "@lib/tag";

export interface IArticleTag extends ITag {
    icon: ITagAsset;
    component: "article-tag";
}

export type IArticleTagResolved = ITagResolved<IArticleTag>;

export type { ITagAsset as IStoryblokAsset, TagColor };

export interface IBlog {
    title: string;
    headline: string;
    content: unknown;
    tags: IArticleTagResolved[];
}

export { TAG_COLORS, getTagColor };