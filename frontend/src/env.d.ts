/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  interface Env {
    DB: import("@cloudflare/workers-types").D1Database;
  }
}

type Runtime = import("@astrojs/cloudflare").Runtime;

declare namespace App {
  interface Locals extends Runtime {}
}

interface ImportMetaEnv {
  readonly STORYBLOK_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}