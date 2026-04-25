// ============================================================
// Vex — Cross the line.
// useFilterUrl — Syncs Zustand filter state ↔ URL query params
// ============================================================

'use client';

import { useEffect, useRef } from 'react';
import { useQueryStates, parseAsString, parseAsArrayOf, parseAsInteger } from 'nuqs';
import { useFilterStore } from '@/store/useFilterStore';
import type {
  PayloadCategory,
  InjectionContext,
  DifficultyLevel,
  WAFVendor,
  EncodingType,
  SortOption,
} from '@/types';

// Valid values for type-safe parsing
const VALID_CATEGORIES: PayloadCategory[] = [
  'basic', 'advanced', 'bypass', 'waf', 'csp', 'dom', 'event',
  'polyglot', 'mobile', 'browser', 'framework', 'research',
  'context', 'unicode', 'api', 'blind', 'social', 'unique', 'non-english',
];
const VALID_CONTEXTS: InjectionContext[] = ['html', 'attribute', 'javascript', 'url', 'css', 'dom'];
const VALID_DIFFICULTIES: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
const VALID_SORT: SortOption[] = ['relevance', 'difficulty', 'date', 'characters', 'category'];

/**
 * Hook that provides two-way sync between URL query params and the Zustand filter store.
 *
 * URL format example:
 *   /payloads?q=cloudflare&cat=waf,csp&diff=advanced&ctx=html&sort=difficulty&order=asc
 *
 * Call this hook once in the PayloadBrowser component.
 */
export function useFilterUrl() {
  const store = useFilterStore();
  const isInitialSync = useRef(true);

  // Define URL query param parsers
  const [urlState, setUrlState] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      cat: parseAsArrayOf(parseAsString).withDefault([]),
      diff: parseAsArrayOf(parseAsString).withDefault([]),
      ctx: parseAsArrayOf(parseAsString).withDefault([]),
      waf: parseAsArrayOf(parseAsString).withDefault([]),
      enc: parseAsArrayOf(parseAsString).withDefault([]),
      maxch: parseAsInteger.withDefault(0), // 0 = no limit
      tags: parseAsArrayOf(parseAsString).withDefault([]),
      sort: parseAsString.withDefault('relevance'),
      order: parseAsString.withDefault('desc'),
    },
    {
      history: 'replace',
      shallow: true,
    }
  );

  // --- 1. URL → Store (on mount / URL change) ---
  useEffect(() => {
    if (!isInitialSync.current) return;
    isInitialSync.current = false;

    const hasUrlParams =
      urlState.q !== '' ||
      urlState.cat.length > 0 ||
      urlState.diff.length > 0 ||
      urlState.ctx.length > 0 ||
      urlState.waf.length > 0 ||
      urlState.enc.length > 0 ||
      urlState.maxch > 0 ||
      urlState.tags.length > 0 ||
      urlState.sort !== 'relevance' ||
      urlState.order !== 'desc';

    if (!hasUrlParams) return;

    // Parse and validate URL values before applying to store
    if (urlState.q) {
      store.setSearch(urlState.q);
    }
    if (urlState.cat.length > 0) {
      const valid = urlState.cat.filter((c): c is PayloadCategory =>
        VALID_CATEGORIES.includes(c as PayloadCategory)
      );
      if (valid.length > 0) store.setCategories(valid);
    }
    if (urlState.diff.length > 0) {
      const valid = urlState.diff.filter((d): d is DifficultyLevel =>
        VALID_DIFFICULTIES.includes(d as DifficultyLevel)
      );
      if (valid.length > 0) store.setDifficulties(valid);
    }
    if (urlState.ctx.length > 0) {
      const valid = urlState.ctx.filter((c): c is InjectionContext =>
        VALID_CONTEXTS.includes(c as InjectionContext)
      );
      if (valid.length > 0) store.setContexts(valid);
    }
    if (urlState.waf.length > 0) {
      store.setWafTargets(urlState.waf as WAFVendor[]);
    }
    if (urlState.enc.length > 0) {
      store.setEncodings(urlState.enc as EncodingType[]);
    }
    if (urlState.maxch > 0) {
      store.setMaxCharacters(urlState.maxch);
    }
    if (urlState.tags.length > 0) {
      store.setTags(urlState.tags);
    }
    if (urlState.sort !== 'relevance' && VALID_SORT.includes(urlState.sort as SortOption)) {
      store.setSortBy(urlState.sort as SortOption);
    }
    if (urlState.order === 'asc') {
      store.toggleSortOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // --- 2. Store → URL (when store changes) ---
  useEffect(() => {
    if (isInitialSync.current) return;

    setUrlState({
      q: store.search || null,
      cat: store.categories.length > 0 ? store.categories : null,
      diff: store.difficulties.length > 0 ? store.difficulties : null,
      ctx: store.contexts.length > 0 ? store.contexts : null,
      waf: store.wafTargets.length > 0 ? store.wafTargets : null,
      enc: store.encodings.length > 0 ? store.encodings : null,
      maxch: store.maxCharacters !== null ? store.maxCharacters : null,
      tags: store.tags.length > 0 ? store.tags : null,
      sort: store.sortBy !== 'relevance' ? store.sortBy : null,
      order: store.sortOrder !== 'desc' ? store.sortOrder : null,
    });
  }, [
    store.search,
    store.categories,
    store.difficulties,
    store.contexts,
    store.wafTargets,
    store.encodings,
    store.maxCharacters,
    store.tags,
    store.sortBy,
    store.sortOrder,
    setUrlState,
  ]);
}
