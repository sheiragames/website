# CLAUDE.md

This file provides guidance to Claude Code when working with code in this
repository.

## Project

Static homepage/blog for sheiragames.com — a personal/brand site, not
scoped to mathapp specifically (see `docs/website/v0_spec.md` in the
`mathapp` repo for why). Plain HTML/CSS/TypeScript, no framework, no
bundler — deliberately viteless (see that same spec for reasoning).
Deployed via GitHub Pages.

## Commands

```sh
npm install     # install the TypeScript compiler (only dependency)
npm run build   # runs tsc — compiles src/*.ts to dist/*.js
npx serve       # local static server — required, not optional: browsers
                # block `type="module"` scripts from loading over plain
                # file://, so a real http:// origin is needed
```

Reload manually after each build — this is a static server, not a
live-reload dev server like Vite would give you.

## Architecture

- `src/*.ts` — TypeScript source, compiled to `dist/` (`tsconfig.json`:
  ES2020 modules, strict mode)
- `index.html` (once it exists) — loads compiled output via
  `<script type="module" src="dist/index.js"></script>`
- Content decisions: `docs/website/v0_spec.md` in the `mathapp` repo.
- Visual-design decisions (palette, type, aesthetic direction):
  `docs/design/visual_identity.md` in the `mathapp` repo — canonical
  across every surface, not website-specific. Reference it, don't
  redefine colors/type here.

## Conventions

- Absolute paths (`/style.css`, not `style.css`) for any links/assets,
  once there's more than one page — relative paths break depending on
  how deep the current page is nested.
- TypeScript: `const`-first, avoid in-place mutation, prefer pure/
  higher-order functions over imperative loops where it fits naturally.
