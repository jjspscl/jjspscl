import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./seo.constant";
import type { BlogPostingSchema, PersonSchema, WebSiteSchema } from "./seo.type";

export function createPersonSchema(): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    alternateName: AUTHOR.alternateName,
    url: AUTHOR.url,
    image: AUTHOR.image,
    sameAs: AUTHOR.sameAs,
    jobTitle: AUTHOR.jobTitle,
    description: `${AUTHOR.jobTitle} passionate about building modern web applications.`,
  };
}

export function createWebSiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

interface BlogPostingOptions {
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}

export function createBlogPostingSchema(options: BlogPostingOptions): BlogPostingSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.headline,
    description: options.description,
    image: options.image || AUTHOR.image,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
      logo: {
        "@type": "ImageObject",
        url: AUTHOR.image,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
  };
}
