// ============================================================
// Vex — Cross the line.
// Aggregation — Category, tag, and contributor counting
// ============================================================

import type { Payload, PayloadCategory, InjectionContext, DifficultyLevel, WAFVendor, EncodingType } from '@/types';

/** Count payloads per category */
export function countByCategory(
  payloads: Payload[]
): Record<PayloadCategory, number> {
  const counts = {} as Record<PayloadCategory, number>;
  for (const p of payloads) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }
  return counts;
}

/** Count payloads per injection context */
export function countByContext(
  payloads: Payload[]
): Record<InjectionContext, number> {
  const counts = {} as Record<InjectionContext, number>;
  for (const p of payloads) {
    counts[p.context] = (counts[p.context] || 0) + 1;
  }
  return counts;
}

/** Count payloads per difficulty level */
export function countByDifficulty(
  payloads: Payload[]
): Record<DifficultyLevel, number> {
  const counts = {} as Record<DifficultyLevel, number>;
  for (const p of payloads) {
    counts[p.difficulty] = (counts[p.difficulty] || 0) + 1;
  }
  return counts;
}

/** Collect all unique tags with their occurrence count, sorted by frequency */
export function aggregateTags(
  payloads: Payload[]
): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of payloads) {
    for (const tag of p.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Collect all unique WAF vendors with their occurrence count */
export function aggregateWAFs(
  payloads: Payload[]
): { waf: WAFVendor; count: number }[] {
  const map = new Map<WAFVendor, number>();
  for (const p of payloads) {
    for (const w of p.wafBypass) {
      if (w !== 'generic') {
        map.set(w, (map.get(w) || 0) + 1);
      }
    }
  }
  return Array.from(map.entries())
    .map(([waf, count]) => ({ waf, count }))
    .sort((a, b) => b.count - a.count);
}

/** Collect all unique encoding types with their occurrence count */
export function aggregateEncodings(
  payloads: Payload[]
): { encoding: EncodingType; count: number }[] {
  const map = new Map<EncodingType, number>();
  for (const p of payloads) {
    for (const e of p.encoding) {
      if (e !== 'none') {
        map.set(e, (map.get(e) || 0) + 1);
      }
    }
  }
  return Array.from(map.entries())
    .map(([encoding, count]) => ({ encoding, count }))
    .sort((a, b) => b.count - a.count);
}

/** Get contributor leaderboard data */
export function aggregateContributors(
  payloads: Payload[]
): { name: string; githubUsername: string; country: string; count: number; categories: PayloadCategory[] }[] {
  const map = new Map<string, {
    name: string;
    githubUsername: string;
    country: string;
    count: number;
    categories: Set<PayloadCategory>;
  }>();

  for (const p of payloads) {
    const key = p.contributor;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
      existing.categories.add(p.category);
    } else {
      map.set(key, {
        name: p.contributor,
        githubUsername: p.githubUsername,
        country: p.country,
        count: 1,
        categories: new Set([p.category]),
      });
    }
  }

  return Array.from(map.values())
    .map((c) => ({
      name: c.name,
      githubUsername: c.githubUsername,
      country: c.country,
      count: c.count,
      categories: Array.from(c.categories),
    }))
    .sort((a, b) => b.count - a.count);
}

/** Compute basic statistics about the payload database */
export function computeStats(payloads: Payload[]) {
  const uniqueTags = new Set<string>();
  const uniqueContributors = new Set<string>();
  let totalChars = 0;

  for (const p of payloads) {
    p.tags.forEach((t) => uniqueTags.add(t));
    uniqueContributors.add(p.contributor);
    totalChars += p.characterCount;
  }

  return {
    totalPayloads: payloads.length,
    totalCategories: new Set(payloads.map((p) => p.category)).size,
    totalTags: uniqueTags.size,
    totalContributors: uniqueContributors.size,
    avgCharacterCount: Math.round(totalChars / payloads.length),
    minCharacterCount: Math.min(...payloads.map((p) => p.characterCount)),
    maxCharacterCount: Math.max(...payloads.map((p) => p.characterCount)),
  };
}
