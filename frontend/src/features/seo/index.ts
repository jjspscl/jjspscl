export { default as BlogPostSchema } from "./components/BlogPostSchema.astro";
export { default as ProjectSchema } from "./components/ProjectSchema.astro";
export { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./seo.constant";
export type { BlogPostingSchema, PersonSchema, ProjectStructuredData, WebSiteSchema } from "./seo.type";
export { createBlogPostingSchema, createPersonSchema, createProjectSchema, createWebSiteSchema } from "./seo.util";
