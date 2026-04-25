// ============================================================
// Vex — Cross the line.
// 404 — Page Not Found
// ============================================================

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent-red/5 blur-[150px] pointer-events-none" />

      {/* Glitch 404 */}
      <div className="relative mb-8">
        <h1
          className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-text-primary/20 to-transparent select-none"
          aria-hidden="true"
        >
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-6xl md:text-8xl font-black text-accent-red glitch-text drop-shadow-[0_0_30px_var(--color-accent-red)]"
            data-text="404"
          >
            404
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="text-center relative z-10 max-w-md">
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Page Not Found
        </h2>
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Maybe the payload you injected broke it? 😏
        </p>

        {/* Terminal-style hint */}
        <div className="mb-8 p-4 rounded-xl border border-border bg-bg-surface/50 font-mono text-xs text-left">
          <div className="text-text-muted mb-1">
            <span className="text-accent-green">vex@security</span>
            <span className="text-text-muted">:</span>
            <span className="text-accent-cyan">~</span>
            <span className="text-text-muted">$</span>{' '}
            <span className="text-text-primary">curl -I /this-page</span>
          </div>
          <div className="text-accent-red">HTTP/1.1 404 Not Found</div>
          <div className="text-text-muted">X-Powered-By: {APP_NAME}</div>
          <div className="text-text-muted">X-Hint: Try a different path</div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent-green text-bg-primary font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_20px_var(--color-accent-green-glow)] hover:scale-[1.02]"
          >
            ← Go Home
          </Link>
          <Link
            href="/payloads"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border text-text-secondary font-medium text-sm transition-all duration-200 hover:border-accent-cyan/30 hover:text-accent-cyan hover:shadow-[0_0_15px_var(--color-accent-cyan-glow)]"
          >
            Browse Payloads
          </Link>
        </div>
      </div>
    </div>
  );
}
