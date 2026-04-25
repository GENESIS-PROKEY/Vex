// ============================================================
// Vex — Cross the line.
// Filter Store — Zustand state for payload filtering
// ============================================================

import { create } from 'zustand';
import type {
  PayloadCategory,
  InjectionContext,
  DifficultyLevel,
  WAFVendor,
  EncodingType,
  SortOption,
  FilterState,
} from '@/types';

interface FilterStore extends FilterState {
  // Actions
  setSearch: (search: string) => void;
  toggleCategory: (category: PayloadCategory) => void;
  setCategories: (categories: PayloadCategory[]) => void;
  toggleContext: (context: InjectionContext) => void;
  setContexts: (contexts: InjectionContext[]) => void;
  toggleDifficulty: (difficulty: DifficultyLevel) => void;
  setDifficulties: (difficulties: DifficultyLevel[]) => void;
  toggleWafTarget: (waf: WAFVendor) => void;
  setWafTargets: (wafs: WAFVendor[]) => void;
  toggleEncoding: (encoding: EncodingType) => void;
  setEncodings: (encodings: EncodingType[]) => void;
  setMaxCharacters: (max: number | null) => void;
  toggleTag: (tag: string) => void;
  setTags: (tags: string[]) => void;
  setSortBy: (sort: SortOption) => void;
  toggleSortOrder: () => void;
  clearAll: () => void;
  hasActiveFilters: () => boolean;
  activeFilterCount: () => number;
}

const initialState: FilterState = {
  search: '',
  categories: [],
  contexts: [],
  difficulties: [],
  wafTargets: [],
  encodings: [],
  maxCharacters: null,
  tags: [],
  sortBy: 'relevance',
  sortOrder: 'desc',
};

/** Toggle an item in an array — add if missing, remove if present */
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...initialState,

  setSearch: (search) => set({ search }),

  toggleCategory: (category) =>
    set((s) => ({ categories: toggle(s.categories, category) })),
  setCategories: (categories) => set({ categories }),

  toggleContext: (context) =>
    set((s) => ({ contexts: toggle(s.contexts, context) })),
  setContexts: (contexts) => set({ contexts }),

  toggleDifficulty: (difficulty) =>
    set((s) => ({ difficulties: toggle(s.difficulties, difficulty) })),
  setDifficulties: (difficulties) => set({ difficulties }),

  toggleWafTarget: (waf) =>
    set((s) => ({ wafTargets: toggle(s.wafTargets, waf) })),
  setWafTargets: (wafs) => set({ wafTargets: wafs }),

  toggleEncoding: (encoding) =>
    set((s) => ({ encodings: toggle(s.encodings, encoding) })),
  setEncodings: (encodings) => set({ encodings }),

  setMaxCharacters: (max) => set({ maxCharacters: max }),

  toggleTag: (tag) => set((s) => ({ tags: toggle(s.tags, tag) })),
  setTags: (tags) => set({ tags }),

  setSortBy: (sortBy) => set({ sortBy }),
  toggleSortOrder: () =>
    set((s) => ({ sortOrder: s.sortOrder === 'asc' ? 'desc' : 'asc' })),

  clearAll: () => set(initialState),

  hasActiveFilters: () => {
    const s = get();
    return (
      s.search.length > 0 ||
      s.categories.length > 0 ||
      s.contexts.length > 0 ||
      s.difficulties.length > 0 ||
      s.wafTargets.length > 0 ||
      s.encodings.length > 0 ||
      s.maxCharacters !== null ||
      s.tags.length > 0
    );
  },

  activeFilterCount: () => {
    const s = get();
    let count = 0;
    if (s.search.length > 0) count++;
    count += s.categories.length;
    count += s.contexts.length;
    count += s.difficulties.length;
    count += s.wafTargets.length;
    count += s.encodings.length;
    if (s.maxCharacters !== null) count++;
    count += s.tags.length;
    return count;
  },
}));
