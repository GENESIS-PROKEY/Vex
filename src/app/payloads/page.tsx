// ============================================================
// Vex — Cross the line.
// Payloads Page — Main payload browser
// ============================================================

import { Suspense } from 'react';
import type { Metadata } from 'next';
import PayloadBrowser from './PayloadBrowser';

export const metadata: Metadata = {
  title: 'Payload Browser — 940+ Curated XSS Payloads',
  description:
    'Browse 940+ curated XSS payloads. Filter by category, difficulty, WAF target, encoding, and injection context. Copy-ready for security testing.',
  openGraph: {
    title: 'Vex Payload Browser — 940+ XSS Payloads',
    description: 'The largest curated XSS payload database. Filter by WAF bypass, CSP evasion, encoding, and more.',
  },
  twitter: {
    card: 'summary',
    title: 'Vex Payload Browser',
    description: 'Browse 940+ curated XSS payloads for security research.',
  },
};

export default function PayloadsPage() {
  return (
    <Suspense>
      <PayloadBrowser />
    </Suspense>
  );
}
