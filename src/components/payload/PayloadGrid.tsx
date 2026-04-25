// ============================================================
// Vex — Cross the line.
// PayloadGrid — Responsive grid of payload cards
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PayloadCard from './PayloadCard';
import EmptyState from '@/components/ui/EmptyState';
import { formatNumber } from '@/lib/utils';
import type { Payload } from '@/types';

interface PayloadGridProps {
  payloads: Payload[];
  totalCount: number;
  visibleCount: number;
  hasMore: boolean;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onSelect: (payload: Payload) => void;
  onLoadMore: () => void;
}

export default function PayloadGrid({
  payloads,
  totalCount,
  visibleCount,
  hasMore,
  copiedId,
  onCopy,
  onSelect,
  onLoadMore,
}: PayloadGridProps) {
  if (payloads.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <EmptyState
          title="No payloads found"
          description='Try adjusting your search query or filters. Use broader terms like "alert", "svg", or "bypass".'
        />
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {payloads.map((payload, i) => (
          <PayloadCard
            key={payload.id}
            payload={payload}
            index={i}
            onCopy={onCopy}
            onSelect={onSelect}
            copiedId={copiedId}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex flex-col items-center gap-3 mt-10">
          <button
            onClick={onLoadMore}
            className="flex items-center gap-2 px-8 py-3 rounded-xl border border-border bg-bg-surface text-text-primary font-medium text-sm hover:border-accent-green/30 hover:text-accent-green hover:bg-accent-green/5 transition-all duration-200"
          >
            <ChevronDown className="w-4 h-4" />
            Load more payloads
          </button>
          <span className="text-xs text-text-muted font-mono">
            {formatNumber(visibleCount)} / {formatNumber(totalCount)}
          </span>
        </div>
      )}
    </>
  );
}
