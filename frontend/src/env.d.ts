/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  interface Env {
    DB: import("@cloudflare/workers-types").D1Database;
    SESSION: import("@cloudflare/workers-types").KVNamespace;
    IMAGES: import("@cloudflare/workers-types").ImagesBinding;
    ASSETS: import("@cloudflare/workers-types").Fetcher;
  }
}

interface ImportMetaEnv {
  readonly STORYBLOK_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
