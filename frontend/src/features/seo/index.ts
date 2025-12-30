export { default as BlogPostSchema } from "./components/BlogPostSchema.astro";
export { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./seo.constant";
export type { BlogPostingSchema, PersonSchema, WebSiteSchema } from "./seo.type";
export { createBlogPostingSchema, createPersonSchema, createWebSiteSchema } from "./seo.util";
