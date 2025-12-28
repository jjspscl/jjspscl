import { storyBlokClient } from "../storyblok/client";
import type {
  ISbResponse,
} from "../storyblok/storyblok.types";
import { getStoryblokVersion } from "../storyblok/utils";
import type { IMeResponse } from "./about.type";


export const getMe = async () => {
  try {
    const res = await storyBlokClient.get("cdn/stories/about", {
      version: getStoryblokVersion(),
    });
  
    const data = res.data as ISbResponse<IMeResponse>;
  
    return data.story.content;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};
