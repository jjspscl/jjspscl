import type { ISbResponses, ISbResult } from "@sb/storyblok.type";
import { getStoryblokVersion } from "@sb/storyblok.util";
import type { IProject } from "./project.type";
import { getStoryblokClient } from "../storyblok/storyblok.client";

export const getProjects = async () => {
    let projectData: ISbResult<IProject>[] = [];
    const client = getStoryblokClient();
    const res = await client.get("cdn/stories", {
        starts_with: "projects/",
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
