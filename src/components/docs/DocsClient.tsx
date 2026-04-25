// ============================================================
// Vex — Cross the line.
// DocsClient — Interactive documentation renderer
// ============================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { DOC_SECTIONS } from '@/data/docs-content';
import { ExternalLink, AlertTriangle, Copy, Check } from 'lucide-react';
import Link from 'next/link';

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-bg-primary">
      {label && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-bg-elevated/60 border-b border-border">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{label}</span>
          <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent-green transition-colors">
            {copied ? <><Check className="w-2.5 h-2.5" /> Copied</> : <><Copy className="w-2.5 h-2.5" /> Copy</>}
          </button>
        </div>
      )}
      {!label && (
        <button onClick={handleCopy} className="absolute top-2 right-2 p-1 rounded text-text-muted/40 hover:text-accent-green transition-colors z-10">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
      <pre className="relative p-3 text-[11.5px] font-mono text-accent-cyan/80 leading-relaxed overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
}

export default function DocsClient() {
  const [activeSection, setActiveSection] = useState('fundamentals');
  const contentRef = useRef<HTMLDivElement>(null);

  // Intersection observer for active section tracking
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { root: container, rootMargin: '-20% 0px -60% 0px' }
    );
    const sections = container.querySelectorAll('[data-doc-section]');
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex gap-8" style={{ height: 'calc(100vh - 180px)' }}>
      {/* ── Sidebar — independent scroll, full height ── */}
      <aside
        className="hidden lg:block w-72 shrink-0 overflow-y-auto pr-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#00ff8830 transparent',
        }}
      >
        <nav className="space-y-1 pb-8" aria-label="Documentation sections">
          <div className="text-[11px] font-bold uppercase tracking-widest text-accent-green/60 mb-4 px-3">
            📖 Documentation
          </div>
          {DOC_SECTIONS.map(s => {
            const isActive = activeSection === s.id;
            return (
              <div key={s.id} className="mb-1">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(s.id);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-bg-surface border border-border text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="flex-1">{s.title}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: s.color }} />
                  )}
                </a>
                {/* Subsection links */}
                {isActive && (
                  <div className="ml-6 mt-1 mb-2 pl-3 border-l-2 border-border/50 space-y-0.5">
                    {s.subsections.map(sub => (
                      <a
                        key={sub.id}
                        href={`#${sub.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(sub.id);
                          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="block px-2 py-1.5 rounded-md text-xs text-text-muted hover:text-accent-green hover:bg-accent-green/5 transition-all"
                      >
                        {sub.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Fill remaining space with subtle decoration */}
          <div className="mt-6 px-3">
            <div className="h-px bg-border/30 mb-4" />
            <div className="text-[9px] text-text-muted/40 uppercase tracking-widest text-center">
              {DOC_SECTIONS.length} sections • {DOC_SECTIONS.reduce((a, s) => a + s.subsections.length, 0)} topics
            </div>
          </div>
        </nav>
      </aside>

      {/* ── Content — independent scroll ── */}
      <div
        ref={contentRef}
        className="flex-1 min-w-0 overflow-y-auto space-y-16 pb-16"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#00d4ff30 transparent',
        }}
      >
        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-accent-orange/20 bg-accent-orange/5">
          <AlertTriangle className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-accent-orange mb-1">Educational Purpose Only</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              This documentation is for authorized security testing and educational use only. Always obtain proper written authorization before testing any systems.
            </p>
          </div>
        </div>

        {/* Sections */}
        {DOC_SECTIONS.map(section => (
          <section key={section.id} id={section.id} data-doc-section className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
              <span className="text-xl">{section.icon}</span>
              {section.title}
              <span className="ml-auto w-12 h-0.5 rounded-full opacity-30" style={{ background: section.color }} />
            </h2>

            <div className="space-y-12">
              {section.subsections.map(sub => (
                <div key={sub.id} id={sub.id} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-text-primary mb-3 pb-2 border-b border-border/50">{sub.title}</h3>

                  {sub.content && <p className="text-sm text-text-secondary leading-relaxed mb-5">{sub.content}</p>}

                  {/* Impact items grid */}
                  {sub.items && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                      {sub.items.map(item => (
                        <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-bg-surface/40 border border-border hover:border-accent-red/20 transition-colors">
                          <span className="text-lg shrink-0">{item.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                            <p className="text-[11px] text-text-muted mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* XSS Types */}
                  {sub.types && (
                    <div className="space-y-6">
                      {sub.types.map(type => (
                        <div key={type.name} className="rounded-xl border border-border bg-bg-surface/30 overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-elevated/30">
                            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                              <span>{type.icon}</span> {type.name}
                            </h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              type.severity === 'Critical' ? 'bg-accent-red/15 text-accent-red border border-accent-red/25' : 'bg-accent-orange/15 text-accent-orange border border-accent-orange/25'
                            }`}>{type.severity}</span>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-text-secondary mb-3">{type.desc}</p>
                            <CodeBlock code={type.code} label="Example" />
                            {type.flow && (
                              <div className="flex flex-wrap items-center gap-2 mt-4">
                                {type.flow.map((step, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-elevated border border-border text-[10px] text-text-secondary">
                                      <span className="w-4 h-4 rounded-full bg-accent-green/15 text-accent-green text-[9px] font-bold flex items-center justify-center">{i + 1}</span>
                                      {step}
                                    </div>
                                    {i < type.flow!.length - 1 && <span className="text-text-muted/30 text-xs">→</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Execution contexts */}
                  {sub.contexts && (
                    <div className="space-y-3">
                      {sub.contexts.map(ctx => (
                        <div key={ctx.name} className="rounded-xl border border-border bg-bg-surface/30 overflow-hidden">
                          <div className="px-4 py-2 border-b border-border bg-bg-elevated/30">
                            <h4 className="text-xs font-bold text-text-primary">{ctx.name}</h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                            <div className="p-3">
                              <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold">Vulnerable</span>
                              <pre className="mt-1 text-[11px] font-mono text-accent-red/80 overflow-x-auto">{ctx.vuln}</pre>
                            </div>
                            <div className="p-3">
                              <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold">Payload</span>
                              <pre className="mt-1 text-[11px] font-mono text-accent-green/80 overflow-x-auto">{ctx.payload}</pre>
                            </div>
                            <div className="p-3">
                              <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold">Result</span>
                              <pre className="mt-1 text-[11px] font-mono text-accent-cyan/80 overflow-x-auto">{ctx.result}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Steps */}
                  {sub.steps && (
                    <ol className="space-y-2">
                      {sub.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-text-secondary">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-bg-elevated border border-border text-[10px] font-bold text-text-muted shrink-0 mt-0.5">{i + 1}</span>
                          <code className="font-mono leading-relaxed">{step}</code>
                        </li>
                      ))}
                    </ol>
                  )}

                  {/* Tools */}
                  {sub.tools && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sub.tools.map(tool => (
                        <a
                          key={tool.name}
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg-surface/30 hover:border-accent-cyan/30 hover:bg-bg-surface-hover transition-all group"
                        >
                          <span className="text-accent-cyan text-xs mt-0.5">⚡</span>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-text-primary group-hover:text-accent-cyan transition-colors">{tool.name}</h5>
                            <p className="text-[10px] text-text-muted mt-0.5">{tool.desc}</p>
                          </div>
                          <ExternalLink className="w-3 h-3 text-text-muted/30 group-hover:text-accent-cyan shrink-0 mt-0.5 transition-colors" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Filter evasion techniques */}
                  {sub.techniques && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sub.techniques.map(tech => (
                        <div key={tech.name} className="rounded-xl border border-border bg-bg-surface/30 overflow-hidden">
                          <div className="px-3 py-2 border-b border-border bg-bg-elevated/30">
                            <h5 className="text-xs font-bold text-text-primary">{tech.name}</h5>
                          </div>
                          <pre className="p-3 text-[11px] font-mono text-accent-cyan/70 leading-relaxed overflow-x-auto whitespace-pre">{tech.code}</pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Event handlers */}
                  {sub.events && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {sub.events.map(ev => (
                        <div key={ev.category} className="rounded-xl border border-border bg-bg-surface/30 p-3">
                          <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-wider mb-2">{ev.category}</h5>
                          <div className="space-y-1">
                            {ev.items.map(item => (
                              <code key={item} className="block text-[10px] font-mono text-accent-orange/70">{item}</code>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WAF bypasses */}
                  {sub.wafs && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sub.wafs.map(waf => (
                        <div key={waf.name} className="rounded-xl border border-border bg-bg-surface/30 overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-border bg-bg-elevated/30">
                            <h5 className="text-sm font-bold text-text-primary flex items-center gap-2">
                              <span>{waf.icon}</span> {waf.name}
                            </h5>
                          </div>
                          <pre className="p-3 text-[11px] font-mono text-accent-cyan/70 leading-relaxed overflow-x-auto whitespace-pre">{waf.code}</pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CSP techniques */}
                  {sub.cspTechniques && (
                    <div className="space-y-4">
                      {sub.cspTechniques.map(tech => (
                        <div key={tech.name} className="rounded-xl border border-border bg-bg-surface/30 p-4">
                          <h5 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-1">
                            <span>{tech.icon}</span> {tech.name}
                          </h5>
                          <p className="text-xs text-text-muted mb-3">{tech.desc}</p>
                          <CodeBlock code={tech.code} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Encodings */}
                  {sub.encodings && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sub.encodings.map(enc => (
                        <div key={enc.name} className="rounded-xl border border-border bg-bg-surface/30 overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-border bg-bg-elevated/30">
                            <h5 className="text-xs font-bold text-text-primary flex items-center gap-2">
                              <span>{enc.icon}</span> {enc.name}
                            </h5>
                          </div>
                          <pre className="p-3 text-[11px] font-mono text-accent-cyan/70 leading-relaxed overflow-x-auto whitespace-pre">{enc.code}</pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Output encoding rules */}
                  {sub.rules && (
                    <div className="space-y-2">
                      {(sub.rules as { context: string; encoding: string }[]).map((rule, i) => (
                        <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-bg-surface/30 border border-border">
                          <span className="text-[10px] font-bold text-accent-purple shrink-0 w-28">{rule.context}</span>
                          <span className="text-[11px] font-mono text-text-secondary">{rule.encoding}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Code block */}
                  {sub.code && <CodeBlock code={sub.code} label={sub.title} />}

                  {/* Resource links */}
                  {sub.links && (
                    <div className="space-y-2">
                      {sub.links.map(link => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg-surface/30 hover:border-accent-green/30 hover:bg-bg-surface-hover transition-all group"
                        >
                          <div>
                            <span className="text-sm text-text-secondary group-hover:text-accent-green transition-colors font-medium">{link.name}</span>
                            {link.desc && <p className="text-[10px] text-text-muted mt-0.5">{link.desc}</p>}
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-green transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="p-8 rounded-2xl border border-border bg-bg-surface/30 text-center">
          <h3 className="text-lg font-bold text-text-primary mb-2">Ready to practice?</h3>
          <p className="text-sm text-text-secondary mb-5 max-w-md mx-auto">
            Test your knowledge with real XSS payloads in a safe sandbox environment.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/payloads" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-bold text-sm hover:opacity-90 transition-opacity">
              Browse Payloads
            </Link>
            <Link href="/playground" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text-primary font-medium text-sm hover:border-accent-green/30 hover:text-accent-green transition-all">
              DOM Playground
            </Link>
            <Link href="/generator" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text-primary font-medium text-sm hover:border-accent-cyan/30 hover:text-accent-cyan transition-all">
              Payload Generator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
