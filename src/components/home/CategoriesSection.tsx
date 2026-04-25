// ============================================================
// Vex — Cross the line.
// CategoriesSection — Category grid with hover effects
// ============================================================

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import type { CategoryInfo } from '@/types';

interface CategoriesSectionProps {
  categories: (CategoryInfo & { count: number })[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const sorted = categories
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          <span className="text-gradient-green">Payload Categories</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center mb-16 max-w-xl mx-auto"
        >
          Organized by attack vector, defense target, and injection context
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
            >
              <Link
                href={`/payloads?cat=${cat.id}`}
                className="group relative block p-5 rounded-xl border border-border bg-bg-surface/50 transition-all duration-300 hover:border-border-hover hover:bg-bg-surface-hover hover:shadow-card-hover"
              >
                {/* Glow accent line */}
                <div
                  className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }}
                />

                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-base font-semibold transition-colors duration-300"
                    style={{ color: cat.color }}
                  >
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono text-text-muted px-2 py-0.5 rounded-full bg-bg-elevated border border-border">
                    {cat.count}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
