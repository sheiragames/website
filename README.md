# sheiragames.com

Static homepage/blog for sheiragames.com — plain HTML/CSS/TypeScript,
bundled with Vite. Deployed via Cloudflare Pages.

## Setup (once, or after `package.json` changes)

```sh
npm install
```

Downloads everything listed in `package.json` (Vite, TypeScript,
ESLint, etc.) into `node_modules/` — needed before anything below runs.

## Run locally

```sh
npm run dev
```

Starts Vite's dev server (`http://localhost:5173`) with hot module
reload — edit `src/*.ts`, see it update instantly. This is the
everyday command. It also runs `scripts/build-blog.ts` once at
startup to regenerate `blog/` from `blog-posts/*.md` — restart
`npm run dev` after adding, editing, or removing a post to pick up
the change.

## Build

```sh
npm run build
```

Bundles everything into `dist/` — the real, optimized output that gets
deployed. Only needed to produce that final folder yourself (CI does
this automatically on deploy) or to preview the exact production build
locally before pushing.

## Typecheck / Lint

```sh
npm run typecheck   # tsc --noEmit — Vite bundles but doesn't type-check
npm run lint
```

## Adding a new page, asset, or script

- Every page needs a `<meta name="page-name" content="...">` tag in its
  `<head>` — required for event logging (`getPageName()` in
  `src/logging/page.ts` reads it; falls back to `"unknown-page"` if missing, not thrown/loud).
- Static files served as-is (images, fonts, etc.) go under `public/`
  — Vite copies this folder into `dist/` automatically at build time.
- `index.html` is the entry point, at the repo root — reference new
  scripts there via `<script type="module" src="/src/...">`.
- TypeScript goes in `src/`.

## Docs

Content and design decisions live in the `mathapp` repo, not here:
- Content/scope: `docs/website/`
- Visual identity (palette, type): `docs/design/visual_identity.md`

This repo only implements those decisions.
