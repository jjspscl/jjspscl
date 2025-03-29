import type {
  ISbResponse,
  ISbResponses,
  ISbResult,
} from "../storyblok/storyblok.types";
import { getStoryblokVersion, storyblokApi } from "../storyblok/utils";
import type { IMeResponse } from "./me.type";

export const getMe = async () => {
  let response: ISbResult<IMeResponse>;
  const res = await storyblokApi.get("cdn/stories/me", {
    version: getStoryblokVersion(),
  });

  const data = res.data as ISbResponse<IMeResponse>;
  if (data) {
    response = data.story;
  }

  return data.story.content;
};
