// ============================================================
// Vex — Cross the line.
// Root Layout
// ============================================================

import type { Metadata, Viewport } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/ui/Toast';
import ThemeApplier from '@/components/layout/ThemeApplier';
import ScrollToTop from '@/components/ui/ScrollToTop';
import KeyboardShortcutsProvider from '@/components/layout/KeyboardShortcutsProvider';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Vex — Cross the line.',
    template: '%s | Vex',
  },
  description:
    'The ultimate XSS payload arsenal for security researchers, penetration testers, and bug bounty hunters. 940+ curated payloads, advanced bypass techniques, and intelligent search.',
  keywords: [
    'XSS', 'Cross-Site Scripting', 'XSS payloads', 'security research',
    'bug bounty', 'penetration testing', 'WAF bypass', 'CSP bypass',
    'web security', 'payload database',
  ],
  authors: [{ name: 'Genesis Prokey', url: 'https://github.com/GENESIS-PROKEY' }],
  creator: 'Vex Security',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Vex — Cross the line.',
    description: 'The ultimate XSS payload arsenal. 940+ curated payloads, WAF bypasses, CSP evasions, and advanced filter circumvention techniques.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Vex',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vex — Cross the line.',
    description: 'The ultimate XSS payload arsenal. 940+ curated payloads for security researchers.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
        <NuqsAdapter>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <ThemeApplier />
          <KeyboardShortcutsProvider />
          <Navbar />
          <main id="main-content" className="pt-16" role="main">{children}</main>
          <Footer />
          <ToastContainer />
          <ScrollToTop />
        </NuqsAdapter>
      </body>
    </html>
  );
}
