// ============================================================
// Vex — Cross the line.
// Syntax Highlight — Shiki configuration for payload rendering
// ============================================================

import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Get or create the shared Shiki highlighter instance.
 * Uses a singleton pattern for efficiency.
 */
export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark-default'],
      langs: ['html', 'javascript', 'css'],
    });
  }
  return highlighterPromise;
}

/**
 * Highlight a payload string and return HTML.
 * Falls back to escaped plain text on error.
 */
export async function highlightPayload(
  code: string,
  lang: 'html' | 'javascript' | 'css' = 'html'
): Promise<string> {
  try {
    const highlighter = await getHighlighter();
    return highlighter.codeToHtml(code, {
      lang,
      theme: 'github-dark-default',
    });
  } catch {
    // Fallback: escape HTML and wrap in pre
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="shiki"><code>${escaped}</code></pre>`;
  }
}

/**
 * Detect the most appropriate language for a payload string.
 */
export function detectPayloadLang(payload: string): 'html' | 'javascript' | 'css' {
  const trimmed = payload.trim().toLowerCase();

  // Check for CSS patterns
  if (
    trimmed.startsWith('@import') ||
    trimmed.startsWith('expression(') ||
    trimmed.includes('background:') ||
    trimmed.includes('url(')
  ) {
    return 'css';
  }

  // Check for JavaScript patterns (no HTML tags)
  if (
    !trimmed.includes('<') &&
    (trimmed.startsWith('javascript:') ||
      trimmed.includes('alert(') ||
      trimmed.includes('eval(') ||
      trimmed.includes('document.') ||
      trimmed.includes('window.') ||
      trimmed.includes('=>'))
  ) {
    return 'javascript';
  }

  // Default to HTML (most XSS payloads are HTML-based)
  return 'html';
}
