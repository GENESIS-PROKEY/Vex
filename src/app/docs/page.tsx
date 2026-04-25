// ============================================================
// Vex — Cross the line.
// Documentation Page — XSS Security Guide
// ============================================================

import type { Metadata } from 'next';
import DocsClient from '@/components/docs/DocsClient';

export const metadata: Metadata = {
  title: 'Documentation | Vex',
  description: 'Comprehensive guide to XSS vulnerabilities, bypass techniques, detection strategies, and prevention methods for security researchers.',
};

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="text-gradient-green">Documentation</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1.5">
            Complete XSS security guide — from fundamentals to advanced exploitation and prevention
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DocsClient />
      </div>
    </main>
  );
}
