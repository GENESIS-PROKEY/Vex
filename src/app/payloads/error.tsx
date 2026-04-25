// ============================================================
// Vex — Cross the line.
// Payloads Error Boundary — Route-specific error handler
// ============================================================

'use client';

import { useEffect } from 'react';
import { ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PayloadsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Vex Payloads Error]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center mb-8">
        <ShieldAlert className="w-9 h-9 text-accent-orange" />
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-3">
        Payload database error
      </h2>

      <p className="text-sm text-text-secondary max-w-md mb-8">
        Failed to load the payload browser. The search index or filter engine may
        have encountered an issue. Try refreshing the page.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-green text-bg-primary font-semibold text-sm hover:shadow-glow-green transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Reload Browser
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-hover transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
