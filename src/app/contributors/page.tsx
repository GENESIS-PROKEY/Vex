// ============================================================
// Vex — Cross the line.
// Contributors Page — Leaderboard and contributor cards
// ============================================================

import type { Metadata } from 'next';
import { ALL_PAYLOADS } from '@/data/payloads';
import { aggregateContributors, computeStats } from '@/lib/aggregation';
import ContributorCard from '@/components/contributors/ContributorCard';
import { Trophy, Users, Zap, GitPullRequest } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contributors | Vex',
  description: 'Meet the security researchers and contributors behind the Vex XSS payload database.',
};

export default function ContributorsPage() {
  const contributors = aggregateContributors(ALL_PAYLOADS);
  const stats = computeStats(ALL_PAYLOADS);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="text-gradient-green">Contributors</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1.5">
            The security researchers powering the Vex payload database
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-surface/50">
            <Users className="w-5 h-5 text-accent-green" />
            <div>
              <p className="text-2xl font-black text-text-primary">{formatNumber(stats.totalContributors)}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Contributors</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-surface/50">
            <Zap className="w-5 h-5 text-accent-cyan" />
            <div>
              <p className="text-2xl font-black text-text-primary">{formatNumber(stats.totalPayloads)}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Payloads</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-surface/50">
            <Trophy className="w-5 h-5 text-accent-orange" />
            <div>
              <p className="text-2xl font-black text-text-primary">{contributors[0]?.count || 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Top Score</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-surface/50">
            <GitPullRequest className="w-5 h-5 text-accent-purple" />
            <div>
              <p className="text-2xl font-black text-text-primary">{stats.totalCategories}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Categories</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent-orange" />
          Leaderboard
        </h2>

        <div className="space-y-2">
          {contributors.map((c, i) => (
            <ContributorCard
              key={c.name}
              rank={i + 1}
              name={c.name}
              githubUsername={c.githubUsername}
              payloadCount={c.count}
              categories={c.categories}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl border border-border bg-bg-surface/30 text-center">
          <h3 className="text-lg font-bold text-text-primary mb-2">
            Want to join the leaderboard?
          </h3>
          <p className="text-sm text-text-secondary mb-4 max-w-md mx-auto">
            Submit your own XSS payloads and help the security community grow.
          </p>
          <a
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Zap className="w-4 h-4" />
            Submit a Payload
          </a>
        </div>
      </div>
    </main>
  );
}
