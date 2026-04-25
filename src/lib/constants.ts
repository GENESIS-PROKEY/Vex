// ============================================================
// Vex — Cross the line.
// Application Constants
// ============================================================

export const APP_NAME = 'Vex';
export const APP_TAGLINE = 'Cross the line.';
export const APP_DESCRIPTION =
  'The ultimate XSS payload arsenal for security researchers, penetration testers, and bug bounty hunters. 1000+ curated payloads, advanced bypass techniques, and real-time payload generation.';
export const APP_URL = 'https://vex.security';
export const APP_GITHUB = 'https://github.com/GENESIS-PROKEY';
export const APP_AUTHOR = 'Genesis Prokey';

/** Number of payloads to show per page in the grid */
export const PAYLOADS_PER_PAGE = 24;

/** Debounce delay for search input (ms) */
export const SEARCH_DEBOUNCE_MS = 200;

/** Maximum character count for the character slider */
export const MAX_CHARACTER_SLIDER = 500;

/** Animation durations (ms) */
export const ANIMATION = {
  pageTransition: 400,
  modalOpen: 300,
  cardStagger: 50,
  copyFlash: 150,
  toastDuration: 3000,
  typewriterSpeed: 80,
  typewriterDeleteSpeed: 40,
  typewriterPause: 3000,
} as const;

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** Color tokens for difficulty badges */
export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#00ff88',
  intermediate: '#00d4ff',
  advanced: '#ff8800',
  expert: '#ff3366',
};

/** Color tokens for categories */
export const CATEGORY_COLORS: Record<string, string> = {
  basic: '#00ff88',
  advanced: '#00d4ff',
  bypass: '#ff8800',
  waf: '#ff3366',
  csp: '#a855f7',
  dom: '#3b82f6',
  event: '#22d3ee',
  polyglot: '#f59e0b',
  mobile: '#10b981',
  browser: '#6366f1',
  framework: '#ec4899',
  research: '#8b5cf6',
  context: '#14b8a6',
  unicode: '#f97316',
  api: '#06b6d4',
  blind: '#ef4444',
  social: '#d946ef',
  unique: '#eab308',
  'non-english': '#84cc16',
};

/** Terminal commands for the hero typewriter effect */
export const TERMINAL_COMMANDS = [
  {
    cmd: 'vex --scan target.com',
    response:
      '✓ Scanning for XSS injection points...\n✓ Found 12 contexts\n✓ Generated 47 optimized payloads',
  },
  {
    cmd: 'vex --bypass cloudflare --context html',
    response:
      'Payload: <svg/onload=prompt`1`>\nContext: HTML Tag Injection\nWAF Status: ✓ Bypassed\nSuccess Rate: 87%',
  },
  {
    cmd: 'vex --polyglot --max-chars 80',
    response:
      "Generating universal polyglot...\n✓ Works in 6 injection contexts\n✓ Bypasses 3 major WAFs\n✓ 74 characters — within limit",
  },
  {
    cmd: "vex --encode base64 '<script>alert(1)</script>'",
    response:
      'Encoded: PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==\nDecoder: eval(atob(...))\n✓ Ready for deployment',
  },
  {
    cmd: 'vex --lucky',
    response:
      '🎲 Random payload selected!\n<details open ontoggle=alert(1)>\nCategory: WAF Bypass\nDifficulty: Intermediate',
  },
] as const;

/** Browser icon mapping */
export const BROWSER_ICONS: Record<string, string> = {
  Chrome: 'chrome',
  Firefox: 'firefox',
  Safari: 'smartphone',
  Edge: 'globe',
  IE: 'monitor',
  Legacy: 'archive',
};

/** WAF vendor display names */
export const WAF_DISPLAY_NAMES: Record<string, string> = {
  cloudflare: 'Cloudflare',
  modsecurity: 'ModSecurity',
  'aws-waf': 'AWS WAF',
  akamai: 'Akamai',
  'f5-asm': 'F5 ASM',
  imperva: 'Imperva',
  sucuri: 'Sucuri',
  barracuda: 'Barracuda',
  fortiweb: 'FortiWeb',
  wordfence: 'Wordfence',
  generic: 'Generic',
};
