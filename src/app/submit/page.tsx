// ============================================================
// Vex — Cross the line.
// Submit Page — Payload submission form
// ============================================================

import type { Metadata } from 'next';
import SubmitForm from '@/components/submit/SubmitForm';

export const metadata: Metadata = {
  title: 'Submit Payload | Vex',
  description: 'Submit a new XSS payload to the Vex database. Generate YAML for GitHub PR submission.',
};

export default function SubmitPage() {
  return (
    <main className="min-h-screen">
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="text-gradient-green">Submit Payload</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1.5">
            Contribute a new XSS payload to the community database
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubmitForm />
      </div>
    </main>
  );
}
