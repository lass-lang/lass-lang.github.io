# Development Approach

> Documentation first. Tests from docs. Implementation from tests.

Lass follows a documentation-driven development methodology where the language specification, test suite, and human-readable documentation are the same artifact.

## The Axiom Model

An **axiom** is a Markdown file that defines one language feature as a set of testable input/output pairs. Each axiom is simultaneously:

1. **Specification** — the authoritative definition of what the feature does
2. **Test suite** — a parser extracts test cases and runs them automatically
3. **Documentation** — the same file renders as readable docs on the documentation site

There are no separate spec documents, no hand-written test fixtures, no documentation that can drift from the implementation.

### What an axiom looks like

An axiom file is standard Markdown with YAML frontmatter and `<test-case>` elements:

````markdown
---
feature: expression-interpolation
fr: FR-003
phase: MVP
description: "{{ expr }} evaluates JS and inserts result"
tags: [syntax, expressions]
---

# Expression Interpolation

The `{{ }}` syntax evaluates a JavaScript expression at build time
and inserts the result into the CSS output.

<test-case type="valid">
```lass
---
const size = 16
---
.box { padding: {{ size }}px; }
```

```css
.box { padding: 16px; }
```
</test-case>
````

The prose explains the feature. The `<test-case>` blocks prove it works.

### Test case types

| Type | Meaning |
|------|---------|
| `type="valid"` | Lass input compiles to the expected CSS output |
| `type="invalid"` | Lass input throws an error containing the expected message |
| `skip` attribute | Skipped — requires external mocks (e.g., import resolution) |

### File naming

| Pattern | Purpose |
|---------|---------|
| `feature.common.md` | Main documentation + primary test cases |
| `feature.extra-cases.md` | Edge cases, regressions, boundary conditions |

## From Docs to Tests

The `@lass-lang/docs` package contains a test extractor that parses axiom files and generates vitest tests dynamically:

```
Axiom Markdown
    -> extractTestCasesFromMD()
    -> TestCase[]
    -> transpile(input)
    -> executeTranspiledCode(code)
    -> compare output to expected CSS
```

Two test runners consume axioms:

- **`lass-core` axiom tests** — Exercises the core transpiler against all axiom `<test-case>` blocks. Catches any behavioral regression.
- **`lass-docs` docs tests** — Exercises documentation examples (getting-started, syntax reference). Ensures every code example on the docs site is correct.

No test is written by hand unless it tests implementation internals that don't belong in the spec.

## From Tests to Implementation

The development cycle:

1. **Write the axiom first** — Define what the feature should do with prose and test cases
2. **Watch tests fail** — Run the test suite; new axiom tests fail because the feature doesn't exist yet
3. **Implement** — Write the code in `@lass-lang/core` until all axiom tests pass
4. **Add unit tests** — For implementation-specific edge cases not covered by axioms (scanner internals, error messages, etc.)
5. **Ship** — The axiom is now the documentation, the test, and the spec

This is similar to TDD, but the "tests" are also the documentation and the language specification. There's only one source of truth.

## Coverage

The axiom-driven approach produces comprehensive coverage with minimal manual test writing:

| Package | Tests | Pass | Skip | Coverage |
|---------|-------|------|------|----------|
| lass-core | 553 | 516 | 37 | 100% lines |
| lass-cli | 73 | 73 | 0 | 100% lines |
| lass-plugin-utils | 20 | 20 | 0 | 100% lines |
| vite-plugin-lass | 54 | 54 | 0 | 100% lines |
| bun-plugin-lass | 24 | 24 | 0 | 97.7% lines |
| lass-docs | 309 | 272 | 37 | 98.7% lines |
| **Total** | **1033** | **959** | **74** | |

Skipped tests require bundler-level import resolution that can't run in a pure transpiler test.

## Why This Works

**No drift.** The spec, the tests, and the docs are one file. Change the behavior? Update the axiom. The tests update themselves. The docs update themselves.

**Refactor fearlessly.** 1033 tests — most generated from documentation — catch regressions before they ship.

**AI-friendly.** The `llms.txt` file is generated from axiom content, giving language models a dense, accurate reference. The axioms themselves serve as few-shot examples for code generation.

**Contributor-friendly.** Want to add a feature? Write the axiom first. Describe what it does in plain English. Add input/output examples. The test infrastructure does the rest.

## Documentation Site

The full axiom-driven documentation — including the complete syntax reference, getting-started guide, and all test cases — will be available at the dedicated documentation site (coming soon, powered by `@lass-lang/docs`).

## Links

- [Home](../)
- [Getting Started](../getting-started/)
- [Ecosystem](../ecosystem/) — Vite, Bun, Webpack plugins
- [Tooling](../tooling/) — VS Code, syntax highlighting
- [GitHub](https://github.com/lass-lang)
