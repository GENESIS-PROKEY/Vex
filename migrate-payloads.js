// ============================================================
// Vex — Payload Migration Script
// Parses the original payloads.yaml and generates TypeScript data files
// ============================================================

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const YAML_PATH = path.join(__dirname, '..', 'XSSNow-original', 'data', 'payloads.yaml');
const OUTPUT_DIR = path.join(__dirname, 'src', 'data', 'payloads');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse YAML
const yamlContent = fs.readFileSync(YAML_PATH, 'utf8');
const data = yaml.load(yamlContent);
const payloads = data.payloads;

console.log(`Loaded ${payloads.length} payloads from YAML`);

// Helper: infer injection context from payload + tags + description
function inferContext(payload) {
  const code = (payload.code || '').toLowerCase();
  const desc = (payload.description || '').toLowerCase();
  const tags = (payload.tags || []).map(t => t.toLowerCase());
  const cat = (payload.category || '').toLowerCase();

  if (tags.includes('css') || desc.includes('css context') || desc.includes('css expression')) return 'css';
  if (tags.includes('url') || desc.includes('url context') || desc.includes('javascript protocol') || desc.includes('data uri')) return 'url';
  if (cat === 'dom' || tags.includes('dom') || desc.includes('dom ') || desc.includes('innerhtml') || desc.includes('document.write')) return 'dom';
  if (tags.includes('attribute') || desc.includes('attribute') || desc.includes('attribute context')) return 'attribute';
  if (tags.includes('javascript') || desc.includes('javascript context') || desc.includes('template literal') || desc.includes('function breakout')) return 'javascript';
  return 'html';
}

// Helper: infer difficulty from category + tags + description
function inferDifficulty(payload) {
  const cat = (payload.category || '').toLowerCase();
  const tags = (payload.tags || []).map(t => t.toLowerCase());
  const desc = (payload.description || '').toLowerCase();

  if (cat === 'basic') return 'beginner';
  if (cat === 'polyglot' || tags.includes('polyglot')) return 'expert';
  if (cat === 'csp' || cat === 'research') return 'advanced';
  if (cat === 'waf' || cat === 'bypass') return 'advanced';
  if (cat === 'advanced') return 'intermediate';
  if (cat === 'dom' || cat === 'framework') return 'intermediate';
  if (desc.includes('advanced') || desc.includes('complex')) return 'advanced';
  if (desc.includes('expert') || desc.includes('universal')) return 'expert';
  return 'intermediate';
}

// Helper: infer WAF bypass targets
function inferWafBypass(payload) {
  const tags = (payload.tags || []).map(t => t.toLowerCase());
  const desc = (payload.description || '').toLowerCase();
  const code = (payload.code || '').toLowerCase();
  const cat = (payload.category || '').toLowerCase();
  
  const wafs = [];
  if (tags.includes('cloudflare') || desc.includes('cloudflare')) wafs.push('cloudflare');
  if (tags.includes('modsecurity') || desc.includes('modsecurity')) wafs.push('modsecurity');
  if (tags.includes('aws') || desc.includes('aws waf')) wafs.push('aws-waf');
  if (tags.includes('akamai') || desc.includes('akamai')) wafs.push('akamai');
  if (tags.includes('f5') || desc.includes('f5 asm') || desc.includes('f5')) wafs.push('f5-asm');
  if (tags.includes('imperva') || desc.includes('imperva')) wafs.push('imperva');
  if (tags.includes('sucuri') || desc.includes('sucuri')) wafs.push('sucuri');
  if (tags.includes('wordfence') || desc.includes('wordfence')) wafs.push('wordfence');
  if (cat === 'waf' && wafs.length === 0) wafs.push('generic');
  
  return wafs;
}

