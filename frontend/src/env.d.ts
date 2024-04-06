/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_STORYBLOK_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}