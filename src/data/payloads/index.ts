// ============================================================
// Vex — Cross the line.
// Payload Database Index — Aggregates all category files
// Auto-generated from XSSNow payload database
// ============================================================

import type { Payload, PayloadCategory } from '@/types';

import { advancedPayloads } from './advanced';
import { apiPayloads } from './api';
import { basicPayloads } from './basic';
import { blindPayloads } from './blind';
import { browserPayloads } from './browser';
import { bypassPayloads } from './bypass';
import { contextPayloads } from './context';
import { cspPayloads } from './csp';
import { domPayloads } from './dom';
import { eventPayloads } from './event';
import { frameworkPayloads } from './framework';
import { mobilePayloads } from './mobile';
import { non_englishPayloads } from './non-english';
import { polyglotPayloads } from './polyglot';
import { researchPayloads } from './research';
import { socialPayloads } from './social';
import { unicodePayloads } from './unicode';
import { uniquePayloads } from './unique';
import { wafPayloads } from './waf';

/** Complete payload database — all categories combined */
export const ALL_PAYLOADS: Payload[] = [
  ...advancedPayloads,
  ...apiPayloads,
  ...basicPayloads,
  ...blindPayloads,
  ...browserPayloads,
  ...bypassPayloads,
  ...contextPayloads,
  ...cspPayloads,
  ...domPayloads,
  ...eventPayloads,
  ...frameworkPayloads,
  ...mobilePayloads,
  ...non_englishPayloads,
  ...polyglotPayloads,
  ...researchPayloads,
  ...socialPayloads,
  ...unicodePayloads,
  ...uniquePayloads,
  ...wafPayloads,
];

/** Total payload count */
export const TOTAL_PAYLOAD_COUNT = ALL_PAYLOADS.length;

/** Payload count by category */
export const PAYLOAD_COUNTS: Record<PayloadCategory, number> = {
  'advanced': advancedPayloads.length,
  'api': apiPayloads.length,
  'basic': basicPayloads.length,
  'blind': blindPayloads.length,
  'browser': browserPayloads.length,
  'bypass': bypassPayloads.length,
  'context': contextPayloads.length,
  'csp': cspPayloads.length,
  'dom': domPayloads.length,
  'event': eventPayloads.length,
  'framework': frameworkPayloads.length,
  'mobile': mobilePayloads.length,
  'non-english': non_englishPayloads.length,
  'polyglot': polyglotPayloads.length,
  'research': researchPayloads.length,
  'social': socialPayloads.length,
  'unicode': unicodePayloads.length,
  'unique': uniquePayloads.length,
  'waf': wafPayloads.length,
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
export { advancedPayloads };
export { apiPayloads };
export { basicPayloads };
export { blindPayloads };
export { browserPayloads };
export { bypassPayloads };
export { contextPayloads };
export { cspPayloads };
export { domPayloads };
export { eventPayloads };
export { frameworkPayloads };
export { mobilePayloads };
export { non_englishPayloads };
export { polyglotPayloads };
export { researchPayloads };
export { socialPayloads };
export { unicodePayloads };
export { uniquePayloads };
export { wafPayloads };
