// ============================================================
// Vex — Cross the line.
// Playground Page — DOM Playground for testing payloads
// ============================================================

import type { Metadata } from 'next';
import PlaygroundClient from '@/components/playground/PlaygroundClient';

export const metadata: Metadata = {
  title: 'DOM Playground — Test XSS Payloads Safely',
  description: 'Live DOM sandbox for testing XSS payloads safely. Includes vulnerable page presets and sandboxed execution.',
  openGraph: {
    title: 'Vex DOM Playground',
    description: 'Test XSS payloads against vulnerable templates in a safe sandbox.',
  },
};

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen">
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="text-gradient-green">DOM Playground</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1.5">
            Test XSS payloads against vulnerable page templates in a safe sandbox
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlaygroundClient />
      </div>
    </main>
  );
}
