// ============================================================
// Vex — Cross the line.
// FilterSidebar — Vertical filter panel for payload sidebar
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronDown, RotateCcw, Shield, Hash, Ruler, Sparkles, Lightbulb,
  ArrowUpDown,
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

interface FilterSidebarProps {
  onClose?: () => void;
}

// Collapsible section wrapper
function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-2"
      >
        <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted">
          {icon}
          {title}
        </h3>
        <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({ onClose }: FilterSidebarProps) {
  const {
    categories, toggleCategory,
    difficulties, toggleDifficulty,
    contexts, toggleContext,
    wafTargets, toggleWafTarget, setWafTargets,
    encodings, toggleEncoding, setEncodings,
    maxCharacters, setMaxCharacters,
    sortBy, setSortBy,
    sortOrder, toggleSortOrder,
    clearAll, hasActiveFilters, activeFilterCount,
    setCategories, setDifficulties, setContexts,
  } = useFilterStore();

  const catsWithCounts = CATEGORIES
    .map((c) => ({ ...c, count: PAYLOAD_COUNTS[c.id] || 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const filterCount = activeFilterCount();

  const suggestion = useMemo(() => {
    if (contexts.length === 1) return getSuggestionsForContext(contexts[0]);
    return undefined;
  }, [contexts]);

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
    onClose?.();
  };

  return (
    <div className="space-y-4">
      {/* Header with clear */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Filters
          {filterCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-accent-green text-bg-primary">
              {filterCount}
            </span>
          )}
        </span>
        {hasActiveFilters() && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[10px] font-medium text-accent-red hover:text-accent-red/80 transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Clear
          </button>
        )}
      </div>

      {/* Sort */}
      <Section title="Sort By" icon={<ArrowUpDown className="w-3 h-3" />}>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all ${
                sortBy === opt.value
                  ? 'text-accent-green bg-accent-green/10 font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={toggleSortOrder}
            className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-all mt-1 border-t border-border/30 pt-1.5"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </Section>

      {/* Presets */}
      <Section title="Quick Presets" icon={<Sparkles className="w-3 h-3" />} defaultOpen={false}>
        <div className="space-y-1">
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="w-full text-left px-2.5 py-2 rounded-md hover:bg-bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{preset.icon}</span>
                <span className="text-xs font-medium text-text-primary">{preset.name}</span>
              </div>
              <p className="text-[10px] text-text-muted mt-0.5 ml-5">{preset.description}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section title="Categories">
        <div className="flex flex-wrap gap-1">
          {catsWithCounts.map((cat) => {
            const active = categories.includes(cat.id);
            const color = CATEGORY_COLORS[cat.id] || '#888';
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
                  active ? '' : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                }`}
                style={active ? { color, borderColor: `${color}40`, backgroundColor: `${color}15` } : undefined}
              >
                {cat.name}
                <span className="text-[9px] font-mono opacity-50">{cat.count}</span>
                {active && <X className="w-2.5 h-2.5" />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Difficulty */}
      <Section title="Difficulty">
        <div className="flex flex-wrap gap-1">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const active = difficulties.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleDifficulty(opt.value)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
                  active ? '' : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                }`}
                style={active ? { color: opt.color, borderColor: `${opt.color}40`, backgroundColor: `${opt.color}15` } : undefined}
              >
                {opt.label}
                {active && <X className="w-2.5 h-2.5" />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Context */}
      <Section title="Injection Context">
        <div className="flex flex-wrap gap-1">
          {CONTEXT_OPTIONS.map((opt) => {
            const active = contexts.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleContext(opt.value)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
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
        {/* Context suggestion */}
        {suggestion && (
          <div className="mt-2 p-2 rounded-lg border border-accent-cyan/15 bg-accent-cyan/5">
            <div className="flex items-start gap-1.5">
              <Lightbulb className="w-3 h-3 text-accent-cyan shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-medium text-accent-cyan">{suggestion.title}</p>
                <p className="text-[9px] text-text-muted mt-0.5">{suggestion.description}</p>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* WAF */}
      <Section title="WAF Bypass" icon={<Shield className="w-3 h-3" />} defaultOpen={false}>
        <div className="flex flex-wrap gap-1">
          {WAF_OPTIONS.map((opt) => {
            const active = wafTargets.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleWafTarget(opt.value)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
                  active ? '' : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                }`}
                style={active ? { color: opt.color, borderColor: `${opt.color}40`, backgroundColor: `${opt.color}15` } : undefined}
              >
                {opt.label}
                {active && <X className="w-2.5 h-2.5" />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Encoding */}
      <Section title="Encoding" icon={<Hash className="w-3 h-3" />} defaultOpen={false}>
        <div className="flex flex-wrap gap-1">
          {ENCODING_OPTIONS.map((opt) => {
            const active = encodings.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleEncoding(opt.value)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
                  active ? '' : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                }`}
                style={active ? { color: opt.color, borderColor: `${opt.color}40`, backgroundColor: `${opt.color}15` } : undefined}
              >
                {opt.label}
                {active && <X className="w-2.5 h-2.5" />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Max Characters */}
      <Section title="Max Characters" icon={<Ruler className="w-3 h-3" />} defaultOpen={false}>
        <div className="space-y-2">
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
            className="w-full h-1.5 bg-bg-elevated rounded-full appearance-none cursor-pointer accent-accent-green [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-green [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex flex-wrap gap-1">
            {CHAR_PRESETS.map((val) => (
              <button
                key={val}
                onClick={() => setMaxCharacters(maxCharacters === val ? null : val)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
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
            <div className="flex items-center justify-between text-[10px] text-text-muted">
              <span>Limit: <span className="text-accent-green font-mono">{maxCharacters}</span> chars</span>
              <button onClick={() => setMaxCharacters(null)} className="text-accent-red hover:text-accent-red/80">
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
