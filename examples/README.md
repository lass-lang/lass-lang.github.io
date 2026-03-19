# Landing Page Code Examples

Five verified examples for the lass-lang.dev landing page.
Every example has been transpiled and executed through `@lass-lang/core`.
Tests: `packages/lass-core/test/landing-examples.test.ts`

---

## Example 1: CSS Passthrough

**Caption:** Rename any `.css` file to `.lass`. Nothing changes. Start there.

**Input (`card.lass`):**

```lass
.card {
  --card-bg: oklch(97% 0.01 240);
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;

  & h2 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
  }

  & p {
    color: oklch(45% 0 0);
    line-height: 1.6;
  }
}

@layer components {
  .card { container-type: inline-size; }
}
```

**Output (`card.css`):**

```css
.card {
  --card-bg: oklch(97% 0.01 240);
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;

  & h2 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
  }

  & p {
    color: oklch(45% 0 0);
    line-height: 1.6;
  }
}

@layer components {
  .card { container-type: inline-size; }
}
```

**Notes:** Input and output are byte-identical. Uses modern CSS: nesting (`&`), custom properties (`--card-bg`), `@layer`. This is the "zero risk" example — existing CSS works unchanged.

---

## Example 2: Design Token Import

**Caption:** Your token file is just JSON. Import it like any JavaScript module.

**`palette.json`:**

```json
{
  "sun": {
    "morning": "oklch(85% 0.12 85)",
    "noon":    "oklch(95% 0.08 95)",
    "sunset":  "oklch(65% 0.18 35)",
    "nadir":   "oklch(15% 0.05 270)"
  }
}
```

**Input (`tokens.lass`):**

```lass
import palette from './palette.json'
---
:root {
{{ Object.entries(palette.sun).map(([name, value]) => `  --sun-${name}: ${value};`).join('\n') }}
}
```

**Output (`tokens.css`):**

```css
:root {
  --sun-morning: oklch(85% 0.12 85);
  --sun-noon: oklch(95% 0.08 95);
  --sun-sunset: oklch(65% 0.18 35);
  --sun-nadir: oklch(15% 0.05 270);
}
```

**Notes:** The `import` is real JavaScript — no plugin, no config, no custom syntax. The `{{ }}` expression runs at build time and inserts the result into the CSS. Story 9.3: show `.lass` on left, `.css` on right.

---

## Example 3: Sass `@each` vs Lass `.map()`

**Caption:** No new loop syntax. You already know `.map()`.

**Sass (for comparison — not compiled):**

```scss
$sizes: 4, 8, 16, 24, 32;
@each $size in $sizes {
  .gap-#{$size} { gap: #{$size}px; }
}
```

**Input (`gap-utils.lass`):**

```lass
const sizes = [4, 8, 16, 24, 32]
--- generate gap utilities
{{ sizes.map(s => @{
.gap-${s} {
  gap: ${s}px;
}
}) }}
```

**Output (`gap-utils.css`):**

```css
.gap-4 {
  gap: 4px;
}
.gap-8 {
  gap: 8px;
}
.gap-16 {
  gap: 16px;
}
.gap-24 {
  gap: 24px;
}
.gap-32 {
  gap: 32px;
}
```

**Notes:** This example shows a side-by-side paradigm comparison. The Sass side is displayed but NOT compiled — it's just for visual contrast. The Lass side is compiled and verified. Multi-line `@{ }` blocks naturally produce newline-separated output (arrays auto-join with `\n` when items contain newlines). `${}` is standard JS template literal interpolation (for class names). `{{ }}` is Lass's crossing point from JS into CSS. Story 9.3: show Sass on left, Lass on right, with CSS output below.

---

## Example 4: `@(prop)` Lookup

**Caption:** CSS knows its own values. Ask it.

**Input (`button.lass`):**

```lass
--- component with derived values
.button {
  border: 2px solid oklch(50% 0.2 250);
  outline-offset: 4px;
  outline: @border;
}
```

**Output (`button.css`):**

```css
.button {
  border: 2px solid oklch(50% 0.2 250);
  outline-offset: 4px;
  outline: 2px solid oklch(50% 0.2 250);
}
```

**Notes:** `@border` reads the previously declared `border` value at build time — no repetition, no variable. The full form `@(border)` also works. This is compile-time CSS value reuse, unique to Lass. The CSS-only alternative would require repeating `2px solid oklch(50% 0.2 250)` or introducing a custom property for a single-use value. Story 9.3: show `.lass` on left, `.css` on right.

---

## Example 5: Tailwind + Lass Custom Variants

**Caption:** Tailwind gives you utilities. Lass gives you the rest.

**Input (`themes.lass`):**

```lass
const themes = ["sunrise", "noon", "sunset", "midnight"]
---
@import "tailwindcss";

{{ themes.map(t => @{
  @custom-variant theme-${t} {
    &:where([data-theme="${t}"] *) {
      @slot;
    }
  }
}) }}
```

**Output (`themes.css`):**

```css
@import "tailwindcss";

@custom-variant theme-sunrise {
  &:where([data-theme="sunrise"] *) {
    @slot;
  }
}
@custom-variant theme-noon {
  &:where([data-theme="noon"] *) {
    @slot;
  }
}
@custom-variant theme-sunset {
  &:where([data-theme="sunset"] *) {
    @slot;
  }
}
@custom-variant theme-midnight {
  &:where([data-theme="midnight"] *) {
    @slot;
  }
}
```

**HTML usage:**

```html
<div class="theme-sunset:bg-orange-500 theme-midnight:text-white">
  Adapts to the time of day
</div>
```

**Notes:** Tailwind's `@custom-variant` lets you define conditional variants. Lass lets you generate them from a list instead of writing each one by hand. The preamble is one line of JavaScript. The CSS zone uses `@{ }` to produce a CSS block per theme and `${}` for the theme name (JS template literal, since we're building selectors in JS-land). `@import`, `@custom-variant`, `@slot` are all CSS — they pass through untouched. Story 9.3: show `.lass` on left, `.css` on right, HTML snippet below.
