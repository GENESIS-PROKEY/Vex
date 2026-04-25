// ============================================================
// Vex — Cross the line.
// FilterBar — Full filter panel with WAF, Encoding, Slider, Presets
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  RotateCcw,
  Shield,
  Hash,
  Ruler,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';
import { CATEGORIES } from '@/data/categories';
import { PAYLOAD_COUNTS } from '@/data/payloads';
import { CATEGORY_COLORS } from '@/lib/constants';
import { FILTER_PRESETS } from '@/lib/filter-presets';
import { getSuggestionsForContext } from '@/lib/context-suggestions';
import type { SortOption } from '@/types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'date', label: 'Date Added' },
  { value: 'characters', label: 'Char Count' },
  { value: 'category', label: 'Category' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', color: '#00ff88' },
  { value: 'intermediate', label: 'Intermediate', color: '#00d4ff' },
  { value: 'advanced', label: 'Advanced', color: '#ff8800' },
  { value: 'expert', label: 'Expert', color: '#ff3366' },
] as const;

const CONTEXT_OPTIONS = [
  { value: 'html', label: 'HTML' },
  { value: 'attribute', label: 'Attribute' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'url', label: 'URL' },
  { value: 'css', label: 'CSS' },
  { value: 'dom', label: 'DOM' },
] as const;

const WAF_OPTIONS = [
  { value: 'cloudflare', label: 'Cloudflare', color: '#f48120' },
  { value: 'modsecurity', label: 'ModSecurity', color: '#e63946' },
  { value: 'aws-waf', label: 'AWS WAF', color: '#ff9900' },
  { value: 'akamai', label: 'Akamai', color: '#009fdb' },
  { value: 'f5-asm', label: 'F5 ASM', color: '#e4002b' },
  { value: 'imperva', label: 'Imperva', color: '#2662d9' },
  { value: 'sucuri', label: 'Sucuri', color: '#4eb748' },
  { value: 'wordfence', label: 'Wordfence', color: '#7b68ee' },
] as const;

const ENCODING_OPTIONS = [
  { value: 'url', label: 'URL', color: '#06b6d4' },
  { value: 'double-url', label: 'Double URL', color: '#0891b2' },
  { value: 'html-entity', label: 'HTML Entity', color: '#8b5cf6' },
  { value: 'hex', label: 'Hex', color: '#f59e0b' },
  { value: 'unicode', label: 'Unicode', color: '#ec4899' },
  { value: 'base64', label: 'Base64', color: '#14b8a6' },
  { value: 'fromcharcode', label: 'fromCharCode', color: '#f97316' },
  { value: 'jsfuck', label: 'JSFuck', color: '#ef4444' },
] as const;

const CHAR_PRESETS = [25, 50, 100, 200, 500] as const;

