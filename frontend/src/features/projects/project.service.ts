import type StoryblokClient from "storyblok-js-client";
import type { SbRichTextDoc } from "@storyblok/js";
import { getStoryblokClient } from "../storyblok/storyblok.client";
import { getStoryblokVersion } from "../storyblok/storyblok.util";
import {
    projectCollectionResponseSchema,
    projectContentSchema,
    projectDecisionSchema,
    projectMediaSchema,
    projectNarrativeSectionSchema,
    projectOutcomeSchema,
    projectStorySchema,
    projectTechnologySchema,
    storyblokLinkSchema,
} from "./project.schema";
import type {
    IProject,
    IProjectAsset,
    IProjectAssetRaw,
    IProjectCardData,
    IProjectCoverMedia,
    IProjectDecision,
    IProjectDetail,
    IProjectLink,
    IProjectMedia,
    IProjectMetadata,
    IProjectNavigation,
    IProjectNavigationItem,
    IProjectNarrativeSection,
    IProjectOutcome,
    IProjectRecord,
    IProjectStory,
    IProjectTechnology,
    IProjectTechnologyStory,
} from "./project.type";

const PROJECT_PATH = "projects/";
const PROJECT_CONTENT_TYPE = "project";
const RELATION_FIELD = "project.technology";
const PAGE_SIZE = 100;
const RELATION_BATCH_SIZE = 50;

export const PROJECT_SERVICE_ERROR = {
    NOT_FOUND: "not_found",
    VALIDATION: "validation_error",
    RATE_LIMIT: "rate_limit",
    AVAILABILITY: "availability_error",
} as const;

interface ProjectErrorBase {
    operation: "list" | "detail" | "relations";
    storyUuid?: string;
    slug?: string;
    cause?: unknown;
}

export interface ProjectNotFoundError extends ProjectErrorBase {
    code: typeof PROJECT_SERVICE_ERROR.NOT_FOUND;
    status: 404;
}

export interface ProjectValidationError extends ProjectErrorBase {
    code: typeof PROJECT_SERVICE_ERROR.VALIDATION;
    status: 503;
    issues: string[];
}

export interface ProjectRateLimitError extends ProjectErrorBase {
    code: typeof PROJECT_SERVICE_ERROR.RATE_LIMIT;
    status: 503;
    retryAfter?: number;
}

export interface ProjectAvailabilityError extends ProjectErrorBase {
    code: typeof PROJECT_SERVICE_ERROR.AVAILABILITY;
    status: 503;
}

export type ProjectServiceError =
    | ProjectNotFoundError
    | ProjectValidationError
    | ProjectRateLimitError
    | ProjectAvailabilityError;

export interface GetProjectsOptions {
    version?: "draft" | "published";
}

export interface GetProjectBySlugOptions {
    version?: "draft" | "published";
}

export type ProjectCollectionResult =
    | { ok: true; projects: IProjectRecord[]; total: number; invalidCount: number }
    | { ok: false; error: ProjectServiceError };

export type ProjectLookupResult =
    | { ok: true; status: "found"; project: IProjectRecord }
    | { ok: true; status: "not_found"; project?: undefined }
    | { ok: false; error: ProjectServiceError };

interface StoryblokResponse {
    data: unknown;
    total?: number;
    perPage?: number;
    headers?: Headers | Record<string, string>;
}

