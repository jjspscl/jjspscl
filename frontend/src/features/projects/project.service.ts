import type { ISbResponses, ISbResult } from "@sb/storyblok.types";
import { getStoryblokVersion, storyblokApi } from "@sb/utils";
import type { IProject } from "./project.type";


export const getProjects = async () => {
    let projectData: ISbResult<IProject>[] = [];
    const res = await storyblokApi.get("cdn/stories", {
        starts_with: "projects/",
        sort_by: "first_published_at:desc",
        content_type: "project",
        version: getStoryblokVersion(),
    });

    const data = res.data as ISbResponses<IProject>;
    if (data?.stories && data.stories.length > 0) {
        projectData = data.stories;
    }

    return projectData;
}