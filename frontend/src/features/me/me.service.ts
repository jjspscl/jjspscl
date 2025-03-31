import { storyBlokClient } from "../storyblok/client";
import type {
  ISbResponse,
  ISbResult,
} from "../storyblok/storyblok.types";
import { getStoryblokVersion } from "../storyblok/utils";
import type { IMeResponse } from "./me.type";


export const getMe = async () => {
  try {
    let response: ISbResult<IMeResponse>;
    const res = await storyBlokClient.get("cdn/stories/me", {
      version: getStoryblokVersion(),
    });
  
    const data = res.data as ISbResponse<IMeResponse>;
    if (data) {
      response = data.story;
    }
  
    return data.story.content;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};
