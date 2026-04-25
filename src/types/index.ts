// ============================================================
// Vex — Cross the line.
// TypeScript Type Definitions
// ============================================================

/** Supported payload categories matching the original XSSNow dataset */
export type PayloadCategory =
  | 'basic'
  | 'advanced'
  | 'bypass'
  | 'waf'
  | 'csp'
  | 'dom'
  | 'event'
  | 'polyglot'
  | 'mobile'
  | 'browser'
  | 'framework'
  | 'research'
  | 'context'
  | 'unicode'
  | 'api'
  | 'blind'
  | 'social'
  | 'unique'
  | 'non-english';

/** Injection context where a payload is designed to execute */
export type InjectionContext =
  | 'html'
  | 'attribute'
  | 'javascript'
  | 'url'
  | 'css'
  | 'dom';

/** Skill level required to understand and deploy the payload */
export type DifficultyLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

/** Known WAF vendors that payloads may target */
export type WAFVendor =
  | 'cloudflare'
  | 'modsecurity'
  | 'aws-waf'
  | 'akamai'
  | 'f5-asm'
  | 'imperva'
  | 'sucuri'
  | 'barracuda'
  | 'fortiweb'
  | 'wordfence'
  | 'generic';

/** Encoding techniques used in the payload */
export type EncodingType =
  | 'none'
  | 'url'
  | 'double-url'
  | 'html-entity'
  | 'hex'
  | 'octal'
  | 'unicode'
  | 'base64'
  | 'jsfuck'
  | 'fromcharcode';

/** Core payload data structure — enriched from original YAML schema */
export interface Payload {
  /** Unique identifier (kebab-case slug) */
  id: string;
  /** The raw XSS payload code */
  payload: string;
  /** Human-readable description of what the payload does */
  description: string;
  /** Primary category classification */
  category: PayloadCategory;
  /** Injection context where this payload is effective */
  context: InjectionContext;
  /** Skill level required */
  difficulty: DifficultyLevel;
  /** Searchable tags */
  tags: string[];
  /** WAF vendors this payload can bypass */
  wafBypass: WAFVendor[];
  /** Encoding techniques used */
  encoding: EncodingType[];
  /** Character count of the raw payload */
  characterCount: number;
  /** Conditions under which this payload works */
  worksWhen: string[];
  /** Compatible browsers */
  browsers: string[];
  /** Original author/researcher */
  author: string;
  /** Person who submitted to the database */
  contributor: string;
  /** GitHub username of contributor */
  githubUsername: string;
  /** Country of contributor */
  country: string;
  /** Date payload was added (ISO format) */
  dateAdded: string;
  /** Whether this payload has been verified/tested */
  verified: boolean;
}

/** Metadata about a payload category for UI display */
export interface CategoryInfo {
  id: PayloadCategory;
  name: string;
  description: string;
  icon: string;
  count: number;
  color: string;
}

/** Filter state for the payload browser */
export interface FilterState {
  search: string;
  categories: PayloadCategory[];
  contexts: InjectionContext[];
  difficulties: DifficultyLevel[];
  wafTargets: WAFVendor[];
  encodings: EncodingType[];
  maxCharacters: number | null;
  tags: string[];
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

/** Available sort options */
export type SortOption =
  | 'relevance'
  | 'difficulty'
  | 'date'
  | 'characters'
  | 'category';

/** UI state for modals, sidebar, etc. */
export interface UIState {
  sidebarOpen: boolean;
  selectedPayload: Payload | null;
  detailModalOpen: boolean;
  matrixRainEnabled: boolean;
  mobileMenuOpen: boolean;
  toasts: Toast[];
}

/** Toast notification */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

/** Contributor leaderboard entry */
export interface Contributor {
  name: string;
  githubUsername: string;
  country: string;
  payloadCount: number;
  categories: PayloadCategory[];
  avatar: string;
}

/** Filter preset for quick access */
export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  filters: Partial<FilterState>;
}
