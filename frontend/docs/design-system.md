# Design System

## Intent

The interface uses an editorial-brutalist system: cream paper, near-black ink, burnt red-orange action color, sharp rules, visible borders, and one controlled VHS shadow. Project media remains the dominant color source.

## Tokens

Tailwind CSS-first tokens live in `src/styles/tailwind.css`.

### Color

- `canvas`, `surface`, `surface-muted`
- `ink`, `ink-muted`
- `border`, `border-muted`
- `action`, `action-hover`, `action-contrast`
- `link`, `link-hover`, `focus`
- `highlight`, `placeholder`
- `feedback-info`, `feedback-success`, `feedback-warning`, `feedback-danger`
- `feedback-info-surface`, `feedback-success-surface`, `feedback-warning-surface`, `feedback-danger-surface`
- `code-ink`, `code-surface`
- `paper`, `paper-ink`, `paper-border`

Legacy `background`, `text-primary`, `text-secondary`, `surface-secondary`, `accent`, and `primary` names remain aliases while consumers migrate.

### Typography

- `font-display` for display copy
- `font-sans` for body copy
- `font-meta` for compact technical metadata
- `text-display-xl`, `text-display-lg`
- `text-heading-1`, `text-heading-2`, `text-heading-3`
- `text-body-lg`, `text-meta`

### Layout and shape

- `ds-container` for reading width
- `ds-container-wide` for wide grids
- `py-section` for major vertical rhythm
- `rounded-control`, `rounded-card`, `rounded-media`, `rounded-pill`
- `shadow-vhs` and `shadow-vhs-active`

## Primitives

### Static Astro

- `TextLink.astro` owns internal/external link treatment and current-page state.
- `Badge.astro` owns tag and compact status presentation.
- `Container.astro` owns reading/wide/full widths.
- `Section.astro` emits a semantic section only when given `labelledBy`.
- `Prose.astro` owns rich-text colors and typography-plugin variables.
- `FeedbackState.astro` owns static empty and unavailable states.
- `MediaFrame.astro` owns borders, media dimensions, captions, and optional aspect-ratio reservation.

### React

- `Button.tsx` supports `primary`, `outline`, `ghost`, and `sm`, `md`, `lg` sizes.
- `Card.tsx` supports `vhs`, `outlined`, `plain`, and `sm`, `md`, `lg` padding.
- `components/forms/*` owns field, message, status, input, and textarea treatment.

Static use of React `Button` or `Card` from Astro does not add hydration. Hydrate only existing interactive islands.

## Accessibility

- Standalone controls have a 44px minimum target.
- Keyboard focus uses the semantic focus token with a visible 2px outline and 3px offset.
- Native buttons default to `type="button"`.
- Loading buttons expose `aria-busy`, `aria-disabled`, and visible text.
- Errors use `aria-invalid`, described-by IDs, and alert semantics.
- Status regions use polite or assertive live regions deliberately.
- External new-tab links use `noopener noreferrer` and contextual accessible labels.
- Decorative media uses empty alt text; meaningful media requires contextual alt text.
- Reduced-motion users receive visible content without entrance transforms.

## Compatibility

- `Tag.astro` and `ArticleTag.astro` remain adapters for Storyblok data and Visual Editor attributes.
- `colorful` currently maps to the single accent treatment instead of the old rainbow palette.
- Project cards preserve `IProjectCardData`, demo, repository, headline, and technology fallbacks.
- Existing semantic Tailwind aliases remain until every consumer has migrated.
- CMS asset dimensions remain optional. Never infer missing width or height.

## Migration rules

1. Use semantic color utilities instead of raw VHS palette utilities for new components.
2. Use `TextLink` for new standalone/navigation links.
3. Use `Button` for button-shaped links and native actions.
4. Use `Card` for framed surfaces; do not make the card itself clickable.
5. Use `Prose` for Storyblok rich text.
6. Keep Storyblok editable attributes on the wrapper rendered for the CMS block.
7. Do not add `client:*` hydration for static presentation.
8. Do not remove aliases or adapters until repository consumers reach zero.
