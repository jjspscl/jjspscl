export interface ITag {
    _uid: string;
    _editable?: string;
    title: string;
    icon?: ITagAsset;
    component: string;
}

export interface ITagAsset {
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

export interface ITagResolved<T extends ITag = ITag> {
    uuid: string;
    slug: string;
    content: T;
}
