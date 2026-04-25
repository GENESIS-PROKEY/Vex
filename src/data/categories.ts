// ============================================================
// Vex — Cross the line.
// Category Definitions
// ============================================================

import type { CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'basic',
    name: 'Basic XSS',
    description: 'Fundamental XSS vectors — script tags, event handlers, and simple injections',
    icon: 'Zap',
    count: 0,
    color: '#00ff88',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Complex techniques requiring deep JavaScript and browser knowledge',
    icon: 'Brain',
    count: 0,
    color: '#00d4ff',
  },
  {
    id: 'bypass',
    name: 'Filter Bypass',
    description: 'Encoding, case variation, and character manipulation to evade input filters',
    icon: 'ShieldOff',
    count: 0,
    color: '#ff8800',
  },
  {
    id: 'waf',
    name: 'WAF Bypass',
    description: 'Techniques targeting specific Web Application Firewalls',
    icon: 'Shield',
    count: 0,
    color: '#ff3366',
  },
  {
    id: 'csp',
    name: 'CSP Bypass',
    description: 'Content Security Policy evasion via JSONP, data URIs, and script gadgets',
    icon: 'Lock',
    count: 0,
    color: '#a855f7',
  },
  {
    id: 'dom',
    name: 'DOM-Based',
    description: 'Client-side DOM manipulation, innerHTML, document.write, and sink-based XSS',
    icon: 'Code2',
    count: 0,
    color: '#3b82f6',
  },
  {
    id: 'event',
    name: 'Event Handlers',
    description: 'onclick, onfocus, onmouseover, and other DOM event-based triggers',
    icon: 'MousePointerClick',
    count: 0,
    color: '#22d3ee',
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Universal payloads that execute across multiple injection contexts',
    icon: 'Layers',
    count: 0,
    color: '#f59e0b',
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description: 'Touch events, gesture handlers, and mobile-browser-specific vectors',
    icon: 'Smartphone',
    count: 0,
    color: '#10b981',
  },
  {
    id: 'browser',
    name: 'Browser-Specific',
    description: 'Quirks and parser differences in Chrome, Firefox, Safari, and Edge',
    icon: 'Globe',
    count: 0,
    color: '#6366f1',
  },
  {
    id: 'framework',
    name: 'Framework',
    description: 'AngularJS, React, Vue, jQuery, and other framework-specific injection vectors',
    icon: 'Boxes',
    count: 0,
    color: '#ec4899',
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Well-documented, academic-grade research payloads and novel techniques',
    icon: 'FlaskConical',
    count: 0,
    color: '#8b5cf6',
  },
  {
    id: 'context',
    name: 'Context-Specific',
    description: 'Payloads crafted for specific injection contexts — attributes, URLs, CSS',
    icon: 'Target',
    count: 0,
    color: '#14b8a6',
  },
  {
    id: 'unicode',
    name: 'Unicode',
    description: 'Unicode normalization, homoglyph, and character encoding attacks',
    icon: 'Languages',
    count: 0,
    color: '#f97316',
  },
  {
    id: 'api',
    name: 'API',
    description: 'XSS vectors targeting REST APIs, GraphQL, and web service endpoints',
    icon: 'Webhook',
    count: 0,
    color: '#06b6d4',
  },
  {
    id: 'blind',
    name: 'Blind XSS',
    description: 'Out-of-band exfiltration payloads for stored/blind XSS scenarios',
    icon: 'EyeOff',
    count: 0,
    color: '#ef4444',
  },
  {
    id: 'social',
    name: 'Social Engineering',
    description: 'XSS combined with social engineering techniques for interactive attacks',
    icon: 'Users',
    count: 0,
    color: '#d946ef',
  },
  {
    id: 'unique',
    name: 'Unique & Rare',
    description: 'Unusual, creative, and rarely-seen XSS techniques',
    icon: 'Sparkles',
    count: 0,
    color: '#eab308',
  },
  {
    id: 'non-english',
    name: 'Non-English',
    description: 'Payloads leveraging non-ASCII character sets and RTL text',
    icon: 'Type',
    count: 0,
    color: '#84cc16',
  },
];

/** Quick lookup map: category ID → CategoryInfo */
export const CATEGORY_MAP = new Map(
  CATEGORIES.map((cat) => [cat.id, cat])
);

/** Get a category by ID with fallback */
export function getCategoryInfo(id: string): CategoryInfo {
  return (
    CATEGORY_MAP.get(id as CategoryInfo['id']) ?? {
      id: id as CategoryInfo['id'],
      name: id.charAt(0).toUpperCase() + id.slice(1),
      description: '',
      icon: 'HelpCircle',
      count: 0,
      color: '#888888',
    }
  );
}
