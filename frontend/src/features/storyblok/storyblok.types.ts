export interface ISbResult<T> {
    name: string;
    created_at: string;
    published_at: string;
    id: number;
    uuid: string;
    content: T;
    slug: string;
    full_slug: string;
    sort_by_date: string;
    position: number;
    tag_list: string[];
    is_startpage: boolean;
    parent_id: number;
    meta_data: any;
    group_id: string;
    first_published_at: string;
    release_id: string;
    lang: string;
}

export interface ISbResponses<T> {
    stories: ISbResult<T>[];
}

export interface ISbResponse<T> {
    story: ISbResult<T>;
}