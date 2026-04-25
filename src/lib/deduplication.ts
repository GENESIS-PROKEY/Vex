// ============================================================
// Vex — Cross the line.
// Deduplication — Payload dedup utilities
// ============================================================

import type { Payload } from '@/types';

/**
 * Normalize a payload string for dedup comparison.
 * Strips whitespace, lowercases, and removes trailing semicolons.
 */
export function normalizePayload(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/;+$/, '');
}

/**
 * Generate a dedup key from a payload's content + category.
 * Two payloads are considered duplicates if they produce the same key.
 */
export function deduplicationKey(payload: Payload): string {
  return `${payload.category}::${normalizePayload(payload.payload)}`;
}

/**
 * Deduplicate a payload array, keeping the first occurrence
 * (or the one with richer metadata when duplicates exist).
 */
export function deduplicatePayloads(payloads: Payload[]): Payload[] {
  const seen = new Map<string, Payload>();

  for (const p of payloads) {
    const key = deduplicationKey(p);
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, p);
    } else {
      // Keep the version with more metadata richness
      const existingScore = metadataScore(existing);
      const newScore = metadataScore(p);
      if (newScore > existingScore) {
        seen.set(key, p);
      }
    }
  }

  return Array.from(seen.values());
}

/**
 * Score a payload's metadata richness for dedup decisions.
 * Higher score = more metadata = preferred when deduplicating.
 */
function metadataScore(p: Payload): number {
  let score = 0;
  if (p.description.length > 0) score += 2;
  if (p.tags.length > 0) score += p.tags.length;
  if (p.wafBypass.length > 0 && p.wafBypass[0] !== 'generic') score += 3;
  if (p.encoding.length > 0 && p.encoding[0] !== 'none') score += 2;
  if (p.worksWhen.length > 0) score += 1;
  if (p.browsers.length > 0) score += 1;
  if (p.author.length > 0) score += 1;
  if (p.contributor.length > 0) score += 1;
  if (p.verified) score += 2;
  return score;
}
