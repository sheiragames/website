# CLAUDE.md

This file provides guidance to Claude Code when working with code in this
repository.

## Project

Static homepage/blog for sheiragames.com — a personal/brand site, not
scoped to mathapp specifically. Plain HTML/CSS/TypeScript, bundled
with Vite. Deployed via Cloudflare Pages.

- Content decisions: `docs/website/homepage_spec.md` and
  `docs/website/blog_spec.md` in the `mathapp` repo.
- Visual-design decisions (palette, type, aesthetic direction):
  `docs/design/visual_identity.md` in the `mathapp` repo — canonical
  across every surface, not website-specific. Reference it, don't
  redefine colors/type here.

Setup/run/build/test/lint commands: see `README.md`, not here.

## Architecture

- `src/*.ts` — TypeScript source. `src/logging/` holds the event
  logging pipeline (schema, session/page identity, the send mechanism)
  — see `logging.md` in the `mathapp` repo for the cross-repo "why".
- `@/*` resolves to `src/*` (see `tsconfig.json`/`vite.config.mts`) —
  use it instead of relative `../` imports.
- `en/`/`hu/` — generated output (gitignored), one directory per
  locale, holding the homepage and blog pages. Produced by
  `scripts/build-home.ts` and `scripts/build-blog.ts` from
  `src/strings/{en,hu}.ts` and `blog-posts/{en,hu}/*.md`, both via
  the shared `scripts/shell.ts` template (references source directly,
  `/src/index.ts`, not compiled output). URL/i18n scheme decisions:
  `docs/architecture/i18n.md` in the `mathapp` repo.
- `public/` — static passthrough assets only (`style.css`,
  `favicon.svg`); Vite copies this into `dist/` automatically.
- Every page needs a `<meta name="page-name" content="...">` tag —
  required by the logging pipeline; falls back to `"unknown-page"` if missing, not thrown/loud.

## Conventions

- Absolute paths (`/style.css`, not `style.css`) for any links/assets
  — relative paths break depending on how deep the current page is
  nested.
- TypeScript: `const`-first, avoid in-place mutation, prefer pure/
  higher-order functions over imperative loops where it fits naturally.
- `style.css` is organized into commented sections, in cascade order:
  tokens → reset → global typography → layout primitives → per-surface
  (homepage, blog). Add new rules to the section they belong in, not
  appended at the end — keeps the file scannable as it grows.
