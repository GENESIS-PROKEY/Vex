// ============================================================
// Vex — Cross the line.
// useKeyboardShortcuts — Global keyboard shortcuts
// ============================================================

'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { useUIStore } from '@/store/useUIStore';

export function useKeyboardShortcuts() {
  const cycleTheme = useThemeStore((s) => s.cycleTheme);
  const closePayloadDetail = useUIStore((s) => s.closePayloadDetail);
  const detailModalOpen = useUIStore((s) => s.detailModalOpen);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // ⌘K / Ctrl+K — Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('payload-search') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape — Close modals
      if (e.key === 'Escape') {
        if (detailModalOpen) {
          closePayloadDetail();
        }
      }

      // T — Cycle theme (only when not in input)
      if (e.key === 't' && !isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        cycleTheme();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleTheme, closePayloadDetail, detailModalOpen]);
}
