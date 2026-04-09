# Tooling

> Editor support. Syntax highlighting. Language intelligence.

Lass ships with first-class editor tooling so you get the same developer experience you expect from CSS and TypeScript — highlighting, auto-complete, bracket matching — in `.lass` files.

## VS Code Extension

**Lass Language Support** — Official VS Code extension.

Install from the VS Code Marketplace:

1. Open Extensions (Cmd+Shift+X / Ctrl+Shift+X)
2. Search for **"Lass Language Support"**
3. Click **Install**

Or from the command line:

```bash
code --install-extension lass-lang.vscode-lass
```

### What you get

- **Syntax highlighting** — Full TextMate grammar with proper two-zone highlighting. The TypeScript preamble (above `---`) is highlighted as TypeScript. The CSS zone (below `---`) is highlighted as CSS. Lass symbols (`{{ }}`, `@{ }`, `@( )`, `$name`) are highlighted as embedded constructs.
- **Smart editing** — Auto-closing pairs for `{{ }}`, `@{ }`, and `@( )`. Type the opening symbol and the closing one appears automatically.
- **Comment toggling** — Cmd+/ toggles `//` line comments. Shift+Alt+A toggles `/* */` block comments.
- **Bracket matching** — Intelligent matching across CSS braces, JS brackets, and Lass symbols.
- **Language Server** — Volar-based Language Server Protocol implementation providing IntelliSense for the TypeScript preamble. Powered by `@lass-lang/language-server`.

### Supported symbols

| Symbol | Purpose | Auto-close |
|--------|---------|------------|
| `---` | Zone separator (preamble / CSS) | — |
| `$name` | Variable substitution | — |
| `{{ expr }}` | TypeScript expression interpolation | Yes |
| `@{ css }` | Style block | Yes |
| `@(prop)` | Property lookup accessor | Yes |
| `//` | Single-line comment (stripped from output) | — |

[Extension on GitHub](https://github.com/lass-lang/vscode-lass-languageservice)

---

## TextMate Grammar

**`@lass-lang/lass-tmlanguage`** — The canonical grammar definition.

The TextMate grammar is the single source of truth for Lass syntax highlighting. It's used by:

- **VS Code** — via the Lass Language Support extension
- **Shiki** — for server-side highlighting (used by this website)
- **Any TextMate-compatible editor** — Sublime Text, Atom, TextMate, etc.
- **Documentation tools** — GitHub, GitLab, and other Markdown renderers that support custom grammars

### Usage with Shiki

```js
import { createHighlighter } from 'shiki'
import lassGrammar from '@lass-lang/lass-tmlanguage'

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: [{ ...lassGrammar, name: 'lass' }],
})

const html = highlighter.codeToHtml(lassCode, { lang: 'lass' })
```

### Usage in a VS Code extension

```json
{
  "contributes": {
    "grammars": [
      {
        "language": "lass",
        "scopeName": "source.lass",
        "path": "./node_modules/@lass-lang/lass-tmlanguage/lass.tmLanguage.json"
      }
    ]
  }
}
```

### What it highlights

- **Script Preamble** — TypeScript code between `---` delimiters
- **Expression interpolation** — `{{ expression }}` blocks
- **Style blocks** — `@{ css }` embedded CSS in TypeScript context
- **Variable substitution** — `$variable` references
- **Property accessors** — `@(property)` lookups
- **Line comments** — `//` single-line comments
- **Full CSS** — Complete CSS syntax with Lass extensions

[Package on npm](https://www.npmjs.com/package/@lass-lang/lass-tmlanguage) | [GitHub](https://github.com/lass-lang/lass-tmlanguage)

---

## Language Server

**`@lass-lang/language-server`** — Volar-based LSP implementation.

The language server provides IDE intelligence for `.lass` files. It's built on [Volar](https://volarjs.dev/) — the same framework that powers Vue's language tooling.

### What it provides

- **IntelliSense** for the TypeScript preamble — auto-complete, hover information, go-to-definition
- **Diagnostics** — TypeScript errors surfaced directly in the editor
- **Virtual document model** — The preamble and CSS zone are treated as separate embedded languages, each getting full language support

The language server is consumed by the VS Code extension and can be integrated into any editor that supports the Language Server Protocol (Neovim, Emacs, Sublime Text, etc.).

[Package on npm](https://www.npmjs.com/package/@lass-lang/language-server) | [GitHub](https://github.com/lass-lang/lass-language-server)

---

## This Website

The site you're reading uses Lass tooling to highlight its own code examples:

1. **Shiki** loads the Lass TextMate grammar at build time
2. **markdown-it** renders Markdown pages with Shiki-highlighted code blocks
3. **vite-plugin-lass** processes the site's own `.lass` stylesheets (dogfooding)
4. The result is **VS Code-quality syntax highlighting with zero client-side JavaScript**

All highlighting is pre-rendered to static HTML during the Vite build.

## Links

- [Home](../)
- [Getting Started](../getting-started/)
- [Ecosystem](../ecosystem/) — Vite, Bun, Webpack plugins
- [Examples](../examples/)
