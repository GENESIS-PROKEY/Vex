// ============================================================
// Vex — Cross the line.
// Navbar Component
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Zap,
  Search,
  Wand2,
  Monitor,
  BookOpen,
} from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
import { APP_NAME, APP_GITHUB } from '@/lib/constants';
import { TOTAL_PAYLOAD_COUNT } from '@/data/payloads';
import { useThemeStore } from '@/store/useThemeStore';

const NAV_LINKS = [
  { href: '/payloads', label: 'Payloads', icon: Zap },
  { href: '/generator', label: 'Generator', icon: Wand2 },
  { href: '/playground', label: 'Playground', icon: Monitor },
  { href: '/docs', label: 'Docs', icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <span className="text-2xl font-black text-gradient-green tracking-tight" style={{ filter: 'drop-shadow(0 0 8px var(--color-accent-green-glow))' }}>
                {APP_NAME}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-[11px] font-mono text-accent-green" style={{ boxShadow: '0 0 10px var(--color-accent-green-glow)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-glow" />
                {TOTAL_PAYLOAD_COUNT}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-accent-green bg-accent-green/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent-green rounded-full"
                        style={{ boxShadow: '0 0 8px var(--color-accent-green), 0 0 16px var(--color-accent-green-glow)' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <Link
                href="/payloads"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-hover text-sm transition-all duration-200"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search payloads...</span>
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-[10px] font-mono text-text-muted">
                  ⌘K
                </kbd>
              </Link>

              <a
                href={APP_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-all duration-200"
                aria-label="GitHub repository"
              >
                <GithubIcon />
              </a>

              {/* Theme cycle button */}
              <ThemeCycleButton />

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-all duration-200"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-bg-primary border-l border-border p-6 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-accent-green bg-accent-green/10 border border-accent-green/20'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}

                <hr className="border-border my-4" />

                <a
                  href={APP_GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-all duration-200"
                >
                  <GithubIcon />
                  GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Theme Cycle Button ──
function ThemeCycleButton() {
  const { theme, cycleTheme } = useThemeStore();
  return (
    <button
      onClick={cycleTheme}
      className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover hover:shadow-[0_0_12px_var(--color-accent-green-glow)] transition-all duration-200"
      aria-label={`Theme: ${theme.name}. Click to switch.`}
      title={`Theme: ${theme.name}`}
    >
      <span className="text-lg leading-none">{theme.icon}</span>
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-medium text-text-primary bg-bg-elevated border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {theme.name}
      </span>
    </button>
  );
}
