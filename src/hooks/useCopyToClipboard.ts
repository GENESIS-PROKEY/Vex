// ============================================================
// Vex — Cross the line.
// useCopyToClipboard Hook
// ============================================================

'use client';

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';

/**
 * Hook for copying text to clipboard with success/error feedback.
 * Returns the copy function and a `copied` flag that resets after a delay.
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);

  const copy = useCallback(
    async (text: string, id?: string) => {
      const success = await copyToClipboard(text);

      if (success) {
        setCopied(true);
        setCopiedId(id ?? null);
        addToast({
          message: 'Payload copied to clipboard!',
          type: 'success',
          duration: 2000,
        });
      } else {
        addToast({
          message: 'Failed to copy — try selecting manually',
          type: 'error',
          duration: 3000,
        });
      }

      setTimeout(() => {
        setCopied(false);
        setCopiedId(null);
      }, resetDelay);
    },
    [resetDelay, addToast]
  );

  return { copy, copied, copiedId };
}
