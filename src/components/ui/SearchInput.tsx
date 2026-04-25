// ============================================================
// Vex — Cross the line.
// SearchBar Component
// ============================================================

'use client';

import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  resultCount: number;
  totalCount: number;
}

export default function SearchBar({ resultCount, totalCount }: SearchBarProps) {
  const { inputValue, handleChange, clearSearch } = useSearch();
  const isFiltered = resultCount !== totalCount;

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4.5 h-4.5 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search payloads, tags, WAFs, descriptions..."
          className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-bg-surface border border-border text-text-primary placeholder:text-text-muted font-mono text-sm transition-all duration-200 focus:outline-none focus:border-accent-green/50 focus:ring-2 focus:ring-accent-green/15 focus:shadow-[0_0_20px_var(--color-accent-green-glow),0_0_40px_var(--color-accent-green-glow)]"
          aria-label="Search payloads"
          id="payload-search"
        />

        {/* Right side: result count + clear */}
        <div className="absolute right-3 flex items-center gap-2">
          {inputValue && (
            <button
              onClick={clearSearch}
              className="flex items-center justify-center w-6 h-6 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className={`text-xs font-mono px-2 py-1 rounded-md border ${
            isFiltered
              ? 'text-accent-green bg-accent-green/10 border-accent-green/20'
              : 'text-text-muted bg-bg-elevated border-border'
          }`}>
            {resultCount}
          </span>
        </div>
      </div>
    </div>
  );
}
