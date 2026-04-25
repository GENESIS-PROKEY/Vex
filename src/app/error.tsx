// ============================================================
// Vex — Cross the line.
// Global Error Boundary — Styled fallback for route errors
// ============================================================

'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Vex Error]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mb-8">
        <AlertTriangle className="w-9 h-9 text-accent-red" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-text-primary mb-3">
        Something went wrong
      </h2>

      {/* Message */}
      <p className="text-sm text-text-secondary max-w-md mb-2">
        An unexpected error occurred while loading this page. This has been logged
        for investigation.
      </p>

      {/* Error digest */}
      {error.digest && (
        <p className="text-xs font-mono text-text-muted mb-8">
          Error ID: {error.digest}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-green text-bg-primary font-semibold text-sm hover:shadow-glow-green transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-hover transition-all duration-200"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
