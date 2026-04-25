// ============================================================
// Vex — Cross the line.
// Footer Component
// ============================================================

import Link from 'next/link';
import { Heart, ExternalLink } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className || 'w-4 h-4'} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
import { APP_NAME, APP_TAGLINE, APP_GITHUB } from '@/lib/constants';

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'Payloads', href: '/payloads' },
      { label: 'Generator', href: '/generator' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', href: APP_GITHUB, external: true },
      { label: 'Playground', href: '/playground' },
      { label: 'Report Issue', href: `${APP_GITHUB}/issues`, external: true },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'XSS Fundamentals', href: '/docs#fundamentals' },
      { label: 'Bypass Techniques', href: '/docs#bypass-techniques' },
      { label: 'Prevention Guide', href: '/docs#prevention' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-bg-secondary/50">
      {/* Glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-green/40 to-transparent" style={{ boxShadow: '0 0 15px var(--color-accent-green-glow), 0 0 30px var(--color-accent-green-glow)' }} />
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black text-gradient-green">{APP_NAME}</span>
            </Link>
            <p className="text-text-secondary text-sm mt-2 italic">{APP_TAGLINE}</p>
            <p className="text-text-muted text-xs mt-4 leading-relaxed max-w-xs">
              The ultimate XSS payload arsenal for security researchers. Open source, community-driven.
            </p>
            <a
              href={APP_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm hover:text-accent-green hover:border-accent-green/30 transition-all duration-200"
            >
              <GithubIcon className="w-4 h-4" />
              Star on GitHub
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-green transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-accent-green transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-border">
        {/* Glow line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" style={{ boxShadow: '0 0 10px var(--color-accent-cyan-glow)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-accent-red" /> by{' '}
            <a
              href={APP_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-green transition-colors"
            >
              Genesis Prokey
            </a>
          </p>
          <p className="text-text-muted text-xs">
            Open source under MIT License
          </p>
        </div>
      </div>
    </footer>
  );
}
