// ============================================================
// Vex — Cross the line.
// usePayloads Hook — Main payload query hook
// ============================================================

'use client';

import { useMemo } from 'react';
import { ALL_PAYLOADS } from '@/data/payloads';
import { useFilterStore } from '@/store/useFilterStore';
import { createSearchIndex, searchPayloads } from '@/lib/search';
import { applyFilters, sortPayloads } from '@/lib/filters';
import type { Payload } from '@/types';

/** Fuse index — created once and reused */
const searchIndex = createSearchIndex(ALL_PAYLOADS);

/**
 * Main hook for querying payloads with search + filters + sorting.
 * Returns the filtered, sorted payload array and metadata.
 */
export function usePayloads() {
  const {
    search,
    categories,
    contexts,
    difficulties,
    wafTargets,
    encodings,
    maxCharacters,
    tags,
    sortBy,
    sortOrder,
  } = useFilterStore();

  const result = useMemo(() => {
    // Step 1: Start with full dataset or search results
    let payloads: Payload[];
    if (search && search.trim().length >= 2) {
      payloads = searchPayloads(searchIndex, search);
    } else {
      payloads = ALL_PAYLOADS;
    }

    // Step 2: Apply filters
    payloads = applyFilters(payloads, {
      search,
      categories,
      contexts,
      difficulties,
      wafTargets,
      encodings,
      maxCharacters,
      tags,
      sortBy,
      sortOrder,
    });

    // Step 3: Sort (skip for relevance when search is active — Fuse handles it)
    if (!(sortBy === 'relevance' && search.trim().length >= 2)) {
      payloads = sortPayloads(payloads, sortBy, sortOrder);
    }

    return payloads;
  }, [
    search,
    categories,
    contexts,
    difficulties,
    wafTargets,
    encodings,
    maxCharacters,
    tags,
    sortBy,
    sortOrder,
  ]);

  return {
    payloads: result,
    totalCount: ALL_PAYLOADS.length,
    filteredCount: result.length,
    isFiltered: result.length !== ALL_PAYLOADS.length,
  };
}
