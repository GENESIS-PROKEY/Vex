// ============================================================
// Vex — Cross the line.
// KeyboardShortcutsProvider — Global keyboard shortcuts + analytics
// ============================================================

'use client';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function KeyboardShortcutsProvider() {
  useKeyboardShortcuts();
  useAnalytics();
  return null;
}
