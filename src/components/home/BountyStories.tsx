// ============================================================
// Vex — Cross the line.
// BountyStories — Glassmorphism Bug Bounty Success Stories
// ============================================================

'use client';

import { motion } from 'framer-motion';

const STORIES = [
  {
    badge: '🏆 Critical Impact',
    title: 'Social Media Platform XSS',
    desc: 'Researchers have discovered DOM-based XSS vulnerabilities in major social platforms that could affect millions of users, enabling account takeovers through malicious links.',
    bountyRange: '$5k–$25k',
    tag: 'Typical Range',
    card: { icon: '🔗', platform: 'Social Platforms', amount: '$15,000', type: 'DOM XSS', glow: '#3b82f6' },
  },
  {
    badge: '🔥 Browser Security',
    title: 'Browser Universal XSS',
    desc: 'Universal XSS vulnerabilities in browser engines represent some of the highest-impact discoveries, affecting any website visited by users and earning substantial rewards.',
    bountyRange: '$10k–$50k',
    tag: 'High Impact',
    card: { icon: '🌐', platform: 'Browser Security', amount: '$30,000', type: 'Universal XSS', glow: '#00ff88' },
  },
  {
    badge: '⚡ Payment Security',
    title: 'Financial Platform XSS',
    desc: 'XSS vulnerabilities in financial platforms are particularly valuable due to their potential for account takeover and access to sensitive financial data.',
    bountyRange: '$8k–$20k',
    tag: 'Financial Sector',
    card: { icon: '💳', platform: 'Financial Platforms', amount: '$12,000', type: 'Stored XSS', glow: '#f59e0b' },
  },
  {
    badge: '🛡️ Enterprise Impact',
    title: 'Enterprise CSP Bypasses',
    desc: 'Content Security Policy bypasses in enterprise environments represent sophisticated attack vectors that can compromise strict security implementations.',
    bountyRange: '$5k–$25k',
    tag: 'Enterprise Focus',
    card: { icon: '🔒', platform: 'Enterprise Security', amount: '$18,000', type: 'CSP Bypass', glow: '#a855f7' },
  },
];

const BOTTOM_STATS = [
  { value: '900+', label: 'XSS Payloads', sub: 'in our database', glow: '#00ff88' },
  { value: '$1K–$50K', label: 'Typical XSS Bounties', sub: 'reward ranges', glow: '#00d4ff' },
  { value: '15+', label: 'Attack Contexts', sub: 'covered by payloads', glow: '#a855f7' },
];

export default function BountyStories() {
  return (
    <section className="py-20 px-6 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-accent-green/3 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            <span className="text-gradient-green">💰 Bug Bounty Success Stories</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            Understanding the impact and value of XSS research in bug bounty programs
          </p>
        </motion.div>

        {/* Zigzag Stories */}
        <div className="space-y-8">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 items-center`}
            >
              {/* Story text — glassmorphism */}
              <div
                className="flex-1 p-6 rounded-2xl border transition-all duration-500 group hover:scale-[1.01] cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderColor: `${story.card.glow}15`,
                  boxShadow: `0 0 0 1px ${story.card.glow}08, 0 8px 32px rgba(0,0,0,0.3)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${story.card.glow}40`;
                  e.currentTarget.style.boxShadow = `0 0 25px ${story.card.glow}15, 0 0 50px ${story.card.glow}08, 0 8px 32px rgba(0,0,0,0.4)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${story.card.glow}15`;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${story.card.glow}08, 0 8px 32px rgba(0,0,0,0.3)`;
                }}
              >
                {/* Glow stripe top */}
                <div
                  className="absolute top-0 left-8 right-8 h-px opacity-40"
                  style={{ background: `linear-gradient(90deg, transparent, ${story.card.glow}, transparent)` }}
                />
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                  style={{
                    background: `${story.card.glow}12`,
                    color: story.card.glow,
                    border: `1px solid ${story.card.glow}25`,
                  }}
                >
                  {story.badge}
                </span>
                <h3 className="text-lg font-bold text-text-primary mb-2">{story.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-4">{story.desc}</p>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xl font-black font-mono"
                    style={{ color: story.card.glow }}
                  >
                    {story.bountyRange}
                  </span>
                  <span className="text-xs text-text-muted uppercase tracking-wider">{story.tag}</span>
                </div>
              </div>

              {/* Bounty card — glassmorphism + glow */}
              <div className="flex-shrink-0 w-full lg:w-60">
                <div
                  className="relative p-6 rounded-2xl text-center overflow-hidden transition-all duration-500 group hover:scale-[1.03] cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: `1px solid ${story.card.glow}20`,
                    boxShadow: `0 0 40px ${story.card.glow}08, 0 0 80px ${story.card.glow}04, inset 0 1px 0 ${story.card.glow}10`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = `1px solid ${story.card.glow}50`;
                    e.currentTarget.style.boxShadow = `0 0 30px ${story.card.glow}20, 0 0 60px ${story.card.glow}10, 0 0 90px ${story.card.glow}06, inset 0 1px 0 ${story.card.glow}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = `1px solid ${story.card.glow}20`;
                    e.currentTarget.style.boxShadow = `0 0 40px ${story.card.glow}08, 0 0 80px ${story.card.glow}04, inset 0 1px 0 ${story.card.glow}10`;
                  }}
                >
                  {/* Animated glow orb */}
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-[40px] opacity-30 animate-pulse"
                    style={{ background: story.card.glow }}
                  />
                  {/* Bottom glow reflection */}
                  <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full blur-[25px] opacity-15"
                    style={{ background: story.card.glow }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 text-xs text-text-muted mb-3">
                      <span className="text-2xl">{story.card.icon}</span>
                    </div>
                    <div className="text-[10px] text-text-muted uppercase tracking-widest mb-2">{story.card.platform}</div>
                    <div
                      className="text-4xl font-black font-mono mb-2"
                      style={{
                        color: story.card.glow,
                        textShadow: `0 0 20px ${story.card.glow}40, 0 0 40px ${story.card.glow}20`,
                      }}
                    >
                      {story.card.amount}
                    </div>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                      style={{
                        background: `${story.card.glow}15`,
                        color: story.card.glow,
                        border: `1px solid ${story.card.glow}20`,
                      }}
                    >
                      {story.card.type}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats — glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16"
        >
          {BOTTOM_STATS.map(s => (
            <div
              key={s.label}
              className="relative text-center p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-default"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${s.glow}15`,
                boxShadow: `0 0 30px ${s.glow}06, inset 0 1px 0 ${s.glow}10`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = `1px solid ${s.glow}40`;
                e.currentTarget.style.boxShadow = `0 0 25px ${s.glow}18, 0 0 50px ${s.glow}08, inset 0 1px 0 ${s.glow}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = `1px solid ${s.glow}15`;
                e.currentTarget.style.boxShadow = `0 0 30px ${s.glow}06, inset 0 1px 0 ${s.glow}10`;
              }}
            >
              {/* Glow dot */}
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
                style={{ background: s.glow, boxShadow: `0 0 8px ${s.glow}60` }}
              />
              <div
                className="text-3xl font-black font-mono mb-1"
                style={{ color: s.glow, textShadow: `0 0 15px ${s.glow}30` }}
              >
                {s.value}
              </div>
              <div className="text-sm font-semibold text-text-primary">{s.label}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
