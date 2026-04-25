// ============================================================
// Vex — Cross the line.
// Changelog Page
// ============================================================

import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Changelog',
  description: `What's new in ${APP_NAME} — release history and updates.`,
};

const RELEASES = [
  {
    version: '1.2.0',
    date: 'April 2026',
    tag: 'Latest',
    changes: [
      { type: 'feature' as const, text: '12 global color themes with smooth transitions' },
      { type: 'feature' as const, text: 'Payload favorites with localStorage persistence' },
      { type: 'feature' as const, text: 'Export filtered payloads as .txt' },
      { type: 'feature' as const, text: 'Deep linking — share payload URLs' },
      { type: 'feature' as const, text: 'Keyboard shortcuts (⌘K search, T theme cycle, Esc close)' },
      { type: 'feature' as const, text: 'Scroll-to-top floating button' },
      { type: 'design' as const, text: '14+ glow effects across all components' },
      { type: 'design' as const, text: 'Custom 404 page with terminal styling' },
      { type: 'design' as const, text: 'Page transition animations' },
      { type: 'tech' as const, text: 'PWA manifest for installable app' },
      { type: 'tech' as const, text: 'Content-visibility optimizations for performance' },
    ],
  },
  {
    version: '1.1.0',
    date: 'March 2026',
    tag: null,
    changes: [
      { type: 'feature' as const, text: 'Interactive XSS playground with sandboxed preview' },
      { type: 'feature' as const, text: 'Payload tester inside detail modal' },
      { type: 'feature' as const, text: 'Advanced filter sidebar with WAF/CSP/encoding filters' },
      { type: 'design' as const, text: 'Glassmorphism bug bounty stories section' },
      { type: 'design' as const, text: 'Terminal typewriter animation on homepage' },
      { type: 'tech' as const, text: 'URL-synced filter state via nuqs' },
    ],
  },
  {
    version: '1.0.0',
    date: 'February 2026',
    tag: null,
    changes: [
      { type: 'feature' as const, text: '940+ curated XSS payloads' },
      { type: 'feature' as const, text: 'Fuzzy search with Fuse.js' },
      { type: 'feature' as const, text: 'Category, difficulty, and context filtering' },
      { type: 'design' as const, text: 'Cyberpunk-inspired dark theme' },
      { type: 'design' as const, text: 'Syntax highlighting with Shiki' },
      { type: 'tech' as const, text: 'Next.js 16 + React 19 + Tailwind v4' },
    ],
  },
];

const TYPE_STYLES = {
  feature: { label: 'Feature', color: 'text-accent-green bg-accent-green/10 border-accent-green/20' },
  design: { label: 'Design', color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20' },
  tech: { label: 'Tech', color: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20' },
  fix: { label: 'Fix', color: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20' },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="text-gradient-green">Changelog</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1.5">
            What&apos;s new in {APP_NAME} — release history and updates
          </p>
        </div>
      </div>

      {/* Releases */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-12">
            {RELEASES.map((release, i) => (
              <div key={release.version} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1 w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center ${
                    i === 0
                      ? 'border-accent-green bg-accent-green/20 shadow-[0_0_10px_var(--color-accent-green-glow)]'
                      : 'border-border bg-bg-surface'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-accent-green' : 'bg-text-muted'}`} />
                </div>

                {/* Version header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-black text-text-primary font-mono">v{release.version}</h2>
                  <span className="text-xs text-text-muted">{release.date}</span>
                  {release.tag && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/20">
                      {release.tag}
                    </span>
                  )}
                </div>

                {/* Changes list */}
                <ul className="space-y-2">
                  {release.changes.map((change, j) => {
                    const style = TYPE_STYLES[change.type];
                    return (
                      <li key={j} className="flex items-start gap-2.5">
                        <span className={`shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border mt-0.5 ${style.color}`}>
                          {style.label}
                        </span>
                        <span className="text-sm text-text-secondary">{change.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
