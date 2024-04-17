import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../constants";
import { useStoryblokApi } from "@storyblok/astro";

const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get(`cdn/stories`, {
    version: "published",
    starts_with: "blog",
    content_type: "article",
    sort_by: "first_published_at:desc",
});

const posts = data.stories;
console.log(posts);

export async function GET(context: any) {
  if(process.env.VITE_ENVIRONMENT === 'preview'){
    return
  }
  else{
    return rss({
            title: SITE_TITLE,
            description: SITE_DESCRIPTION,
            site: context.site,
            stylesheet: '/rss/pretty-feed.xsl',
            xmlns: {atom: "http://www.w3.org/2005/Atom",},
            items: posts.map((post: any)=> ({
                title: post.content.title,
                pubDate: post.first_published_at,
                description: post.content.headline,
                link: `/${post.full_slug}`,
            })),
            customData: `<language>en-us</language> <atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />`,
        });
    }
}