// Helper: infer encoding types
function inferEncoding(payload) {
  const tags = (payload.tags || []).map(t => t.toLowerCase());
  const desc = (payload.description || '').toLowerCase();
  const code = (payload.code || '');
  
  const encodings = [];
  if (tags.includes('url-encode') || tags.includes('percent') || tags.includes('url') && tags.includes('encoding') || desc.includes('url encod') || desc.includes('percent encod')) encodings.push('url');
  if (tags.includes('double') && (tags.includes('encoding') || tags.includes('url'))) encodings.push('double-url');
  if (tags.includes('html-entity') || tags.includes('entities') || desc.includes('html entity')) encodings.push('html-entity');
  if (tags.includes('hex') || desc.includes('hexadecimal') || desc.includes('hex encod')) encodings.push('hex');
  if (tags.includes('octal') || desc.includes('octal')) encodings.push('octal');
  if (tags.includes('unicode') || desc.includes('unicode')) encodings.push('unicode');
  if (tags.includes('base64') || tags.includes('atob') || desc.includes('base64')) encodings.push('base64');
  if (tags.includes('jsfuck') || desc.includes('jsfuck')) encodings.push('jsfuck');
  if (tags.includes('fromcharcode') || tags.includes('character-code') || desc.includes('fromcharcode') || desc.includes('character code')) encodings.push('fromcharcode');
  if (encodings.length === 0) encodings.push('none');
  
  return encodings;
}

// Helper: infer works_when conditions
function inferWorksWhen(payload) {
  const tags = (payload.tags || []).map(t => t.toLowerCase());
  const desc = (payload.description || '').toLowerCase();
  const cat = (payload.category || '').toLowerCase();
  
  const conditions = [];
  if (cat === 'basic') conditions.push('no-filter');
  if (cat === 'bypass' || cat === 'waf') conditions.push('filter-active');
  if (tags.includes('filter-bypass') || tags.includes('bypass')) conditions.push('keyword-filter-active');
  if (desc.includes('case variation') || tags.includes('case-variation') || tags.includes('mixed-case')) conditions.push('case-sensitive-filter');
  if (desc.includes('encoding') || tags.includes('encoding')) conditions.push('encoding-not-decoded');
  if (tags.includes('whitespace') || desc.includes('whitespace')) conditions.push('whitespace-not-stripped');
  if (cat === 'csp') conditions.push('csp-misconfigured');
  if (conditions.length === 0) conditions.push('no-filter');
  
  return conditions;
}

// Helper: parse legacy date format
function parseLegacyDate(dateStr) {
  if (!dateStr) return '2025-12-31';
  if (dateStr.includes('-') && dateStr.split('-')[0].length <= 2) {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

// Helper: create slug
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50);
}

// Deduplicate payloads by normalized code
const seen = new Map();
const deduped = [];
let dupeCount = 0;

payloads.forEach((p) => {
  const code = (p.code || '').trim();
  if (!code) return;
  
  const normalized = code.replace(/\s+/g, ' ').toLowerCase();
  if (seen.has(normalized)) {
    dupeCount++;
    return;
  }
  seen.set(normalized, true);
  deduped.push(p);
});

console.log(`Removed ${dupeCount} duplicates. ${deduped.length} unique payloads remaining.`);

// Group by category
const grouped = {};
deduped.forEach((p, i) => {
  const cat = (p.category || 'basic').toLowerCase();
  if (!grouped[cat]) grouped[cat] = [];
  
  const code = (p.code || '').trim();
  const id = `${cat}-${slugify(p.description || code)}-${i}`;
  
  grouped[cat].push({
    id,
    payload: code,
    description: (p.description || '').trim(),
    category: cat,
    context: inferContext(p),
    difficulty: inferDifficulty(p),
    tags: (p.tags || []).map(t => t.toLowerCase()),
    wafBypass: inferWafBypass(p),
    encoding: inferEncoding(p),
    characterCount: code.length,
    worksWhen: inferWorksWhen(p),
    browsers: p.browsers || ['Chrome', 'Firefox'],
    author: p.contributor || 'Unknown',
    contributor: p.contributor || 'Unknown',
    githubUsername: p.github_username || '',
    country: p.country || 'Unknown',
    dateAdded: parseLegacyDate(p.date_added),
    verified: true,
  });
});

// Generate TypeScript files for each category
const categories = Object.keys(grouped).sort();
console.log(`\nCategories: ${categories.join(', ')}`);
console.log('');

