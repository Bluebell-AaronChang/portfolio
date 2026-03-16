import MarkdownIt from 'markdown-it'
import type { Highlighter } from 'shiki'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: [
          'javascript', 'typescript', 'vue', 'html', 'css', 'json',
          'bash', 'sql', 'python', 'csharp', 'java', 'yaml', 'markdown',
          'dart', 'swift', 'kotlin', 'go', 'rust', 'dockerfile',
        ],
      }),
    )
  }
  return highlighterPromise
}

export async function renderMarkdown(content: string): Promise<string> {
  const html = md.render(content)

  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g
  const matches = [...html.matchAll(codeBlockRegex)]

  if (matches.length === 0) return html

  let highlighter: Highlighter | null = null

  // Only load shiki if there are non-mermaid code blocks
  const hasNonMermaid = matches.some(m => m[1] !== 'mermaid')
  if (hasNonMermaid) {
    try {
      highlighter = await getHighlighter()
    } catch {
      // fall through — mermaid blocks can still be handled
    }
  }

  let result = html

  for (const match of matches) {
    const [fullMatch, lang, rawCode] = match
    const decoded = decodeHtmlEntities(rawCode)

    // Replace mermaid blocks with a special container div
    if (lang === 'mermaid') {
      const mermaidHtml = `<div class="mermaid-block">${decoded}</div>`
      result = result.replace(fullMatch, mermaidHtml)
      continue
    }

    if (!highlighter) continue

    const loadedLangs = highlighter.getLoadedLanguages()
    if (!loadedLangs.includes(lang as never)) {
      try {
        await highlighter.loadLanguage(lang as never)
      } catch {
        continue
      }
    }

    try {
      const highlighted = highlighter.codeToHtml(decoded, {
        lang,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
      })
      result = result.replace(fullMatch, highlighted)
    } catch {
      continue
    }
  }

  return result
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
