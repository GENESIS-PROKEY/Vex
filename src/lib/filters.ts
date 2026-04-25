// ============================================================
// Vex — Cross the line.
// Multi-filter Engine
// ============================================================

import type { Payload, FilterState } from '@/types';

/**
 * Apply all active filters to a payload set.
 * Logic: AND across filter groups, OR within each group.
 */
export function applyFilters(
  payloads: Payload[],
  filters: FilterState
): Payload[] {
  let result = payloads;

  // Category filter (OR within group)
  if (filters.categories.length > 0) {
    result = result.filter((p) => filters.categories.includes(p.category));
  }

  // Context filter (OR within group)
  if (filters.contexts.length > 0) {
    result = result.filter((p) => filters.contexts.includes(p.context));
  }

  // Difficulty filter (OR within group)
  if (filters.difficulties.length > 0) {
    result = result.filter((p) => filters.difficulties.includes(p.difficulty));
  }

  // WAF target filter (OR — payload must target at least one selected WAF)
  if (filters.wafTargets.length > 0) {
    result = result.filter((p) =>
      p.wafBypass.some((w) => filters.wafTargets.includes(w))
    );
  }

  // Encoding filter (OR — payload must use at least one selected encoding)
  if (filters.encodings.length > 0) {
    result = result.filter((p) =>
      p.encoding.some((e) => filters.encodings.includes(e))
    );
  }

  // Max character count
  if (filters.maxCharacters !== null) {
    result = result.filter((p) => p.characterCount <= filters.maxCharacters!);
  }

  // Tags filter (AND — payload must have ALL selected tags)
  if (filters.tags.length > 0) {
    result = result.filter((p) =>
      filters.tags.every((tag) => p.tags.includes(tag))
    );
  }

  return result;
}

/**
 * Sort payloads by the given criteria.
 */
export function sortPayloads(
  payloads: Payload[],
  sortBy: FilterState['sortBy'],
  sortOrder: FilterState['sortOrder']
): Payload[] {
  const sorted = [...payloads];
  const multiplier = sortOrder === 'asc' ? 1 : -1;

  switch (sortBy) {
    case 'difficulty': {
      const order = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };
      sorted.sort(
        (a, b) =>
          multiplier * (order[a.difficulty] - order[b.difficulty])
      );
      break;
    }
    case 'date':
      sorted.sort(
        (a, b) =>
          multiplier *
          (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
      );
      break;
    case 'characters':
      sorted.sort(
        (a, b) => multiplier * (a.characterCount - b.characterCount)
      );
      break;
    case 'category':
      sorted.sort(
        (a, b) => multiplier * a.category.localeCompare(b.category)
      );
      break;
    case 'relevance':
    default:
      // For relevance, the search engine already sorts by score
      break;
  }

  return sorted;
}
