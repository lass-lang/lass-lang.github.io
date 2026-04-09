# Ecosystem

> Three bundler plugins. Same API surface. Same CSS output.

Lass ships official plugins for Vite, Bun, and Webpack. Each plugin follows the same pattern: intercept `.lass` imports, transpile to a JavaScript module via `@lass-lang/core`, execute the module to extract the CSS string, and hand the result to your bundler's CSS pipeline.

The output is always static CSS. No runtime. No client-side JavaScript.

## Vite Plugin

**`@lass-lang/vite-plugin-lass`** — The flagship integration.

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

**Key features:**

- **Hot Module Replacement** — Edit a `.lass` file, see the change instantly. HMR works through Vite's standard CSS handling.
- **CSS Modules** — Name your file `.module.lass` and import scoped class names.
- **TypeScript-first** — Preambles are TypeScript by default. Respects your `tsconfig.json` when present.
- **Zero config** — Works out of the box. One optional setting: `verbose: true` for debug logging.

**How it works:**

1. Intercepts `.lass` file imports
2. Resolves `.lass` to a virtual `.css` module (e.g., `theme.lass` -> `theme.css`)
3. Transpiles via `@lass-lang/core` to a JavaScript module
4. Executes the JS module to extract the CSS string
5. Returns CSS to Vite's pipeline for standard processing (PostCSS, minification, etc.)

**Peer dependency:** Vite 5 or 6.

[Full README on GitHub](https://github.com/lass-lang/vite-plugin-lass)

---

## Bun Plugin

**`@lass-lang/bun-plugin-lass`** — Native Bun integration.

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

### With bunfig.toml (zero-config preload)

```toml
# bunfig.toml
preload = ["@lass-lang/bun-plugin-lass/preload"]
```

This registers the plugin globally — `.lass` imports work everywhere without explicit plugin configuration.

**Key features:**

- **CSS Modules** — `.module.lass` files return scoped class name objects.
- **Preload mode** — Register via `bunfig.toml` for zero-config builds.
- **TypeScript-first** — Same TypeScript-by-default behavior as all Lass plugins.

**How it works:**

1. Hooks into Bun's `onResolve`/`onLoad` plugin API
2. Transpiles `.lass` source to JS via `@lass-lang/core`
3. Executes JS to extract CSS string
4. Returns CSS with `loader: "css"` to Bun's CSS pipeline
5. For `.module.lass`: resolves to a virtual `.module.css` path for CSS Modules scoping

**Limitation:** Bun's plugin API doesn't support HMR. For development with hot reloading, use Vite with `@lass-lang/vite-plugin-lass`.

**Peer dependency:** Bun 1.0+.

[Full README on GitHub](https://github.com/lass-lang/bun-plugin-lass)

---

## Webpack Plugin

**`@lass-lang/webpack-plugin-lass`** — Webpack 5 loader and plugin.

```bash
npm install @lass-lang/webpack-plugin-lass css-loader mini-css-extract-plugin --save-dev
```

### Plugin mode (recommended)

```js
// webpack.config.js
const { LassPlugin } = require('@lass-lang/webpack-plugin-lass')

module.exports = {
  plugins: [new LassPlugin()],
}
```

The plugin auto-configures `module.rules` — no manual loader setup needed.

### Manual loader mode

For projects that need custom loader chains:

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.lass$/,
        use: ['@lass-lang/webpack-plugin-lass'],
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
}
```

**Key features:**

- **Auto-configuration** — `LassPlugin` sets up `module.rules` for you.
- **CSS Modules** — `.module.lass` works with `css-loader`'s module support.
- **Watch mode** — Preamble imports are preserved in webpack's module graph for automatic rebuilds.
- **TypeScript-first** — Same default behavior as all Lass plugins.

**How it works (Svelte-style pattern):**

1. First pass: Loader transpiles `.lass` to JS, executes it to extract CSS
2. Caches the CSS and returns JS with a self-referencing inline `!=!` import
3. Second pass: Loader returns cached CSS to webpack's CSS pipeline
4. Preamble imports stay in the module graph for watch/rebuild support

**Peer dependency:** Webpack 5+.

[Full README on GitHub](https://github.com/lass-lang/webpack-plugin-lass)

---

## Shared Plugin Utilities

All three plugins share common logic via `@lass-lang/plugin-utils`:

- **tsconfig detection** — Automatically finds and respects your `tsconfig.json`
- **Script language mode** — TypeScript by default; opt into JavaScript with `useJS: true`
- **Consistent API** — All plugins accept the same options (`verbose`, `useJS`)

## CLI

For standalone compilation outside of a bundler:

```bash
npm install @lass-lang/cli --save-dev
```

```bash
npx lass button.lass dist/button.css
npx lass src/styles/ --out dist/css/
```

The CLI uses the same `@lass-lang/core` transpiler as the bundler plugins. Same input, same output.

[Full CLI docs on GitHub](https://github.com/lass-lang/cli)

---

## Comparison

|  | Vite | Bun | Webpack |
|---|------|-----|---------|
| HMR | Yes | No | Watch mode |
| CSS Modules | `.module.lass` | `.module.lass` | `.module.lass` |
| TypeScript default | Yes | Yes | Yes |
| Zero-config | `lass()` | `bunfig.toml` preload | `new LassPlugin()` |
| Peer dep | Vite 5/6 | Bun 1.0+ | Webpack 5+ |

## Links

- [Home](../)
- [Getting Started](../getting-started/)
- [Tooling](../tooling/) — VS Code, syntax highlighting
- [Examples](../examples/)
