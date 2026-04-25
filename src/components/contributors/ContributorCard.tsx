// ============================================================
// Vex — Cross the line.
// ContributorCard — Display a contributor with stats
// ============================================================

import { ExternalLink } from 'lucide-react';

interface ContributorCardProps {
  rank: number;
  name: string;
  githubUsername?: string;
  payloadCount: number;
  categories: string[];
}

export default function ContributorCard({
  rank,
  name,
  githubUsername,
  payloadCount,
  categories,
}: ContributorCardProps) {
  const avatarUrl = githubUsername
    ? `https://github.com/${githubUsername}.png?size=80`
    : undefined;

  const rankColor =
    rank === 1
      ? '#ffd700'
      : rank === 2
        ? '#c0c0c0'
        : rank === 3
          ? '#cd7f32'
          : undefined;

  return (
    <div className="group relative flex items-center gap-4 p-4 rounded-xl border border-border bg-bg-surface/60 hover:border-border-hover hover:bg-bg-surface-hover transition-all duration-300">
      {/* Rank */}
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black shrink-0"
        style={
          rankColor
            ? { color: rankColor, backgroundColor: `${rankColor}15`, border: `1px solid ${rankColor}30` }
            : undefined
        }
      >
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border overflow-hidden shrink-0">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-text-muted">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary truncate">{name}</h3>
          {githubUsername && (
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-green transition-colors shrink-0"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-mono text-accent-green font-bold">
            {payloadCount} payloads
          </span>
          {categories.length > 0 && (
            <span className="text-[10px] text-text-muted truncate">
              {categories.slice(0, 3).join(', ')}
              {categories.length > 3 && ` +${categories.length - 3}`}
            </span>
          )}
        </div>
      </div>

      {/* Bar chart */}
      <div className="w-20 h-2 rounded-full bg-bg-elevated overflow-hidden shrink-0">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-cyan"
          style={{ width: `${Math.min(100, payloadCount * 2)}%` }}
        />
      </div>
    </div>
  );
}