categories.forEach(cat => {
  const payloads = grouped[cat];
  const fileName = `${cat}.ts`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  
  // Custom serializer that safely handles XSS payload strings
  function serializePayload(p) {
    const escapeStr = (s) => {
      if (typeof s !== 'string') return JSON.stringify(s);
      // Use backtick template literals with escaped backticks and ${
      const escaped = s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
      return '`' + escaped + '`';
    };
    
    const serializeArray = (arr) => {
      if (!arr || arr.length === 0) return '[]';
      return '[\n      ' + arr.map(v => escapeStr(v)).join(',\n      ') + ',\n    ]';
    };
    
    return `  {
    id: ${escapeStr(p.id)},
    payload: ${escapeStr(p.payload)},
    description: ${escapeStr(p.description)},
    category: ${escapeStr(p.category)},
    context: ${escapeStr(p.context)},
    difficulty: ${escapeStr(p.difficulty)},
    tags: ${serializeArray(p.tags)},
    wafBypass: ${serializeArray(p.wafBypass)},
    encoding: ${serializeArray(p.encoding)},
    characterCount: ${p.characterCount},
    worksWhen: ${serializeArray(p.worksWhen)},
    browsers: ${serializeArray(p.browsers)},
    author: ${escapeStr(p.author)},
    contributor: ${escapeStr(p.contributor)},
    githubUsername: ${escapeStr(p.githubUsername)},
    country: ${escapeStr(p.country)},
    dateAdded: ${escapeStr(p.dateAdded)},
    verified: ${p.verified},
  }`;
  }

  const content = `// ============================================================
// Vex — Cross the line.
// ${cat.charAt(0).toUpperCase() + cat.slice(1)} Payloads
// Auto-generated from XSSNow payload database
// ============================================================

import type { Payload } from '@/types';

export const ${cat.replace(/-/g, '_')}Payloads: Payload[] = [
${payloads.map(p => serializePayload(p)).join(',\n')}
];
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ ${fileName} — ${payloads.length} payloads`);
});

// Generate index.ts that aggregates all
const indexContent = `// ============================================================
// Vex — Cross the line.
// Payload Database Index — Aggregates all category files
// Auto-generated from XSSNow payload database
// ============================================================

import type { Payload, PayloadCategory } from '@/types';

${categories.map(cat => `import { ${cat.replace(/-/g, '_')}Payloads } from './${cat}';`).join('\n')}

/** Complete payload database — all categories combined */
export const ALL_PAYLOADS: Payload[] = [
${categories.map(cat => `  ...${cat.replace(/-/g, '_')}Payloads,`).join('\n')}
];

/** Total payload count */
export const TOTAL_PAYLOAD_COUNT = ALL_PAYLOADS.length;

/** Payload count by category */
export const PAYLOAD_COUNTS: Record<PayloadCategory, number> = {
${categories.map(cat => `  '${cat}': ${cat.replace(/-/g, '_')}Payloads.length,`).join('\n')}
};

/** Get payloads by category */
export function getPayloadsByCategory(category: PayloadCategory): Payload[] {
  return ALL_PAYLOADS.filter(p => p.category === category);
}

/** Get all unique tags across all payloads */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  ALL_PAYLOADS.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

/** Get all unique browsers across all payloads */
export function getAllBrowsers(): string[] {
  const browsers = new Set<string>();
  ALL_PAYLOADS.forEach(p => p.browsers.forEach(b => browsers.add(b)));
  return Array.from(browsers).sort();
}

/** Get all unique contributors */
export function getAllContributors(): { name: string; github: string; count: number }[] {
  const map = new Map<string, { name: string; github: string; count: number }>();
  ALL_PAYLOADS.forEach(p => {
    const key = p.contributor;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
    } else {
      map.set(key, { name: p.contributor, github: p.githubUsername, count: 1 });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

// Re-export individual category arrays
${categories.map(cat => `export { ${cat.replace(/-/g, '_')}Payloads };`).join('\n')}
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent, 'utf8');
console.log(`\n  ✓ index.ts — aggregator`);
console.log(`\n✅ Migration complete! ${deduped.length} payloads across ${categories.length} categories.`);
