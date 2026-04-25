// ============================================================
// Vex — Cross the line.
// useAnalytics — Lightweight page view tracking
// ============================================================

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lightweight analytics hook that tracks page views.
 * Currently logs to console in dev mode.
 * Replace the trackPageView function body with your analytics
 * provider (e.g., Plausible, Umami, PostHog) for production.
 */

function trackPageView(path: string) {
  if (process.env.NODE_ENV === 'development') {
    // Dev-only: silent tracking
    return;
  }

  // Production: send to analytics provider
  // Examples:
  // plausible('pageview', { props: { path } });
  // umami.track('pageview', { url: path });
  // posthog.capture('$pageview', { $current_url: path });

  // Fallback: use navigator.sendBeacon if available
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const data = JSON.stringify({
      event: 'pageview',
      path,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct',
    });
    // Uncomment when you have an analytics endpoint:
    // navigator.sendBeacon('/api/analytics', data);
    void data; // prevent unused var warning
  }
}

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
}
