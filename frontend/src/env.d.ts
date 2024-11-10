/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly STORYBLOK_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}