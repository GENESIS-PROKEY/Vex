// ============================================================
// Vex — Cross the line.
// Context Suggestions — Smart recommendations based on filters
// ============================================================

import type { InjectionContext } from '@/types';

interface ContextSuggestion {
  context: InjectionContext;
  title: string;
  description: string;
  tips: string[];
}

export const CONTEXT_SUGGESTIONS: ContextSuggestion[] = [
  {
    context: 'html',
    title: 'HTML Tag Injection',
    description: 'You\'re injecting directly into the HTML body.',
    tips: [
      'Try <script>, <img>, <svg>, or <details> tags',
      'Use event handlers like onerror, onload, ontoggle',
      'Consider HTML5 semantic tags for WAF bypass',
      'Check if the context is inside a comment or CDATA',
    ],
  },
  {
    context: 'attribute',
    title: 'Attribute Breakout',
    description: 'Your injection point is inside an HTML attribute.',
    tips: [
      'Close the attribute with a matching quote (" or \')',
      'Add an event handler like onfocus or onmouseover',
      'Try autofocus with onfocus for guaranteed execution',
      'Use // to comment out the rest of the tag',
    ],
  },
  {
    context: 'javascript',
    title: 'JavaScript Context',
    description: 'You\'re inside a <script> block or JS expression.',
    tips: [
      'Break out of string context with quote characters',
      'Use template literal injection with ${...}',
      'Try constructor-based execution: [].constructor.constructor("alert(1)")()',
      'Close the <script> tag and inject new HTML',
    ],
  },
  {
    context: 'url',
    title: 'URL/Protocol Context',
    description: 'Your injection is inside an href, src, or action attribute.',
    tips: [
      'Use javascript: protocol directly',
      'Try data: URI with base64 encoding',
      'Bypass protocol checks with //javascript:, \\javascript:',
      'URL-encode special characters to bypass filters',
    ],
  },
  {
    context: 'css',
    title: 'CSS Context',
    description: 'You\'re injecting inside a style attribute or stylesheet.',
    tips: [
      'Use expression() in older IE versions',
      'Try url() with javascript: protocol (legacy)',
      'Break out of CSS context to inject HTML',
      'Use CSS escape sequences for character bypass',
    ],
  },
  {
    context: 'dom',
    title: 'DOM Sink Injection',
    description: 'Your input flows into a DOM manipulation sink.',
    tips: [
      'Common sinks: innerHTML, document.write, eval',
      'Check for jQuery .html(), .append() usage',
      'location.hash and location.search are common sources',
      'Use DOM clobbering techniques for attribute overwrite',
    ],
  },
];

/** Get suggestions for the given injection context */
export function getSuggestionsForContext(
  context: InjectionContext
): ContextSuggestion | undefined {
  return CONTEXT_SUGGESTIONS.find((s) => s.context === context);
}
