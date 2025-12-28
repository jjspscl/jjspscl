import type { ITagAsset } from "@lib/tag";

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
    technology: ITechTagResolved[];
}