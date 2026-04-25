// ============================================================
// Vex — Cross the line.
// Filter Presets — Quick-access filter combinations
// ============================================================

import type { FilterPreset } from '@/types';

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'beginner-friendly',
    name: 'Beginner Friendly',
    description: 'Simple, well-documented payloads for learning XSS basics',
    icon: 'GraduationCap',
    filters: {
      difficulties: ['beginner'],
      categories: ['basic'],
    },
  },
  {
    id: 'waf-cloudflare',
    name: 'Cloudflare Bypass',
    description: 'Payloads designed to bypass Cloudflare WAF',
    icon: 'Shield',
    filters: {
      wafTargets: ['cloudflare'],
    },
  },
  {
    id: 'waf-modsecurity',
    name: 'ModSecurity Bypass',
    description: 'Payloads targeting ModSecurity rulesets',
    icon: 'Shield',
    filters: {
      wafTargets: ['modsecurity'],
    },
  },
  {
    id: 'csp-bypass',
    name: 'CSP Evasion',
    description: 'Payloads that bypass Content Security Policy restrictions',
    icon: 'Lock',
    filters: {
      categories: ['csp'],
    },
  },
  {
    id: 'short-payloads',
    name: 'Short Payloads (<50 chars)',
    description: 'Compact payloads for length-restricted inputs',
    icon: 'Minimize2',
    filters: {
      maxCharacters: 50,
      sortBy: 'characters',
      sortOrder: 'asc',
    },
  },
  {
    id: 'dom-xss',
    name: 'DOM-Based XSS',
    description: 'Client-side DOM manipulation payloads',
    icon: 'Code2',
    filters: {
      categories: ['dom'],
      contexts: ['dom'],
    },
  },
  {
    id: 'expert-polyglot',
    name: 'Expert Polyglots',
    description: 'Universal payloads that work across multiple contexts',
    icon: 'Layers',
    filters: {
      categories: ['polyglot'],
      difficulties: ['expert'],
    },
  },
  {
    id: 'attribute-injection',
    name: 'Attribute Injection',
    description: 'Payloads for breaking out of HTML attributes',
    icon: 'Target',
    filters: {
      contexts: ['attribute'],
    },
  },
  {
    id: 'encoding-bypass',
    name: 'Encoding Tricks',
    description: 'Payloads using URL, hex, unicode, or base64 encoding',
    icon: 'Binary',
    filters: {
      encodings: ['url', 'hex', 'unicode', 'base64', 'html-entity'],
    },
  },
  {
    id: 'framework-specific',
    name: 'Framework Exploits',
    description: 'AngularJS, React, Vue, and jQuery-specific vectors',
    icon: 'Boxes',
    filters: {
      categories: ['framework'],
    },
  },
];
