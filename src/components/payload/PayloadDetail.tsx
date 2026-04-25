// ============================================================
// Vex — Cross the line.
// PayloadDetail Modal
// ============================================================

'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Shield,
  Globe,
  Lock,
  User,
  Tag,
  Hash,
  ExternalLink,
  FileCode,
  Heart,
  Share2,
} from 'lucide-react';
import type { Payload } from '@/types';
import { DIFFICULTY_COLORS, CATEGORY_COLORS } from '@/lib/constants';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import PayloadCode from './PayloadCode';
import PayloadTester from './PayloadTester';
import CopyButton from '@/components/ui/CopyButton';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useUIStore } from '@/store/useUIStore';

interface PayloadDetailProps {
  payload: Payload | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PayloadDetail({ payload, isOpen, onClose }: PayloadDetailProps) {
  const { copy, copiedId } = useCopyToClipboard();
  const addToast = useUIStore((s) => s.addToast);
  const isFavorite = payload ? useFavoritesStore.getState().isFavorite(payload.id) : false;
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const handleShare = useCallback(() => {
    if (!payload) return;
    const url = `${window.location.origin}/payloads?id=${payload.id}`;
    navigator.clipboard.writeText(url);
    addToast({ message: 'Share link copied!', type: 'info', duration: 2000 });
  }, [payload, addToast]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!payload) return null;

  const catColor = CATEGORY_COLORS[payload.category] || '#888';
  const diffColor = DIFFICULTY_COLORS[payload.difficulty] || '#888';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-bg-primary shadow-modal"
          >
            {/* Top Accent */}
            <div
              className="h-1 w-full rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, ${catColor}, ${catColor}44)` }}
            />

            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                  style={{ color: catColor, backgroundColor: `${catColor}15`, border: `1px solid ${catColor}30` }}
                >
                  {payload.category}
                </span>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ color: diffColor, backgroundColor: `${diffColor}15` }}
                >
                  {payload.difficulty}
                </span>
                <span className="text-xs font-mono text-text-muted px-2 py-1 rounded-lg bg-bg-elevated">
                  {payload.characterCount} chars
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => payload && toggleFavorite(payload.id)}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 ${
                    isFavorite
                      ? 'bg-accent-red/10 border-accent-red/30 text-accent-red shadow-[0_0_10px_var(--color-accent-red)]'
                      : 'border-border text-text-muted hover:text-accent-red hover:border-accent-red/30'
                  }`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
                  aria-label="Share payload"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-all"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-text-primary mb-1">{payload.description}</h2>
            </div>

            {/* Payload Code */}
            <div className="px-6 pb-4">
              <div className="relative group">
                <div className="flex items-center justify-between px-4 py-2 rounded-t-xl bg-bg-elevated border border-border border-b-0">
                  <div className="flex items-center gap-2 text-text-muted">
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">payload</span>
                  </div>
                  <CopyButton
                    text={payload.payload}
                    id={payload.id}
                    copiedId={copiedId}
                    onCopy={(text, id) => copy(text, id)}
                  />
                </div>
                <div className="code-block rounded-t-none border-t-0">
                  <PayloadCode code={payload.payload} maxLength={0} />
                </div>
              </div>
            </div>

            {/* Sandboxed Tester */}
            <div className="px-6 pb-4">
              <PayloadTester payload={payload.payload} />
            </div>

            {/* Metadata Grid */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-4">
              {/* Context */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-surface border border-border">
                <Lock className="w-4 h-4 text-accent-cyan mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Context</p>
                  <p className="text-sm text-text-primary font-medium capitalize">{payload.context}</p>
                </div>
              </div>

              {/* Browsers */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-surface border border-border">
                <Globe className="w-4 h-4 text-accent-green mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Browsers</p>
                  <p className="text-sm text-text-primary font-medium">{payload.browsers.join(', ')}</p>
                </div>
              </div>

              {/* WAF Bypass */}
              {payload.wafBypass.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-surface border border-border">
                  <Shield className="w-4 h-4 text-accent-red mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">WAF Bypass</p>
                    <p className="text-sm text-text-primary font-medium capitalize">
                      {payload.wafBypass.join(', ')}
                    </p>
                  </div>
                </div>
              )}


              {/* Encoding */}
              {payload.encoding.length > 0 && payload.encoding[0] !== 'none' && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-surface border border-border">
                  <Hash className="w-4 h-4 text-accent-yellow mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Encoding</p>
                    <p className="text-sm text-text-primary font-medium capitalize">
                      {payload.encoding.join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {payload.tags.length > 0 && (
              <div className="px-6 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {payload.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-bg-elevated text-text-secondary border border-border hover:border-accent-green/30 hover:text-accent-green transition-all cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
