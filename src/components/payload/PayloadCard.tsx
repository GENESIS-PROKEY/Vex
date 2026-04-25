// ============================================================
// Vex — Cross the line.
// PayloadCard Component
// ============================================================

'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Shield,
  Globe,
  Lock,
  Heart,
} from 'lucide-react';
import type { Payload } from '@/types';
import { DIFFICULTY_COLORS, CATEGORY_COLORS } from '@/lib/constants';
import PayloadCode from './PayloadCode';
import CopyButton from '@/components/ui/CopyButton';
import { useFavoritesStore } from '@/store/useFavoritesStore';

interface PayloadCardProps {
  payload: Payload;
  index: number;
  onCopy: (text: string, id: string) => void;
  onSelect: (payload: Payload) => void;
  copiedId: string | null;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'BGN',
  intermediate: 'INT',
  advanced: 'ADV',
  expert: 'EXP',
};

function PayloadCardInner({ payload, index, onCopy, onSelect, copiedId }: PayloadCardProps) {
  const catColor = CATEGORY_COLORS[payload.category] || '#888';
  const diffColor = DIFFICULTY_COLORS[payload.difficulty] || '#888';
  const isFavorite = useFavoritesStore((s) => s.isFavorite(payload.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      role="article"
      aria-label={`Payload: ${payload.description}`}
      className="group relative flex flex-col rounded-xl border border-border bg-bg-surface/60 transition-all duration-300 hover:border-border-hover hover:bg-bg-surface-hover hover:shadow-[0_0_20px_var(--color-accent-green-glow),0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden payload-card-lazy"
    >
      {/* Top accent line */}
      <div
        className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${catColor}, transparent)` }}
      />

      {/* Header: category + difficulty + char count */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
            style={{
              color: catColor,
              backgroundColor: `${catColor}15`,
              border: `1px solid ${catColor}25`,
              textShadow: `0 0 8px ${catColor}40`,
            }}
          >
            {payload.category}
          </span>
          <span
            className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
            style={{
              color: diffColor,
              backgroundColor: `${diffColor}15`,
              textShadow: `0 0 8px ${diffColor}40`,
            }}
          >
            {DIFFICULTY_LABELS[payload.difficulty]}
          </span>
        </div>
        <span className="text-[10px] font-mono text-text-muted">
          {payload.characterCount} chars
        </span>
      </div>

      {/* Payload code block */}
      <div className="relative px-4 py-2 flex-1">
        <div className="min-h-[3.5rem] max-h-[6rem] overflow-hidden">
          <PayloadCode code={payload.payload} maxLength={200} />
        </div>

        {/* Fade gradient for long payloads */}
        {payload.payload.length > 200 && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-surface/90 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Description */}
      <p className="px-4 pb-2 text-xs text-text-secondary leading-relaxed line-clamp-2">
        {payload.description}
      </p>

      {/* Tags */}
      {payload.tags.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1">
          {payload.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg-elevated text-text-muted border border-border"
            >
              {tag}
            </span>
          ))}
          {payload.tags.length > 4 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 text-text-muted">
              +{payload.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer: meta icons + actions */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-3">
          {payload.wafBypass.length > 0 && payload.wafBypass[0] !== 'generic' && (
            <div className="flex items-center gap-1 text-accent-red" title={`WAF Bypass: ${payload.wafBypass.join(', ')}`}>
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-mono">{payload.wafBypass.length}</span>
            </div>
          )}
          {payload.context !== 'html' && (
            <div className="flex items-center gap-1 text-accent-cyan" title={`Context: ${payload.context}`}>
              <Lock className="w-3 h-3" />
              <span className="text-[10px] font-mono">{payload.context}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-text-muted" title={`Browsers: ${payload.browsers.join(', ')}`}>
            <Globe className="w-3 h-3" />
            <span className="text-[10px] font-mono">{payload.browsers.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(payload.id)}
            className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-200 ${
              isFavorite
                ? 'bg-accent-red/10 border-accent-red/30 text-accent-red shadow-[0_0_10px_var(--color-accent-red)]'
                : 'bg-bg-elevated border-border text-text-muted hover:text-accent-red hover:border-accent-red/30'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Copy button */}
          <CopyButton
            text={payload.payload}
            id={payload.id}
            copiedId={copiedId}
            onCopy={onCopy}
          />

          {/* Detail button */}
          <button
            onClick={() => onSelect(payload)}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-bg-elevated border border-border text-text-muted hover:text-accent-green hover:border-accent-green/30 transition-all duration-200"
            aria-label="View payload details"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const PayloadCard = memo(PayloadCardInner);
export default PayloadCard;
