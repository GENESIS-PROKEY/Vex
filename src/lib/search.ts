// ============================================================
// Vex — Cross the line.
// Search Engine — Fuse.js configuration
// ============================================================

import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Payload } from '@/types';

/** Fuse.js search options optimized for XSS payload search */
const FUSE_OPTIONS: IFuseOptions<Payload> = {
  keys: [
    { name: 'payload', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.05 },
    { name: 'contributor', weight: 0.05 },
  ],
  threshold: 0.35,
  distance: 200,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  shouldSort: true,
  findAllMatches: false,
  useExtendedSearch: true,
};

/** Create a Fuse instance for the given payload set */
export function createSearchIndex(payloads: Payload[]): Fuse<Payload> {
  return new Fuse(payloads, FUSE_OPTIONS);
}

/** Search payloads using fuzzy matching */
export function searchPayloads(
  index: Fuse<Payload>,
  query: string
): Payload[] {
  if (!query || query.trim().length < 2) return [];

  const results = index.search(query.trim());
  return results.map((r) => r.item);
}

/** Search and return results with scores */
export function searchPayloadsWithScores(
  index: Fuse<Payload>,
  query: string
): { item: Payload; score: number }[] {
  if (!query || query.trim().length < 2) return [];

  const results = index.search(query.trim());
  return results.map((r) => ({
    item: r.item,
    score: r.score ?? 1,
  }));
}
