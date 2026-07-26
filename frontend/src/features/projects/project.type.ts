import type { SbRichTextDoc } from "@storyblok/js";

export interface IStoryblokLink {
    id?: string;
    url?: string;
    linktype?: "url" | "story" | "email" | "asset" | string;
    fieldtype?: "multilink" | string;
    cached_url?: string;
    target?: string;
}

export interface IProjectAssetRaw {
    id?: number | null;
    alt?: string | null;
    name?: string | null;
    focus?: string | null;
    title?: string | null;
    source?: string | null;
    filename?: string | null;
    copyright?: string | null;
    fieldtype?: string | null;
    meta_data?: Record<string, unknown> | null;
    is_external_url?: boolean | null;
}

export interface IProjectAssetDimensions {
    width?: number;
    height?: number;
}

export interface IProjectAsset {
    id: number;
    alt: string;
    name: string;
    focus: string;
    title: string;
    source: string;
    filename: string;
    copyright: string;
    fieldtype: string;
    meta_data: Record<string, unknown>;
    is_external_url: boolean;
    dimensions?: IProjectAssetDimensions;
}

export interface ITechTag {
    _uid: string;
    name: string;
    logo?: IProjectAssetRaw;
    source?: IStoryblokLink;
    component: "tech-stack";
}

export interface ITechTagResolved {
    uuid: string;
    slug?: string;
    content: ITechTag;
}

export interface IProjectTechnologyRaw extends ITechTag {
    _editable?: string;
}

export interface IProjectTechnologyStory {
    id?: number;
    uuid: string;
    name?: string;
    slug?: string;
    content: IProjectTechnologyRaw;
}

export interface IProjectMediaRaw {
    _uid: string;
    component: "project-media";
    media_type?: "image" | "video";
    image?: IProjectAssetRaw;
    video_url?: IStoryblokLink;
    poster_image?: IProjectAssetRaw;
    alt_text?: string;
    caption?: string;
}

export interface IProjectNarrativeSectionRaw {
    _uid: string;
    _editable?: string;
    component: "project-narrative-section";
    heading?: string;
    body?: unknown;
    media?: IProjectMediaRaw[];
}

export interface IProjectDecisionRaw {
    _uid: string;
    component: "project-decision";
    title?: string;
    context?: unknown;
    decision?: unknown;
    rationale?: unknown;
    tradeoffs?: unknown;
}

export interface IProjectMetricRaw {
    _uid: string;
    component: "project-metric";
    label?: string;
    value?: string;
    context?: string;
    source?: IStoryblokLink;
}

export interface IProjectOutcomeRaw {
    _uid: string;
    component: "project-outcome";
    title?: string;
    summary?: unknown;
    metrics?: IProjectMetricRaw[];
}

export interface IProject {
    _uid?: string;
    component: "project";
    _editable?: string;
    title?: string;
    headline?: string;
    demo_url?: string | IStoryblokLink | null;
    repository?: IStoryblokLink | null;
    technology?: Array<ITechTagResolved | IProjectTechnologyStory | IProjectTechnologyRaw | string> | null;
    cover_image?: IProjectAssetRaw | null;
    cover_alt?: string | null;
    gallery?: IProjectMediaRaw[] | null;
    project_type?: string | null;
    status?: string | null;
    started_at?: string | null;
    completed_at?: string | null;
    client?: string | null;
    role?: string | null;
    team?: string | null;
    scope?: string[] | null;
    narrative_sections?: IProjectNarrativeSectionRaw[] | null;
    decisions?: IProjectDecisionRaw[] | null;
    outcomes?: IProjectOutcomeRaw[] | null;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_image?: IProjectAssetRaw | null;
    seo_noindex?: boolean | null;
    case_study_order?: number | null;
}

export interface IProjectStory {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    full_slug: string;
    content: IProject;
    published_at?: string | null;
    first_published_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface IProjectCoverMedia {
    image?: IProjectAsset;
    altText?: string;
}

export interface IProjectLink {
    url?: string;
    cachedUrl?: string;
    linktype?: string;
    target?: string;
}

export interface IProjectMedia {
    uid: string;
    component: "project-media";
    mediaType?: "image" | "video";
    image?: IProjectAsset;
    videoUrl?: IProjectLink;
    posterImage?: IProjectAsset;
    altText?: string;
    caption?: string;
}

export interface IProjectMetadata {
    projectType?: string;
    status?: string;
    startedAt?: string;
    completedAt?: string;
    client?: string;
    role?: string;
    team?: string;
    scope: string[];
}

export interface IProjectNarrativeSection {
    uid: string;
    editable?: string;
    component: "project-narrative-section";
    heading?: string;
    body?: SbRichTextDoc;
    media?: IProjectMedia;
}

export interface IProjectDecision {
    uid: string;
    component: "project-decision";
    title?: string;
    context?: SbRichTextDoc;
    decision?: SbRichTextDoc;
    rationale?: SbRichTextDoc;
    tradeoffs?: SbRichTextDoc;
}

export interface IProjectMetric {
    uid: string;
    component: "project-metric";
    label?: string;
    value?: string;
    context?: string;
    source?: IProjectLink;
}

export interface IProjectOutcome {
    uid: string;
    component: "project-outcome";
    title?: string;
    summary?: SbRichTextDoc;
    metrics: IProjectMetric[];
}

export interface IProjectTechnology {
    uuid: string;
    slug?: string;
    name: string;
    logo?: IProjectAsset;
    source?: IProjectLink;
}

export interface IProjectSeoMetadata {
    title?: string;
    description?: string;
    image?: IProjectAsset;
    noindex: boolean;
}

export interface IProjectNavigationItem {
    title: string;
    slug: string;
    order?: number;
}

export interface IProjectNavigation {
    previous?: IProjectNavigationItem;
    next?: IProjectNavigationItem;
}

export interface IProjectDetail {
    uuid: string;
    slug: string;
    fullSlug: string;
    title: string;
    headline?: string;
    cover?: IProjectCoverMedia;
    gallery: IProjectMedia[];
    metadata: IProjectMetadata;
    narrativeSections: IProjectNarrativeSection[];
    decisions: IProjectDecision[];
    outcomes: IProjectOutcome[];
    technology: IProjectTechnology[];
    repository?: IProjectLink;
    demo?: IProjectLink;
    seo: IProjectSeoMetadata;
    navigation?: IProjectNavigation;
}

export interface IProjectCardData {
    title: string;
    headline?: string;
    demoUrl?: string;
    repositoryUrl?: string;
    technology: IProjectTechnology[];
}

export interface IProjectRecord {
    story: IProjectStory;
    detail: IProjectDetail;
    card: IProjectCardData;
}
