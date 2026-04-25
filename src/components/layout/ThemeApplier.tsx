// ============================================================
// Vex — Cross the line.
// ThemeApplier — Applies global theme CSS variables to <html>
// ============================================================

'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export default function ThemeApplier() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const c = theme.colors;

    // Background
    root.style.setProperty('--color-bg-primary', c.bgPrimary);
    root.style.setProperty('--color-bg-secondary', c.bgSecondary);
    root.style.setProperty('--color-bg-surface', c.bgSurface);
    root.style.setProperty('--color-bg-surface-hover', c.bgSurfaceHover);
    root.style.setProperty('--color-bg-elevated', c.bgElevated);

    // Borders
    root.style.setProperty('--color-border', c.border);
    root.style.setProperty('--color-border-hover', c.borderHover);
    root.style.setProperty('--color-border-focus', c.borderFocus);

    // Accents
    root.style.setProperty('--color-accent-green', c.accentGreen);
    root.style.setProperty('--color-accent-green-dim', c.accentGreenDim);
    root.style.setProperty('--color-accent-green-glow', hexToRgba(c.accentGreen, 0.15));
    root.style.setProperty('--color-accent-cyan', c.accentCyan);
    root.style.setProperty('--color-accent-cyan-dim', c.accentCyanDim);
    root.style.setProperty('--color-accent-cyan-glow', hexToRgba(c.accentCyan, 0.15));
    root.style.setProperty('--color-accent-red', c.accentRed);
    root.style.setProperty('--color-accent-red-dim', c.accentRedDim);
    root.style.setProperty('--color-accent-red-glow', hexToRgba(c.accentRed, 0.15));
    root.style.setProperty('--color-accent-orange', c.accentOrange);
    root.style.setProperty('--color-accent-orange-dim', c.accentOrangeDim);
    root.style.setProperty('--color-accent-purple', c.accentPurple);
    root.style.setProperty('--color-accent-purple-dim', c.accentPurpleDim);
    root.style.setProperty('--color-accent-yellow', c.accentYellow);

    // Text
    root.style.setProperty('--color-text-primary', c.textPrimary);
    root.style.setProperty('--color-text-secondary', c.textSecondary);
    root.style.setProperty('--color-text-muted', c.textMuted);
    root.style.setProperty('--color-text-accent', c.textAccent);

    // Shadows (derived from accent colors)
    root.style.setProperty('--shadow-glow-green', `0 0 20px ${hexToRgba(c.accentGreen, 0.15)}, 0 0 60px ${hexToRgba(c.accentGreen, 0.05)}`);
    root.style.setProperty('--shadow-glow-cyan', `0 0 20px ${hexToRgba(c.accentCyan, 0.15)}, 0 0 60px ${hexToRgba(c.accentCyan, 0.05)}`);
    root.style.setProperty('--shadow-glow-red', `0 0 20px ${hexToRgba(c.accentRed, 0.15)}, 0 0 60px ${hexToRgba(c.accentRed, 0.05)}`);
    root.style.setProperty('--shadow-card-hover', `0 4px 20px rgba(0,0,0,0.5), 0 0 30px ${hexToRgba(c.accentGreen, 0.08)}`);
  }, [theme]);

  return null;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
