// ============================================================
// Vex — Cross the line.
// PayloadBrowser — Sidebar filters (left) + Grid (right)
// ============================================================

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dice5, SlidersHorizontal, X, Download } from 'lucide-react';
import { usePayloads } from '@/hooks/usePayloads';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useFilterUrl } from '@/hooks/useFilterUrl';
import { useUIStore } from '@/store/useUIStore';
import SearchBar from '@/components/ui/SearchInput';
import FilterSidebar from '@/components/filter/FilterSidebar';
import PayloadGrid from '@/components/payload/PayloadGrid';
import PayloadDetail from '@/components/payload/PayloadDetail';
import { PAYLOADS_PER_PAGE } from '@/lib/constants';
import { formatNumber, randomInt } from '@/lib/utils';
import type { Payload } from '@/types';

export default function PayloadBrowser() {
  useFilterUrl();

  const { payloads, totalCount, filteredCount, isFiltered } = usePayloads();
  const { copy, copiedId } = useCopyToClipboard();
  const { selectedPayload, detailModalOpen, openPayloadDetail, closePayloadDetail } = useUIStore();

  const [visibleCount, setVisibleCount] = useState(PAYLOADS_PER_PAGE);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const visiblePayloads = useMemo(
    () => payloads.slice(0, visibleCount),
    [payloads, visibleCount]
  );
  const hasMore = visibleCount < payloads.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAYLOADS_PER_PAGE, payloads.length));
  }, [payloads.length]);

  const handleLucky = useCallback(() => {
    if (payloads.length === 0) return;
    const idx = randomInt(0, payloads.length - 1);
    openPayloadDetail(payloads[idx]);
  }, [payloads, openPayloadDetail]);

  const handleCopy = useCallback(
    (text: string, id: string) => { copy(text, id); },
    [copy]
  );

  const handleSelect = useCallback(
    (payload: Payload) => {
      openPayloadDetail(payload);
      // Update URL for deep linking
      const url = new URL(window.location.href);
      url.searchParams.set('id', payload.id);
      window.history.replaceState({}, '', url.toString());
    },
    [openPayloadDetail]
  );

  // Deep linking: auto-open payload from ?id= URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id && payloads.length > 0) {
      const found = payloads.find((p) => p.id === id);
      if (found) openPayloadDetail(found);
    }
  }, [payloads, openPayloadDetail]);

  // Clear URL param on modal close
  const handleClose = useCallback(() => {
    closePayloadDetail();
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.replaceState({}, '', url.toString());
  }, [closePayloadDetail]);

  const handleExport = useCallback(() => {
    const text = payloads.map((p) => p.payload).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vex-payloads-${payloads.length}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [payloads]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="text-gradient-green">Payload Browser</span>
              </h1>
              <p className="text-text-secondary text-sm mt-1.5">
                {formatNumber(totalCount)} curated XSS payloads — search, filter, copy, and deploy
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileSidebar(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg-surface text-text-secondary text-sm font-medium hover:text-accent-green hover:border-accent-green/30 transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={handleLucky}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-accent-green/30 bg-accent-green/5 text-accent-green text-sm font-medium hover:border-accent-green/50 hover:bg-accent-green/10 hover:shadow-[0_0_20px_var(--color-accent-green-glow)] animate-[pulse-glow_3s_ease-in-out_infinite] transition-all duration-200"
              >
                <Dice5 className="w-4 h-4 group-hover:animate-spin" />
                I&apos;m Feeling Lucky
              </button>
              <button
                onClick={handleExport}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg-surface text-text-secondary text-sm font-medium hover:text-accent-cyan hover:border-accent-cyan/30 hover:shadow-[0_0_15px_var(--color-accent-cyan-glow)] transition-all duration-200"
                title={`Export ${formatNumber(payloads.length)} payloads as .txt`}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          <SearchBar resultCount={filteredCount} totalCount={totalCount} />
        </div>
      </div>

      {/* Sidebar + Grid layout — independent scrolling */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6" style={{ height: 'calc(100vh - 180px)' }}>
          {/* ── Left Sidebar (desktop) — independent scroll ── */}
          <aside
            className="hidden lg:block w-64 shrink-0 overflow-y-auto py-6 pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#00ff8830 transparent',
            }}
          >
            <FilterSidebar />
          </aside>

          {/* ── Main content — independent scroll ── */}
          <div
            className="flex-1 min-w-0 overflow-y-auto py-6 pl-1"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#00d4ff30 transparent',
            }}
          >
            {/* Results info */}
            {isFiltered && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2 text-sm"
              >
                <span className="text-text-secondary">Showing</span>
                <span className="font-mono font-bold text-accent-green">{formatNumber(filteredCount)}</span>
                <span className="text-text-secondary">of {formatNumber(totalCount)} payloads</span>
              </motion.div>
            )}

            <PayloadGrid
              payloads={visiblePayloads}
              totalCount={payloads.length}
              visibleCount={visibleCount}
              hasMore={hasMore}
              copiedId={copiedId}
              onCopy={handleCopy}
              onSelect={handleSelect}
              onLoadMore={loadMore}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebar(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-bg-primary border-r border-border p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text-primary">Filters</h2>
              <button
                onClick={() => setMobileSidebar(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <FilterSidebar onClose={() => setMobileSidebar(false)} />
          </div>
        </div>
      )}

      {/* Payload Detail Modal */}
      <PayloadDetail
        payload={selectedPayload}
        isOpen={detailModalOpen}
        onClose={handleClose}
      />
    </div>
  );
}
