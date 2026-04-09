export const getStoryblokVersion = () => {
    const version = import.meta.env.DEV ? 'draft' : 'published';
    return version;
}