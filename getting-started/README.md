# Getting Started

> Pick your tool. Write `.lass`. Ship CSS.

Lass integrates with your existing build tool. Pick the one you use, add the plugin, and rename a `.css` file to `.lass`. That's it — any valid CSS works unchanged.

## Vite

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

Import `.lass` files like CSS:

```js
import './styles/theme.lass'
```

Hot Module Replacement works out of the box — edit a `.lass` file and see changes instantly.

## Bun

```bash
bun add @lass-lang/bun-plugin-lass --dev
```

### With Bun.build()

```js
import lass from '@lass-lang/bun-plugin-lass'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  plugins: [lass()],
})
```

### With bunfig.toml (preload)

For automatic `.lass` support without explicit plugin configuration:

```toml
# bunfig.toml
preload = ["@lass-lang/bun-plugin-lass/preload"]
```

Then import `.lass` files directly — no build script needed.

## Webpack

```bash
npm install @lass-lang/webpack-plugin-lass css-loader mini-css-extract-plugin --save-dev
```

```js
// webpack.config.js
const { LassPlugin } = require('@lass-lang/webpack-plugin-lass')

module.exports = {
  plugins: [new LassPlugin()],
}
```

The plugin auto-configures `module.rules` for `.lass` files. For manual loader setup, see the [webpack plugin README](https://github.com/lass-lang/webpack-plugin-lass).

## CLI

For one-off compilation or CI pipelines:

```bash
npm install @lass-lang/cli --save-dev
```

```bash
# Compile a single file
npx lass button.lass dist/button.css

# Compile a directory (preserves structure)
npx lass src/styles/ --out dist/css/

# Pipe from stdin
echo ".box { color: blue; }" | npx lass --stdin
```

## Your First .lass File

Create `theme.lass`. Start with plain CSS — no preamble needed:

```lass
:root {
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
}

.button {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.button:hover {
  background: var(--color-secondary);
}
```

That compiles to identical CSS. Zero risk.

When you need logic, add a TypeScript preamble:

```lass
---
const sizes = [4, 8, 16, 24, 32]
--- generate gap utilities
{{ sizes.map(s => @{
.gap-${s} {
  gap: ${s}px;
}
}) }}
```

## TypeScript Declarations

For TypeScript projects, create `src/lass.d.ts`:

```typescript
// Side-effect imports (import './styles.lass')
declare module '*.lass';

// CSS Modules (import styles from './component.module.lass')
declare module '*.module.lass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

Include it in your `tsconfig.json`:

```json
{
  "include": ["src/**/*.ts", "src/**/*.d.ts"]
}
```

## CSS Modules

All three bundler plugins support CSS Modules via `.module.lass`:

```typescript
import styles from './Card.module.lass'

element.className = styles.card  // Scoped class name
```

## Links

- [Home](../)
- [Ecosystem](../ecosystem/) — Vite, Bun, Webpack plugin details
- [Tooling](../tooling/) — VS Code, syntax highlighting
- [Examples](../examples/)
