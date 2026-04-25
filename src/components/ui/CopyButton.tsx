// ============================================================
// Vex — Cross the line.
// CopyButton — Reusable copy-to-clipboard button with animation
// ============================================================

'use client';

import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  id: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export default function CopyButton({
  text,
  id,
  copiedId,
  onCopy,
  size = 'sm',
  showLabel = true,
  className,
}: CopyButtonProps) {
  const isCopied = copiedId === id;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onCopy(text, id);
      }}
      className={cn(
        'flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200',
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        isCopied
          ? 'bg-accent-green/20 text-accent-green border border-accent-green/30 animate-copy-flash'
          : 'bg-bg-elevated text-text-secondary border border-border hover:text-accent-green hover:border-accent-green/30 hover:bg-accent-green/5',
        className
      )}
      aria-label={isCopied ? 'Copied!' : 'Copy payload'}
    >
      {isCopied ? (
        <Check className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      ) : (
        <Copy className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      )}
      {showLabel && (isCopied ? 'Copied' : 'Copy')}
    </button>
  );
}
