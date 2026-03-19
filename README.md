# lass-lang.github.io

Source for [lass-lang.dev](https://lass-lang.dev) — the Lass landing page.

## Structure

```
content/          ← markdown source (edited by humans)
  landing/
    index.md      ← landing page copy (frontmatter + prose)
_built-pages/     ← Astro build output → served by GitHub Pages
src/              ← Astro app (layouts, components, styles) — added in Story 9.3
```

## How it works

- `content/` holds the copy and content authored in this repo (and in the dev-workspace monorepo)
- Story 9.3 adds Astro to this repo — `pnpm build` compiles `content/` + `src/` → `_built-pages/`
- A `pre-push` hook rebuilds and commits `_built-pages/` on every push
- GitHub Pages serves `_built-pages/` at `lass-lang.dev`

## Related

- Docs site: [lass-lang/docs](https://github.com/lass-lang/docs) → `lass-lang.dev/docs`
- Monorepo: [lass-lang/_dev-workspace](https://github.com/lass-lang/_dev-workspace) — this repo lives at `apps/lass-lang.dev/`