interface StoryblokErrorShape {
    status?: number;
    response?: { status?: number; headers?: Headers };
    message?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isStoryblokError = (value: unknown): value is StoryblokErrorShape => isRecord(value);

const isProjectServiceError = (value: unknown): value is ProjectServiceError =>
    isRecord(value) && typeof value.code === "string" && typeof value.status === "number" && typeof value.operation === "string";

const getResponseStatus = (error: unknown): number | undefined => {
    if (!isStoryblokError(error)) {
        return undefined;
    }

    if (typeof error.status === "number") {
        return error.status;
    }

    return typeof error.response?.status === "number" ? error.response.status : undefined;
};

const getResponseHeaders = (response: StoryblokResponse): Headers | undefined => {
    if (response.headers instanceof Headers) {
        return response.headers;
    }
    if (response.headers) {
        return new Headers(response.headers);
    }
    return undefined;
};

const getNumberHeader = (headers: Headers | undefined, name: string): number | undefined => {
    const value = headers?.get(name);
    if (!value) {
        return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

const getStoryblokResponse = (value: unknown): StoryblokResponse => {
    if (!isRecord(value) || !("data" in value)) {
        throw new Error("Storyblok response missing data");
    }

    const response = value as { data: unknown; total?: unknown; perPage?: unknown; headers?: unknown };
    return {
        data: response.data,
        total: typeof response.total === "number" ? response.total : undefined,
        perPage: typeof response.perPage === "number" ? response.perPage : undefined,
        headers: response.headers instanceof Headers
            ? response.headers
            : isRecord(response.headers)
                ? Object.fromEntries(Object.entries(response.headers).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
                : undefined,
    };
};

const getResponseStories = (data: unknown): unknown[] | undefined => {
    const parsed = projectCollectionResponseSchema.safeParse(data);
    return parsed.success ? parsed.data.stories : undefined;
};

const getValidationIssues = (error: { issues: Array<{ path: PropertyKey[]; message: string }> }): string[] =>
    error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);

const createValidationError = (operation: ProjectErrorBase["operation"], issues: string[], story?: IProjectStory): ProjectValidationError => ({
    code: PROJECT_SERVICE_ERROR.VALIDATION,
    status: 503,
    operation,
    issues,
    storyUuid: story?.uuid,
    slug: story?.full_slug,
});

const createAvailabilityError = (operation: ProjectErrorBase["operation"], error: unknown, slug?: string): ProjectAvailabilityError => ({
    code: PROJECT_SERVICE_ERROR.AVAILABILITY,
    status: 503,
    operation,
    cause: error,
    slug,
});

const mapClientError = (operation: ProjectErrorBase["operation"], error: unknown, slug?: string): ProjectServiceError => {
    if (isProjectServiceError(error)) {
        return error;
    }

    const status = getResponseStatus(error);

    if (status === 404) {
        return { code: PROJECT_SERVICE_ERROR.NOT_FOUND, status: 404, operation, slug };
    }

    if (status === 429) {
        const headers = isStoryblokError(error) ? error.response?.headers : undefined;
        const retryAfter = getNumberHeader(headers, "retry-after");
        return { code: PROJECT_SERVICE_ERROR.RATE_LIMIT, status: 503, operation, retryAfter, slug };
    }

    return createAvailabilityError(operation, error, slug);
};

const normalizeAsset = (asset?: IProjectAssetRaw | null): IProjectAsset | undefined => {
    if (!asset?.filename) {
        return undefined;
    }

    const size = isRecord(asset.meta_data?.size) ? asset.meta_data.size : undefined;
    const dimensions = size && typeof size.width === "number" && typeof size.height === "number"
        ? { width: size.width, height: size.height }
        : undefined;

    return {
        id: asset.id ?? 0,
        alt: asset.alt ?? "",
        name: asset.name ?? "",
        focus: asset.focus ?? "",
        title: asset.title ?? "",
        source: asset.source ?? "",
        filename: asset.filename,
        copyright: asset.copyright ?? "",
        fieldtype: asset.fieldtype ?? "asset",
        meta_data: asset.meta_data ?? {},
        is_external_url: asset.is_external_url ?? false,
        dimensions,
    };
};

const isRichTextDoc = (value: unknown): value is SbRichTextDoc =>
    isRecord(value) && value.type === "doc" && Array.isArray(value.content);

const isSafeUrl = (value: string): boolean => {
    if (value.startsWith("/") || value.startsWith("//")) {
        return false;
    }

    try {
        const url = new URL(value);
        return ["http:", "https:", "mailto:"].includes(url.protocol);
    } catch {
        return false;
    }
};

const normalizeLink = (link?: string | IProject["repository"] | null): IProjectLink | undefined => {
    if (typeof link === "string") {
        return isSafeUrl(link) ? { url: link, cachedUrl: link } : undefined;
    }

    const candidate = storyblokLinkSchema.safeParse(link);
    if (!candidate.success) {
        return undefined;
    }

    const url = candidate.data.url && isSafeUrl(candidate.data.url) ? candidate.data.url : undefined;
    const cachedUrl = candidate.data.cached_url && isSafeUrl(candidate.data.cached_url) ? candidate.data.cached_url : undefined;
    return url || cachedUrl ? { url, cachedUrl, linktype: candidate.data.linktype, target: candidate.data.target } : undefined;
};

const normalizeMedia = (value: unknown): IProjectMedia | undefined => {
    const parsed = projectMediaSchema.safeParse(value);
    if (!parsed.success) {
        return undefined;
    }

    const media = parsed.data;
    return {
        uid: media._uid,
        component: media.component,
        mediaType: media.media_type,
        image: normalizeAsset(media.image),
        videoUrl: normalizeLink(media.video_url),
        posterImage: normalizeAsset(media.poster_image),
        altText: media.alt_text?.trim() || undefined,
        caption: media.caption?.trim() || undefined,
    };
};

const normalizeTechnology = (value: unknown): IProjectTechnology | undefined => {
    const candidate = isRecord(value) && "content" in value ? value.content : value;
    const parsed = projectTechnologySchema.safeParse(candidate);
    if (!parsed.success) {
        return undefined;
    }

    const technology = parsed.data;
    return {
        uuid: isRecord(value) && typeof value.uuid === "string" ? value.uuid : technology._uid,
        slug: isRecord(value) && typeof value.slug === "string" ? value.slug : undefined,
        name: technology.name,
        logo: normalizeAsset(technology.logo),
        source: normalizeLink(technology.source),
    };
};

const normalizeNavigationItem = (record: IProjectRecord): IProjectNavigationItem => ({
    title: record.detail.title,
    slug: record.detail.slug,
    order: record.story.content.case_study_order ?? undefined,
});

export const getProjectNavigation = (current: IProjectRecord, projects: IProjectRecord[]): IProjectNavigation => {
    const ordered = [...projects].sort((left, right) => {
        const leftOrder = left.story.content.case_study_order;
        const rightOrder = right.story.content.case_study_order;
        if (typeof leftOrder === "number" && typeof rightOrder === "number" && leftOrder !== rightOrder) {
            return leftOrder - rightOrder;
        }
        if (typeof leftOrder === "number") {
            return -1;
        }
        if (typeof rightOrder === "number") {
            return 1;
        }
        return left.story.full_slug.localeCompare(right.story.full_slug);
    });

    const index = ordered.findIndex((project) => project.story.uuid === current.story.uuid);
    return {
        previous: index > 0 ? normalizeNavigationItem(ordered[index - 1]) : undefined,
        next: index >= 0 && index < ordered.length - 1 ? normalizeNavigationItem(ordered[index + 1]) : undefined,
    };
};

export const normalizeProjectStory = (story: IProjectStory): IProjectRecord | ProjectValidationError => {
    const parsedContent = projectContentSchema.safeParse(story.content);
    if (!parsedContent.success) {
        return createValidationError("detail", getValidationIssues(parsedContent.error), story);
    }

    const content = parsedContent.data;
    const title = content.title?.trim() || story.name.trim();
    if (!title) {
        return createValidationError("detail", ["title: project title is required"], story);
    }

    const demo = normalizeLink(content.demo_url);
    const repository = normalizeLink(content.repository);
    const technology = (content.technology ?? []).flatMap((item) => {
        const normalized = normalizeTechnology(item);
        return normalized ? [normalized] : [];
    });
    const gallery = (content.gallery ?? []).flatMap((item) => {
        const normalized = normalizeMedia(item);
        return normalized ? [normalized] : [];
    });
    const narrativeSections: IProjectNarrativeSection[] = (content.narrative_sections ?? []).flatMap((item) => {
        const parsed = projectNarrativeSectionSchema.safeParse(item);
        if (!parsed.success) {
            return [];
        }
        return [{
            uid: parsed.data._uid,
            editable: parsed.data._editable,
            component: parsed.data.component,
            heading: parsed.data.heading?.trim() || undefined,
            body: isRichTextDoc(parsed.data.body) ? parsed.data.body : undefined,
            media: parsed.data.media?.flatMap((media) => {
                const normalized = normalizeMedia(media);
                return normalized ? [normalized] : [];
            })[0],
        }];
    });
    const decisions: IProjectDecision[] = (content.decisions ?? []).flatMap((item) => {
        const parsed = projectDecisionSchema.safeParse(item);
        return parsed.success ? [{
            uid: parsed.data._uid,
            component: parsed.data.component,
            title: parsed.data.title,
            context: isRichTextDoc(parsed.data.context) ? parsed.data.context : undefined,
            decision: isRichTextDoc(parsed.data.decision) ? parsed.data.decision : undefined,
            rationale: isRichTextDoc(parsed.data.rationale) ? parsed.data.rationale : undefined,
            tradeoffs: isRichTextDoc(parsed.data.tradeoffs) ? parsed.data.tradeoffs : undefined,
        }] : [];
    });
    const outcomes: IProjectOutcome[] = (content.outcomes ?? []).flatMap((item) => {
        const parsed = projectOutcomeSchema.safeParse(item);
        return parsed.success ? [{
            uid: parsed.data._uid,
            component: parsed.data.component,
            title: parsed.data.title,
            summary: isRichTextDoc(parsed.data.summary) ? parsed.data.summary : undefined,
            metrics: (parsed.data.metrics ?? []).map((metric) => ({
                uid: metric._uid,
                component: metric.component,
                label: metric.label,
                value: metric.value,
                context: metric.context,
                source: normalizeLink(metric.source),
            })),
        }] : [];
    });
    const coverImage = normalizeAsset(content.cover_image);
    const cover: IProjectCoverMedia | undefined = coverImage || content.cover_alt
        ? { image: coverImage, altText: content.cover_alt?.trim() || coverImage?.alt }
        : undefined;
    const metadata: IProjectMetadata = {
        projectType: content.project_type ?? undefined,
        status: content.status ?? undefined,
        startedAt: content.started_at ?? undefined,
        completedAt: content.completed_at ?? undefined,
        client: content.client ?? undefined,
        role: content.role ?? undefined,
        team: content.team ?? undefined,
        scope: content.scope ?? [],
    };
    const seoImage = normalizeAsset(content.seo_image);
    const detail: IProjectDetail = {
        uuid: story.uuid,
        slug: story.slug,
        fullSlug: story.full_slug,
        title,
        headline: content.headline?.trim() || undefined,
        cover,
        gallery,
        metadata,
        narrativeSections,
        decisions,
        outcomes,
        technology,
        repository,
        demo,
        seo: {
            title: content.seo_title?.trim() || undefined,
            description: content.seo_description?.trim() || undefined,
            image: seoImage,
            noindex: content.seo_noindex ?? false,
        },
    };
    const card: IProjectCardData = {
        title,
        headline: detail.headline,
        demoUrl: demo?.url ?? demo?.cachedUrl,
        repositoryUrl: repository?.url ?? repository?.cachedUrl,
        technology,
    };

    return { story, detail, card };
};

const parseStory = (value: unknown): IProjectStory | ProjectValidationError => {
    const parsed = projectStorySchema.safeParse(value);
    if (!parsed.success) {
        return createValidationError("list", getValidationIssues(parsed.error));
    }

    return parsed.data;
};

export const parseProjectStory = parseStory;

const isDirectProjectStory = (story: IProjectStory): boolean =>
    !story.slug.includes("/") && story.full_slug === `${PROJECT_PATH}${story.slug}`;

const getProjectPages = async (client: StoryblokClient, version: "draft" | "published"): Promise<{ stories: IProjectStory[]; total: number; invalidCount: number }> => {
    const stories: IProjectStory[] = [];
    let page = 1;
    let total = 0;
    let fetchedCount = 0;
    let invalidCount = 0;

    while (page === 1 || stories.length < total) {
        const response = getStoryblokResponse(await client.get("cdn/stories", {
            starts_with: PROJECT_PATH,
            content_type: PROJECT_CONTENT_TYPE,
            version,
            page,
            per_page: PAGE_SIZE,
            resolve_relations: RELATION_FIELD,
        }));
        const data = response.data;
        const pageStories = getResponseStories(data);
        if (!pageStories) {
            throw createValidationError("list", ["stories: Storyblok collection response is invalid"]);
        }
        const headerTotal = getNumberHeader(getResponseHeaders(response), "total");
        total = response.total ?? headerTotal ?? (page === 1 ? pageStories.length : total);
        const parsedPage = pageStories.flatMap((item) => {
            const parsed = parseStory(item);
            if ("code" in parsed) {
                invalidCount += 1;
                return [];
            }
            return isDirectProjectStory(parsed) ? [parsed] : [];
        });
        stories.push(...parsedPage);
        fetchedCount += pageStories.length;
        if (pageStories.length === 0 || fetchedCount >= total) {
            break;
        }
        page += 1;
    }

    return { stories, total, invalidCount };
};

const resolveRelationUuids = async (client: StoryblokClient, uuids: string[], version: "draft" | "published"): Promise<Map<string, IProjectTechnologyStory>> => {
    const relations = new Map<string, IProjectTechnologyStory>();
    for (let index = 0; index < uuids.length; index += RELATION_BATCH_SIZE) {
        const batch = uuids.slice(index, index + RELATION_BATCH_SIZE);
        const response = getStoryblokResponse(await client.get("cdn/stories", {
            by_uuids: batch.join(","),
            version,
            per_page: RELATION_BATCH_SIZE,
        }));
        const data = isRecord(response.data) ? response.data : undefined;
        const relationStories = Array.isArray(data?.stories) ? data.stories : [];
        for (const relation of relationStories) {
            if (!isRecord(relation) || typeof relation.uuid !== "string") {
                continue;
            }
            const content = projectTechnologySchema.safeParse(relation.content);
            if (!content.success) {
                continue;
            }
            relations.set(relation.uuid, {
                id: typeof relation.id === "number" ? relation.id : undefined,
                uuid: relation.uuid,
                name: typeof relation.name === "string" ? relation.name : undefined,
                slug: typeof relation.slug === "string" ? relation.slug : undefined,
                content: content.data,
            });
        }
    }
    return relations;
};

const hydrateRelations = async (client: StoryblokClient, stories: IProjectStory[], version: "draft" | "published"): Promise<void> => {
    const unresolved = stories.flatMap((story) => (story.content.technology ?? []).filter((item): item is string => typeof item === "string"));
    if (unresolved.length === 0) {
        return;
    }

    const relations = await resolveRelationUuids(client, [...new Set(unresolved)], version);
    for (const story of stories) {
        story.content.technology = (story.content.technology ?? []).flatMap((item) => {
            if (typeof item !== "string") {
                return [item];
            }
            const relation = relations.get(item);
            return relation ? [{ uuid: relation.uuid, slug: relation.slug, content: relation.content }] : [];
        });
    }
};

export const getProjects = async (options: GetProjectsOptions = {}): Promise<ProjectCollectionResult> => {
    const version = options.version ?? getStoryblokVersion();
    const client = getStoryblokClient();
    try {
        const result = await getProjectPages(client, version);
        await hydrateRelations(client, result.stories, version);
        const normalizationInvalidCount = result.stories.reduce((count, story) => {
            const normalized = normalizeProjectStory(story);
            return "code" in normalized ? count + 1 : count;
        }, 0);
        const projects = result.stories.flatMap((story) => {
            const normalized = normalizeProjectStory(story);
            return "code" in normalized ? [] : [normalized];
        });
        return { ok: true, projects, total: result.total, invalidCount: result.invalidCount + normalizationInvalidCount };
    } catch (error: unknown) {
        const mapped = mapClientError("list", error);
        console.error("Failed to fetch Storyblok projects", { code: mapped.code, status: mapped.status });
        return { ok: false, error: mapped };
    }
};

export const getProjectBySlug = async (slug: string, options: GetProjectBySlugOptions = {}): Promise<ProjectLookupResult> => {
    const version = options.version ?? getStoryblokVersion();
    if (!slug || slug.includes("/") || slug.includes("..")) {
        return { ok: true, status: "not_found" };
    }

    const client = getStoryblokClient();
    try {
        const response = getStoryblokResponse(await client.get(`cdn/stories/${PROJECT_PATH}${encodeURIComponent(slug)}`, {
            version,
            resolve_relations: RELATION_FIELD,
        }));
        const data = isRecord(response.data) ? response.data : undefined;
        const parsed = parseStory(data?.story);
        if ("code" in parsed) {
            return { ok: false, error: { ...parsed, operation: "detail", slug } };
        }
        if (parsed.full_slug !== `${PROJECT_PATH}${slug}` || parsed.content.component !== PROJECT_CONTENT_TYPE) {
            return { ok: true, status: "not_found" };
        }
        await hydrateRelations(client, [parsed], version);
        const normalized = normalizeProjectStory(parsed);
        if ("code" in normalized) {
            return { ok: false, error: { ...normalized, operation: "detail", slug } };
        }
        return { ok: true, status: "found", project: normalized };
    } catch (error: unknown) {
        const mapped = mapClientError("detail", error, slug);
        if (mapped.code === PROJECT_SERVICE_ERROR.NOT_FOUND) {
            return { ok: true, status: "not_found" };
        }
        console.error("Failed to fetch Storyblok project", { code: mapped.code, status: mapped.status, slug });
        return { ok: false, error: mapped };
    }
};
