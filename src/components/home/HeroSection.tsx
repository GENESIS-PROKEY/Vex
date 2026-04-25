// ============================================================
// Vex — Cross the line.
// HeroSection — Text left, Terminal right (matching original)
// ============================================================

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, APP_GITHUB } from '@/lib/constants';
import { TOTAL_PAYLOAD_COUNT } from '@/data/payloads';
import Terminal from './Terminal';

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

export default function HeroSection() {
  return (
    <section className="relative flex items-center min-h-screen px-6 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-green/5 blur-[120px] pointer-events-none" />

      {/* Two-column layout: Text Left + Terminal Right */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24">
        {/* ── Left: Branding + CTA ── */}
        <div>
          {/* Badge */}
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-bg-surface/50 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-glow" />
            <span className="text-sm text-text-secondary font-mono">
              v1.0 — {TOTAL_PAYLOAD_COUNT} payloads loaded
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 {...fadeUp(0.2)} className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4">
            <span
              className="glitch-text text-gradient-shimmer drop-shadow-[0_0_25px_var(--color-accent-green)]"
              data-text={APP_NAME}
            >
              {APP_NAME}
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p {...fadeUp(0.3)} className="text-xl md:text-2xl font-light text-text-secondary mb-4 tracking-wide">
            {APP_TAGLINE}
          </motion.p>

          {/* Description */}
          <motion.p {...fadeUp(0.4)} className="text-sm text-text-muted max-w-lg mb-8 leading-relaxed">
            {APP_DESCRIPTION}
          </motion.p>

          {/* Stats row */}
          <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-6 mb-8">
            {[
              { value: `${TOTAL_PAYLOAD_COUNT}+`, label: 'XSS Payloads' },
              { value: '15+', label: 'Attack Contexts' },
              { value: '25+', label: 'WAF Bypasses' },
              { value: '24/7', label: 'Research Lab' },
            ].map(s => (
              <div key={s.label} className="text-left">
                <div className="text-2xl font-black text-accent-green font-mono" style={{ textShadow: '0 0 12px var(--color-accent-green-glow)' }}>{s.value}</div>
                <div className="text-[11px] text-text-muted uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp(0.5)} className="flex flex-wrap items-center gap-4">
            <Link
              href="/payloads"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-accent-green text-bg-primary font-semibold text-base transition-all duration-300 hover:shadow-[0_0_30px_var(--color-accent-green-glow),0_0_60px_var(--color-accent-green-glow)] hover:scale-[1.02] active:scale-[0.98]"
              style={{ boxShadow: '0 0 15px var(--color-accent-green-glow)' }}
            >
              <span>Explore Payloads</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-border text-text-primary font-medium text-base transition-all duration-300 hover:border-accent-cyan/50 hover:text-accent-cyan hover:shadow-[0_0_20px_var(--color-accent-cyan-glow)]"
            >
              Generate Payload
            </Link>
            <a
              href={APP_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-border text-text-secondary font-medium text-base transition-all duration-300 hover:border-accent-green/50 hover:text-accent-green hover:bg-accent-green-glow"
            >
              <GithubIcon />
              <span>GitHub</span>
            </a>
          </motion.div>
        </div>

        {/* ── Right: Terminal ── */}
        <motion.div {...fadeUp(0.6)} className="w-full">
          <Terminal />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-float"
      >
        <span className="text-xs font-mono">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent" />
      </motion.div>
    </section>
  );
}
