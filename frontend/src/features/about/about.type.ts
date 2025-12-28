import type { StoryblokRichTextNode } from "@storyblok/astro";


export interface IMeResponse {
  intro_label: string;
  intro_description: StoryblokRichTextNode<string>;
}