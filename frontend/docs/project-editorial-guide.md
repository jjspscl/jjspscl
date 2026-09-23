# Project Editorial Guide

Phase 4 uses backward-compatible optional fields. Existing `title`, `headline`, `demo_url`, `repository`, and `technology` entries remain valid without any new content.

## Minimum project entry

- Use a clear project title.
- Keep headline concise and outcome-oriented.
- Add repository and demo links only when public and stable.
- Use technology relations that resolve to published `tech-stack` stories.

## Cover and gallery media

- Use `cover_image` for the primary project image.
- Write `cover_alt` describing the meaningful subject or result, not the filename.
- Add dimensions only when supplied by Storyblok asset metadata; do not guess.
- Use gallery media for screenshots that explain the project.
- Captions should add context rather than repeat alt text.
- Do not publish private, credential-bearing, or client-confidential screenshots.
- Video requires a separately approved provider, poster, privacy, and accessibility policy.

## Narrative sections

Use constrained `project-narrative-section` blocks for:

- context or problem;
- constraints and responsibilities;
- implementation/process;
- lessons or technical details.

Keep one idea per section. Rich text should not introduce a competing page-level `h1`.

## Role, scope, and decisions

- `role` describes personal responsibility.
- `team` describes collaborators without exposing private information.
- `scope` lists meaningful work areas.
- `project-decision` blocks should explain context, decision, rationale, and tradeoffs.

## Outcomes and metrics

- Add outcomes only when they are accurate and publishable.
- Never invent numbers.
- Use display strings for values such as `35%`, `2.4s`, `3 weeks`, or `12 fewer support requests`.
- Add context describing baseline, timeframe, and measurement method when known.
- Add a source link for externally verifiable claims when available.
- Use qualitative outcomes when quantitative evidence is unavailable.

## SEO

SEO overrides are optional. Defaults are generated from the project title, headline, cover image, and site metadata.

- Use `seo_title` only when the default title is insufficient.
- Use `seo_description` as a concise search/social summary.
- Use `seo_image` when a social preview should differ from the cover.
- Set `seo_noindex` for private, incomplete, confidential, or intentionally excluded projects.

## Review and publication checklist

1. Confirm slug and title.
2. Confirm links are public and correct.
3. Confirm technology relations resolve.
4. Check cover and screenshot alt text.
5. Remove credentials and confidential data.
6. Review role, scope, decisions, and outcomes.
7. Verify metrics and evidence.
8. Preview draft in Storyblok Visual Editor.
9. Check the project route and metadata.
10. Publish only after editorial approval.

New required fields, remote schema changes, content backfills, and publication migrations require separate approval. No remote migration is performed by this guide.
