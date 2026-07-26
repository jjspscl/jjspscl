# jjspscl portfolio frontend

Astro SSR application deployed to Cloudflare Workers. Storyblok supplies CMS content, React provides interactive islands, Tailwind CSS provides styling, and Cloudflare D1 stores contact-pipeline data.

## Runtime and package policy

- Node.js `>=22.12.0`; CI currently pins Node `22.19.0`.
- npm `>=10.9.0`; use npm only for this package.
- `package-lock.json` is authoritative. Use `npm ci` for clean, reproducible installs.
- `frontend/bun.lock` is intentionally untracked and is not used by CI.

## Local development

Run commands from `frontend/`:

```sh
npm ci
npm run dev
```

Required local secrets are provided through Astro environment configuration and Cloudflare `.dev.vars`:

- `STORYBLOK_TOKEN`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY` (optional)

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start Astro development server with Cloudflare workerd behavior |
| `npm run lint` | Run ESLint with zero-warning policy |
| `npm run typecheck` | Run `astro check` |
| `npm run build` | Typecheck and build the Cloudflare Worker |
| `npm run preview` | Preview the built Worker locally |
| `npm run deploy` | Deploy through Wrangler using `wrangler.jsonc` |
| `npx wrangler types` | Generate Cloudflare binding types after config changes |

## Cloudflare runtime

The application uses `output: "server"` and the entrypoint declared in `wrangler.jsonc`. Runtime bindings include D1 `DB`; the Cloudflare adapter also provisions image and session bindings used by the generated Worker. Production uses the `jjspscl.com` custom domain.

D1 migrations live in `db/migrations/` and must be applied with Wrangler before code that depends on a new schema is deployed. Migration workflow configuration currently distinguishes `preview` and `production` database names; verify the target environment before running a remote migration.

Cloudflare compatibility behavior is controlled by `compatibility_date` and `nodejs_compat` in `wrangler.jsonc`. The deployed runtime is Cloudflare workerd, not the local Node.js process.

## Storyblok

Development enables the Storyblok Bridge and live preview, including `article.tags` relation resolution. Preview routes prefer the Storyblok live payload and fall back to the CMS API. Production requests published content and does not enable the Bridge.

Storyblok publish events trigger the deployment workflow so prerendered CMS pages can refresh. SSR blog routes fetch published content at request time.

## Deployment

GitHub Actions performs sparse frontend checkout, `npm ci`, lint, environment-backed build, and Wrangler deployment. Pull requests build without deployment. Production deployment requires the configured Storyblok, Turnstile, Cloudflare, and indexing secrets.

Do not commit `.env`, `.dev.vars`, credentials, lockfiles from another package manager, or generated `dist/` output.
