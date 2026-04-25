// ============================================================
// Vex — Cross the line.
// useSearch Hook — Debounced search with Fuse.js
// ============================================================

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useFilterStore } from '@/store/useFilterStore';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';

/**
 * Hook for managing search input with debounce.
 * Syncs the debounced value to the filter store.
 */
export function useSearch() {
  const storeSearch = useFilterStore((s) => s.search);
  const setStoreSearch = useFilterStore((s) => s.setSearch);
  const [inputValue, setInputValue] = useState(storeSearch);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync from store to input (e.g., when clearing filters)
  useEffect(() => {
    setInputValue(storeSearch);
  }, [storeSearch]);

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value);

      // Debounce the store update
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStoreSearch(value);
      }, SEARCH_DEBOUNCE_MS);
    },
    [setStoreSearch]
  );

  const clearSearch = useCallback(() => {
    setInputValue('');
    setStoreSearch('');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [setStoreSearch]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    inputValue,
    handleChange,
    clearSearch,
  };
}
