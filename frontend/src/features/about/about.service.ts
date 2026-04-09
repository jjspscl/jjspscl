import { getStoryblokClient } from "../storyblok/storyblok.client";
import type {
  ISbResponse,
} from "../storyblok/storyblok.type";
import { getStoryblokVersion } from "../storyblok/storyblok.util";
import type { IMeResponse } from "./about.type";


export const getMe = async () => {
  try {
    const client = getStoryblokClient();
    const res = await client.get("cdn/stories/about", {
      version: getStoryblokVersion(),
    });
  
    const data = res.data as ISbResponse<IMeResponse>;
  
    return data.story.content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};
