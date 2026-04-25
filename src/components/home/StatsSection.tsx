// ============================================================
// Vex — Cross the line.
// StatsSection — Animated counters with reveal
// ============================================================

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { formatNumber } from '@/lib/utils';

interface StatItem {
  value: number;
  label: string;
  color: string;
}

interface StatsSectionProps {
  stats: StatItem[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              <div className={`text-4xl md:text-5xl font-black font-mono ${stat.color}`}>
                {isInView ? formatNumber(stat.value) : '0'}+
              </div>
              <div className="text-sm text-text-secondary mt-2 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
