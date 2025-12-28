import type { ISbResponses, ISbResult } from "@sb/storyblok.types";
import { getStoryblokVersion } from "@sb/utils";
import type { IProject } from "./project.type";
import { storyBlokClient } from "../storyblok/client";

export const getProjects = async () => {
    let projectData: ISbResult<IProject>[] = [];
    const res = await storyBlokClient.get("cdn/stories", {
        starts_with: "projects/",
        sort_by: "first_published_at:desc",
        content_type: "project",
        version: getStoryblokVersion(),
        resolve_relations: "project.technology",
    });

    const data = res.data as ISbResponses<IProject>;
    if (data?.stories && data.stories.length > 0) {
        projectData = data.stories;
    }

    return projectData;
}