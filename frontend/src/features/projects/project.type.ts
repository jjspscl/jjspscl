import type { ITagAsset } from "@lib/tag";

export interface IStoryblokLink {
    id: string;
    url: string;
    linktype: "url" | "story" | "email" | "asset";
    fieldtype: "multilink";
    cached_url: string;
}

export interface ITechTag {
    _uid: string;
    name: string;
    logo: ITagAsset;
    component: "tech-stack";
}

export interface ITechTagResolved {
    uuid: string;
    slug: string;
    content: ITechTag;
}

export interface IProject {
    title: string;
    headline: string;
    demo_url: string;
    repository: IStoryblokLink;
    technology: ITechTagResolved[];
}