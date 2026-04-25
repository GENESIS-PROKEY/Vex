// ============================================================
// Vex — Cross the line.
// Skeleton — Loading placeholder components
// ============================================================

'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/** Base skeleton shimmer element */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg skeleton-shimmer border border-border/20',
        className
      )}
    />
  );
}

/** Skeleton for a single payload card */
export function PayloadCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-bg-surface/40 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-8 h-5" />
        </div>
        <Skeleton className="w-14 h-4" />
      </div>

      {/* Code block */}
      <div className="px-4 py-2">
        <Skeleton className="w-full h-14" />
      </div>

      {/* Description */}
      <div className="px-4 pb-2">
        <Skeleton className="w-3/4 h-3" />
      </div>

      {/* Tags */}
      <div className="px-4 pb-2 flex gap-1">
        <Skeleton className="w-12 h-5" />
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-10 h-5" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/30 mt-auto">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-4" />
          <Skeleton className="w-8 h-4" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-16 h-7" />
          <Skeleton className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}

/** Grid of skeleton payload cards */
export function PayloadGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PayloadCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for the search bar area */
export function SearchBarSkeleton() {
  return (
    <Skeleton className="w-full h-12 rounded-xl" />
  );
}

/** Skeleton for the filter bar */
export function FilterBarSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="w-24 h-9" />
      <Skeleton className="w-28 h-9" />
    </div>
  );
}

/** Full page skeleton for the payload browser */
export function PayloadBrowserSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <Skeleton className="w-64 h-10 mb-2" />
              <Skeleton className="w-80 h-4" />
            </div>
            <Skeleton className="w-40 h-10" />
          </div>
          <SearchBarSkeleton />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterBarSkeleton />
        <div className="mt-6">
          <PayloadGridSkeleton />
        </div>
      </div>
    </div>
  );
}
