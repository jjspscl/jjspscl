
export interface IArticleTag {
    _uid: string;
    title: string;
    icon: IStoryblokAsset;
    component: "article-tag";
}

export interface IArticleTagResolved {
    uuid: string;
    slug: string;
    content: IArticleTag;
}

export interface IStoryblokAsset {
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
}

export interface IBlog {
    title: string;
    headline: string;
    content: unknown;
    tags: IArticleTagResolved[];
}

export type TagColor = {
    bg: string;
    bgDark: string;
    text: string;
    textDark: string;
};

export const TAG_COLORS: TagColor[] = [
    { bg: "bg-red-100", bgDark: "dark:bg-red-900/30", text: "text-red-700", textDark: "dark:text-red-300" },
    { bg: "bg-orange-100", bgDark: "dark:bg-orange-900/30", text: "text-orange-700", textDark: "dark:text-orange-300" },
    { bg: "bg-amber-100", bgDark: "dark:bg-amber-900/30", text: "text-amber-700", textDark: "dark:text-amber-300" },
    { bg: "bg-yellow-100", bgDark: "dark:bg-yellow-900/30", text: "text-yellow-700", textDark: "dark:text-yellow-300" },
    { bg: "bg-lime-100", bgDark: "dark:bg-lime-900/30", text: "text-lime-700", textDark: "dark:text-lime-300" },
    { bg: "bg-green-100", bgDark: "dark:bg-green-900/30", text: "text-green-700", textDark: "dark:text-green-300" },
    { bg: "bg-emerald-100", bgDark: "dark:bg-emerald-900/30", text: "text-emerald-700", textDark: "dark:text-emerald-300" },
    { bg: "bg-teal-100", bgDark: "dark:bg-teal-900/30", text: "text-teal-700", textDark: "dark:text-teal-300" },
    { bg: "bg-cyan-100", bgDark: "dark:bg-cyan-900/30", text: "text-cyan-700", textDark: "dark:text-cyan-300" },
    { bg: "bg-sky-100", bgDark: "dark:bg-sky-900/30", text: "text-sky-700", textDark: "dark:text-sky-300" },
    { bg: "bg-blue-100", bgDark: "dark:bg-blue-900/30", text: "text-blue-700", textDark: "dark:text-blue-300" },
    { bg: "bg-indigo-100", bgDark: "dark:bg-indigo-900/30", text: "text-indigo-700", textDark: "dark:text-indigo-300" },
    { bg: "bg-violet-100", bgDark: "dark:bg-violet-900/30", text: "text-violet-700", textDark: "dark:text-violet-300" },
    { bg: "bg-purple-100", bgDark: "dark:bg-purple-900/30", text: "text-purple-700", textDark: "dark:text-purple-300" },
    { bg: "bg-fuchsia-100", bgDark: "dark:bg-fuchsia-900/30", text: "text-fuchsia-700", textDark: "dark:text-fuchsia-300" },
    { bg: "bg-pink-100", bgDark: "dark:bg-pink-900/30", text: "text-pink-700", textDark: "dark:text-pink-300" },
    { bg: "bg-rose-100", bgDark: "dark:bg-rose-900/30", text: "text-rose-700", textDark: "dark:text-rose-300" },
];

export const getTagColor = (identifier?: string): TagColor => {
    if (!identifier) {
        return TAG_COLORS[0];
    }
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
        hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % TAG_COLORS.length;
    return TAG_COLORS[index];
};