export default function FilterBar() {
  const {
    categories,
    toggleCategory,
    difficulties,
    toggleDifficulty,
    contexts,
    toggleContext,
    wafTargets,
    toggleWafTarget,
    setWafTargets,
    encodings,
    toggleEncoding,
    setEncodings,
    maxCharacters,
    setMaxCharacters,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    clearAll,
    hasActiveFilters,
    activeFilterCount,
    setCategories,
    setDifficulties,
    setContexts,
  } = useFilterStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Build categories with real counts, sorted by count
  const catsWithCounts = CATEGORIES
    .map((c) => ({ ...c, count: PAYLOAD_COUNTS[c.id] || 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const filterCount = activeFilterCount();

  // Context-aware suggestion
  const suggestion = useMemo(() => {
    if (contexts.length === 1) {
      return getSuggestionsForContext(contexts[0]);
    }
    return undefined;
  }, [contexts]);

  // Apply a preset
  const applyPreset = (preset: (typeof FILTER_PRESETS)[number]) => {
    clearAll();
    if (preset.filters.categories) setCategories(preset.filters.categories);
    if (preset.filters.difficulties) setDifficulties(preset.filters.difficulties);
    if (preset.filters.contexts) setContexts(preset.filters.contexts);
    if (preset.filters.wafTargets) setWafTargets(preset.filters.wafTargets);
    if (preset.filters.encodings) setEncodings(preset.filters.encodings);
    if (preset.filters.maxCharacters !== undefined) setMaxCharacters(preset.filters.maxCharacters);
    if (preset.filters.sortBy) setSortBy(preset.filters.sortBy);
    if (preset.filters.sortOrder) {
      if (sortOrder !== preset.filters.sortOrder) toggleSortOrder();
    }
    setShowPresets(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
            showFilters || filterCount > 0
              ? 'border-accent-green/30 bg-accent-green/10 text-accent-green'
              : 'border-border bg-bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {filterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-accent-green text-bg-primary">
              {filterCount}
            </span>
          )}
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border bg-bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-border bg-bg-primary shadow-modal z-50 overflow-hidden"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowSort(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === opt.value
                        ? 'text-accent-green bg-accent-green/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                <hr className="border-border" />
                <button
                  onClick={() => { toggleSortOrder(); setShowSort(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors"
                >
                  {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Presets dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border bg-bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Presets
            <ChevronDown className={`w-3 h-3 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-border bg-bg-primary shadow-modal z-50 overflow-hidden max-h-80 overflow-y-auto"
              >
                {FILTER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className="w-full text-left px-4 py-3 hover:bg-bg-surface-hover transition-colors border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{preset.icon}</span>
                      <span className="text-sm font-medium text-text-primary">{preset.name}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 ml-6">{preset.description}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear all */}
        {hasActiveFilters() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-accent-red border border-accent-red/20 bg-accent-red/5 hover:bg-accent-red/10 transition-all duration-200"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </motion.button>
        )}
      </div>

      {/* Context-aware suggestion */}
      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 p-3 rounded-xl border border-accent-cyan/20 bg-accent-cyan/5">
              <Lightbulb className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-accent-cyan">{suggestion.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{suggestion.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {suggestion.tips.slice(0, 2).map((tip) => (
                    <span key={tip} className="text-[10px] px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan/80 border border-accent-cyan/15">
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded filter panels */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-border bg-bg-surface/50 space-y-5">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {catsWithCounts.map((cat) => {
                    const active = categories.includes(cat.id);
                    const color = CATEGORY_COLORS[cat.id] || '#888';
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          active
                            ? 'border-current bg-current/10'
                            : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                        }`}
                        style={active ? { color, borderColor: `${color}40`, backgroundColor: `${color}15` } : undefined}
                      >
                        {cat.name}
                        <span className="text-[10px] font-mono opacity-60">{cat.count}</span>
                        {active && <X className="w-2.5 h-2.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Difficulty
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {DIFFICULTY_OPTIONS.map((opt) => {
                    const active = difficulties.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleDifficulty(opt.value)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          active
                            ? ''
                            : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                        }`}
                        style={active ? { color: opt.color, borderColor: `${opt.color}40`, backgroundColor: `${opt.color}15` } : undefined}
                      >
                        {opt.label}
                        {active && <X className="w-2.5 h-2.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Context */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Injection Context
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {CONTEXT_OPTIONS.map((opt) => {
                    const active = contexts.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleContext(opt.value)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          active
                            ? 'border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan'
                            : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                        }`}
                      >
                        {opt.label}
                        {active && <X className="w-2.5 h-2.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WAF Bypass */}
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  <Shield className="w-3 h-3" />
                  WAF Bypass Target
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {WAF_OPTIONS.map((opt) => {
                    const active = wafTargets.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleWafTarget(opt.value)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          active
                            ? ''
                            : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                        }`}
                        style={active ? { color: opt.color, borderColor: `${opt.color}40`, backgroundColor: `${opt.color}15` } : undefined}
                      >
                        {opt.label}
                        {active && <X className="w-2.5 h-2.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Encoding */}
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  <Hash className="w-3 h-3" />
                  Encoding Type
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {ENCODING_OPTIONS.map((opt) => {
                    const active = encodings.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleEncoding(opt.value)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          active
                            ? ''
                            : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                        }`}
                        style={active ? { color: opt.color, borderColor: `${opt.color}40`, backgroundColor: `${opt.color}15` } : undefined}
                      >
                        {opt.label}
                        {active && <X className="w-2.5 h-2.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Character Restriction Slider */}
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  <Ruler className="w-3 h-3" />
                  Max Characters
                  {maxCharacters !== null && (
                    <span className="text-accent-green font-mono">{maxCharacters}</span>
                  )}
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={10}
                    max={1000}
                    step={5}
                    value={maxCharacters ?? 1000}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setMaxCharacters(val >= 1000 ? null : val);
                    }}
                    className="flex-1 h-1.5 bg-bg-elevated rounded-full appearance-none cursor-pointer accent-accent-green [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-green [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {CHAR_PRESETS.map((val) => (
                      <button
                        key={val}
                        onClick={() => setMaxCharacters(maxCharacters === val ? null : val)}
                        className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                          maxCharacters === val
                            ? 'border-accent-green/40 bg-accent-green/15 text-accent-green'
                            : 'border-border bg-bg-elevated text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  {maxCharacters !== null && (
                    <button
                      onClick={() => setMaxCharacters(null)}
                      className="text-xs text-text-muted hover:text-accent-red transition-colors"
                      aria-label="Clear character limit"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter pills */}
      {filterCount > 0 && !showFilters && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-text-muted mr-1">Active:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all"
              style={{
                color: CATEGORY_COLORS[cat],
                borderColor: `${CATEGORY_COLORS[cat]}30`,
                backgroundColor: `${CATEGORY_COLORS[cat]}10`,
              }}
            >
              {cat}
              <X className="w-2.5 h-2.5" />
            </button>
          ))}
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => toggleDifficulty(d)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border border-accent-green/30 bg-accent-green/10 text-accent-green transition-all"
            >
              {d}
              <X className="w-2.5 h-2.5" />
            </button>
          ))}
          {contexts.map((c) => (
            <button
              key={`ctx-${c}`}
              onClick={() => toggleContext(c)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan transition-all"
            >
              {c}
              <X className="w-2.5 h-2.5" />
            </button>
          ))}
          {wafTargets.map((w) => {
            const wafOpt = WAF_OPTIONS.find((o) => o.value === w);
            return (
              <button
                key={`waf-${w}`}
                onClick={() => toggleWafTarget(w)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all"
                style={{
                  color: wafOpt?.color ?? '#888',
                  borderColor: `${wafOpt?.color ?? '#888'}30`,
                  backgroundColor: `${wafOpt?.color ?? '#888'}10`,
                }}
              >
                <Shield className="w-2.5 h-2.5" />
                {w}
                <X className="w-2.5 h-2.5" />
              </button>
            );
          })}
          {encodings.map((enc) => {
            const encOpt = ENCODING_OPTIONS.find((o) => o.value === enc);
            return (
              <button
                key={`enc-${enc}`}
                onClick={() => toggleEncoding(enc)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all"
                style={{
                  color: encOpt?.color ?? '#888',
                  borderColor: `${encOpt?.color ?? '#888'}30`,
                  backgroundColor: `${encOpt?.color ?? '#888'}10`,
                }}
              >
                {enc}
                <X className="w-2.5 h-2.5" />
              </button>
            );
          })}
          {maxCharacters !== null && (
            <button
              onClick={() => setMaxCharacters(null)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow transition-all"
            >
              ≤{maxCharacters} chars
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
