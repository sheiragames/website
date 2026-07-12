# sheiragames.com

Static homepage/blog for sheiragames.com — plain HTML/CSS/TypeScript,
no framework, no bundler. Deployed via GitHub Pages.

## Build

```sh
npm install
npm run build
npx serve public
```

Compiles `src/*.ts` to `public/dist/*.js` via `tsc`, then serves the
`public/` folder over `http://localhost:...` — the same folder that
gets deployed, so what you see locally is what goes live. A real
server is required — browsers block
`type="module"` scripts from loading over plain `file://`. Reload
manually after each build; no live-reload.

## Adding a new page, asset, or script

Static files served as-is (HTML, CSS, images) go under `public/` — the
deploy workflow copies that folder wholesale, nothing else to update.
TypeScript goes in `src/`; compiled output lands in `public/dist/`
automatically via `npm run build`.

## Docs

Content and design decisions live in the `mathapp` repo, not here:
- Content/scope: `docs/website/`
- Visual identity (palette, type): `docs/design/visual_identity.md`

This repo only implements those decisions.
