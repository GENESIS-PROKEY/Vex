// ============================================================
// Vex — Cross the line.
// Generator Page — Context-aware XSS payload generator
// ============================================================

import type { Metadata } from 'next';
import GeneratorClient from '@/components/generator/GeneratorClient';
import { TOTAL_PAYLOAD_COUNT } from '@/data/payloads';

export const metadata: Metadata = {
  title: 'Payload Generator | Vex',
  description: 'Generate context-aware XSS payloads with WAF bypass techniques, encoding evasions, and character restriction handling.',
};

export default function GeneratorPage() {
  return (
    <main className="min-h-screen">
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="text-gradient-green">Payload Generator</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1.5">
            Generate context-aware XSS payloads with advanced bypass techniques
          </p>
          <div className="flex items-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-xl font-black text-text-primary">{TOTAL_PAYLOAD_COUNT}+</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Base Payloads</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-text-primary">6</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Contexts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-text-primary">5</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">WAF Bypasses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GeneratorClient />
      </div>
    </main>
  );
}
