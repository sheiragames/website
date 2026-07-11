npm# sheiragames.com

Static homepage/blog for sheiragames.com — plain HTML/CSS/TypeScript,
no framework, no bundler. Deployed via GitHub Pages.

## Build

```sh
npm install
npm run build
npx serve
```

Compiles `src/*.ts` to `dist/*.js` via `tsc`, then serves the folder over
`http://localhost:...`. A real server is required — browsers block
`type="module"` scripts from loading over plain `file://`. Reload
manually after each build; no live-reload.

## Docs

Content and design decisions live in the `mathapp` repo, not here:
- Content/scope: `docs/website/`
- Visual identity (palette, type): `docs/design/visual_identity.md`

This repo only implements those decisions.
