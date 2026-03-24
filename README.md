# Lass

> CSS + JavaScript. Nothing else.

## CSS is already great

Modern CSS is remarkable. Use it.

Custom properties, nesting, container queries, cascade layers, `color-mix()`, `oklch()`, logical properties, `:has()` — these aren't workarounds. They're the language doing exactly what it was designed to do.

Lass doesn't replace any of that. It compiles away the moment you push. What's left is CSS.

> "A preprocessor that gets out of the way. Write CSS features the day they ship — Lass only touches what you ask it to."

## When you need logic, use JS

Other preprocessors invented their own languages to fill the gap. Sass gave you `@mixin`, `@include`, `@each`, `@if`, `@function`. Less gave you `.mixin()`, `each()`, `when()`. New syntax. New rules. New things to remember.

CSS itself won't add loops. It's declarative — a bucket of properties, not a sequence of steps. That gap is permanent.

Lass's answer: don't learn a new language. Use the one you already know.

Real functions. Real imports. Real loops. JavaScript.

```lass
---
import tokens from './tokens.json'
--- design token custom properties
:root {
  {{ Object.entries(tokens.color).map(([k, v]) => @{ --color-{{ k }}: {{ v }}; }) }}
}
```

No `@mixin`. No `@include`. No new syntax to learn.

## Six symbols bridge the gap

That's the whole surface area between JavaScript and CSS in Lass:

| Symbol | Direction | What it does |
|--------|-----------|--------------|
| `---` | separator | Divides JS preamble from CSS zone |
| `{{ expr }}` | JS → CSS | Evaluates any JS expression, inserts result |
| `$name` | JS → CSS | Text substitution from a `$`-prefixed variable |
| `@(prop)` | CSS → JS | Reads the last-declared value of a CSS property |
| `@{ css }` | CSS in JS | CSS string inside JS context (for loops, functions) |
| `//` | — | Single-line comment — stripped from output |

Six symbols. No new control flow. No custom language.

## Tool, not obstacle

> "The most important thing is that I can still use the base language. If I have to wait for a tool to add support for CSS features — that's not a tool, that's an obstacle."
> — Miriam Suzanne, CSS Day 2025

Lass passes that test. Any valid CSS in a `.lass` file compiles to identical CSS. You never wait for Lass to catch up.

## Tailwind gives you utilities. Lass gives you the rest.

You don't need Lass to use Tailwind. But when Tailwind's vocabulary isn't enough — when your design system speaks in `morning`, `noon`, `sunset`, and `nadir` — Lass generates the second vocabulary from your own data, at build time, from a JSON file your designers own.

```lass
---
import palette from './brand/palette.json'

const propertyMap = {
  bg:     color => `background-color: ${color};`,
  text:   color => `color: ${color};`,
  border: color => `border-color: ${color};`,
}
---
@import 'tailwindcss';

{{ Object.entries(palette.sun).flatMap(([moment, color]) =>
  Object.entries(propertyMap).map(([prefix, decl]) => @{
    .${prefix}-sun-${moment} { {{ decl(color) }} }
  })
) }}
```

> Note: `@import 'tailwindcss'` is CSS — it belongs in the CSS zone (after `---`), and must appear first. That's a CSS spec requirement, not a Lass rule.

Both vocabularies coexist in the same `class=""`:

```html
<div class="m-10 bg-sun-noon">Good afternoon</div>
<div class="hero bg-sun-nadir">Midnight mode</div>
```

## Quick Comparison

Different tools. Different approaches. Same goal.

|  | Sass | Less | Lass |
|---|------|------|------|
| Logic layer | Custom language (`@mixin`, `@if`, `@each`) | Custom language (`.mixin()`, `when()`) | JavaScript — the real thing |
| Variables | `$var` (Sass syntax) | `@var` (Less syntax) | `const $var = value` (real JS) |
| Loops | `@each $item in $list` | `each(@list, ...)` | `{{ items.map(i => ...) }}` |
| Imports | `@use 'tokens'` | `@import` | `import tokens from './tokens.json'` |

Maybe you don't need a preprocessor at all. Modern CSS is remarkable. But if you do need one — for token imports, for utility class generation, for anything that requires iteration — reach for the language you already know.

## Install

```bash
npm install @lass-lang/vite-plugin-lass --save-dev
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import lass from '@lass-lang/vite-plugin-lass'

export default defineConfig({
  plugins: [lass()]
})
```

## Syntax Highlighting

Code examples on this site use the Lass TextMate grammar for VS Code-quality syntax highlighting at build time. All highlighting is rendered server-side with zero client-side JavaScript.

## Links

- [More examples](examples/)
- [GitHub](https://github.com/lass-lang)
- [npm: @lass-lang/vite-plugin-lass](https://www.npmjs.com/package/@lass-lang/vite-plugin-lass)
- [MIT License](https://github.com/lass-lang/vite-plugin-lass/blob/main/LICENSE)
