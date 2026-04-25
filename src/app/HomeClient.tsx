// ============================================================
// Vex — Cross the line.
// HomeClient — Hero + BountyStories (no categories)
// ============================================================

'use client';

import dynamic from 'next/dynamic';
import PageTransition from '@/components/layout/PageTransition';
import HeroSection from '@/components/home/HeroSection';
import BountyStories from '@/components/home/BountyStories';

// Lazy-load MatrixRain to avoid SSR issues with canvas
const MatrixRain = dynamic(
  () => import('@/components/background/MatrixRain'),
  { ssr: false }
);

export default function HomeClient() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-bg-primary relative">
        {/* Matrix rain background — homepage only */}
        <MatrixRain />

        {/* Hero with Terminal (text left, terminal right) */}
        <HeroSection />

        {/* Bug Bounty Success Stories (from original) */}
        <BountyStories />
      </main>
    </PageTransition>
  );
}
