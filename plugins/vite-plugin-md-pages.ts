import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'
import type { Plugin, Rollup } from 'vite'
// Import Lass TextMate grammar for build-time syntax highlighting
import lassGrammar from '../../../packages/vscode-lass/syntaxes/lass.tmLanguage.json' with { type: 'json' }

/** Strip YAML frontmatter (--- ... ---) from markdown content */
function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
  return match ? content.slice(match[0].length) : content
}

/** Recursively find all README.md files, excluding node_modules and _built-pages */
function findReadmes(dir: string, root: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '_built-pages' || entry === '.git' || entry === 'plugins' || entry === 'styles') continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...findReadmes(full, root))
    } else if (entry === 'README.md') {
      results.push(full)
    }
  }
  return results
}

export interface MdPagesOptions {
  template: string
}

export async function mdPages(options: MdPagesOptions): Promise<Plugin> {
  const shikiPlugin = await Shiki({
    themes: { dark: 'github-dark', light: 'github-light' },
    defaultColor: 'dark',
    // Load Lass TextMate grammar for build-time syntax highlighting
    // Grammar location: packages/vscode-lass/syntaxes/lass.tmLanguage.json
    // Provides VS Code-quality highlighting with zero client-side JavaScript
    langs: [
      {
        ...lassGrammar,
        name: 'lass',
      },
      'javascript', 'typescript', 'css', 'html', 'bash', 'json', 'scss'
    ],
  })

  const md = new MarkdownIt({ html: true })
  md.use(shikiPlugin)

  return {
    name: 'vite-plugin-md-pages',
    apply: 'build',
    enforce: 'post',

    generateBundle(_, bundle) {
      const root = process.cwd()
      const templatePath = join(root, options.template)
      const template = readFileSync(templatePath, 'utf-8')

      // Find the CSS asset emitted by Vite (compiled from .lass imports)
      let cssPath = ''
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith('.css')) {
          // Use relative path for portability (works with gh-pages, local preview, any hosting)
          cssPath = fileName.startsWith('assets/') ? fileName : `assets/${fileName}`
          break
        }
      }

      // Remove Vite's default index.html and JS entry — we generate our own pages
      for (const fileName of Object.keys(bundle)) {
        if (fileName === 'index.html' || fileName.endsWith('.js')) {
          delete bundle[fileName]
        }
      }

      const readmes = findReadmes(root, root)

      for (const readme of readmes) {
        const raw = readFileSync(readme, 'utf-8')
        const content = stripFrontmatter(raw)
        const html = md.render(content)
        
        const rel = relative(root, dirname(readme))
        const outPath = rel ? `${rel}/index.html` : 'index.html'
        
        // Calculate relative CSS path based on page depth
        // Root level: assets/file.css
        // One level deep: ../assets/file.css
        const depth = rel ? rel.split('/').length : 0
        const cssRelativePath = depth > 0 
          ? '../'.repeat(depth) + cssPath
          : cssPath
        
        const page = template
          .replace('{{content}}', html)
          .replace('{{css}}', cssRelativePath)

        this.emitFile({
          type: 'asset',
          fileName: outPath,
          source: page,
        })
      }
    },
  }
}
