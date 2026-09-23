import { z } from "zod";

const richTextSchema = z.object({
    type: z.literal("doc"),
    content: z.array(z.unknown()),
}).passthrough();

export const projectAssetSchema = z.object({
    id: z.number().nullish(),
    alt: z.string().nullish(),
    name: z.string().nullish(),
    focus: z.string().nullish(),
    title: z.string().nullish(),
    source: z.string().nullish(),
    filename: z.string().nullish(),
    copyright: z.string().nullish(),
    fieldtype: z.string().nullish(),
    meta_data: z.record(z.string(), z.unknown()).nullish(),
    is_external_url: z.boolean().nullish(),
}).passthrough();

export const storyblokLinkSchema = z.object({
    id: z.string().optional(),
    url: z.string().optional(),
    linktype: z.string().optional(),
    fieldtype: z.string().optional(),
    cached_url: z.string().optional(),
    target: z.string().optional(),
}).passthrough();

export const projectMediaSchema = z.object({
    _uid: z.string(),
    component: z.literal("project-media"),
    media_type: z.enum(["image", "video"]).optional(),
    image: projectAssetSchema.optional(),
    video_url: storyblokLinkSchema.optional(),
    poster_image: projectAssetSchema.optional(),
    alt_text: z.string().optional(),
    caption: z.string().optional(),
}).passthrough();

export const projectNarrativeSectionSchema = z.object({
    _uid: z.string(),
    _editable: z.string().optional(),
    component: z.literal("project-narrative-section"),
    heading: z.string().optional(),
    body: richTextSchema.optional(),
    media: z.array(projectMediaSchema).optional(),
}).passthrough();

export const projectDecisionSchema = z.object({
    _uid: z.string(),
    component: z.literal("project-decision"),
    title: z.string().optional(),
    context: richTextSchema.optional(),
    decision: richTextSchema.optional(),
    rationale: richTextSchema.optional(),
    tradeoffs: richTextSchema.optional(),
}).passthrough();

export const projectMetricSchema = z.object({
    _uid: z.string(),
    component: z.literal("project-metric"),
    label: z.string().optional(),
    value: z.string().optional(),
    context: z.string().optional(),
    source: storyblokLinkSchema.optional(),
}).passthrough();

export const projectOutcomeSchema = z.object({
    _uid: z.string(),
    component: z.literal("project-outcome"),
    title: z.string().optional(),
    summary: richTextSchema.optional(),
    metrics: z.array(projectMetricSchema).optional(),
}).passthrough();

export const projectTechnologySchema = z.object({
    _uid: z.string(),
    component: z.literal("tech-stack"),
    name: z.string().min(1),
    logo: projectAssetSchema.optional(),
    source: storyblokLinkSchema.optional(),
    _editable: z.string().optional(),
}).passthrough();

const projectRelationSchema = z.object({
    uuid: z.string().min(1),
    slug: z.string().optional(),
    content: projectTechnologySchema,
}).passthrough();

export const projectContentSchema = z.object({
    _uid: z.string().optional(),
    component: z.literal("project"),
    _editable: z.string().optional(),
    title: z.string().optional(),
    headline: z.string().optional(),
    demo_url: z.union([z.string(), storyblokLinkSchema]).nullable().optional(),
    repository: storyblokLinkSchema.nullable().optional(),
    technology: z.array(z.union([projectRelationSchema, z.string(), projectTechnologySchema])).nullable().optional(),
    cover_image: projectAssetSchema.nullable().optional(),
    cover_alt: z.string().nullable().optional(),
    gallery: z.array(projectMediaSchema).nullable().optional(),
    project_type: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    started_at: z.string().nullable().optional(),
    completed_at: z.string().nullable().optional(),
    client: z.string().nullable().optional(),
    role: z.string().nullable().optional(),
    team: z.string().nullable().optional(),
    scope: z.array(z.string()).nullable().optional(),
    narrative_sections: z.array(projectNarrativeSectionSchema).nullable().optional(),
    decisions: z.array(projectDecisionSchema).nullable().optional(),
    outcomes: z.array(projectOutcomeSchema).nullable().optional(),
    seo_title: z.string().nullable().optional(),
    seo_description: z.string().nullable().optional(),
    seo_image: projectAssetSchema.nullable().optional(),
    seo_noindex: z.boolean().nullable().optional(),
    case_study_order: z.number().nullable().optional(),
}).passthrough();

export const projectStorySchema = z.object({
    id: z.number(),
    uuid: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
    full_slug: z.string().min(1),
    content: projectContentSchema,
    published_at: z.string().nullable().optional(),
    first_published_at: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
}).passthrough();

export const projectCollectionResponseSchema = z.object({
    stories: z.array(z.unknown()),
}).passthrough();

export const projectRelationResponseSchema = z.object({
    stories: z.array(projectStorySchema).optional(),
    rels: z.array(z.unknown()).optional(),
    rel_uuids: z.array(z.string()).optional(),
}).passthrough();

export type ProjectContentInput = z.input<typeof projectContentSchema>;
export type ProjectStoryInput = z.input<typeof projectStorySchema>;
