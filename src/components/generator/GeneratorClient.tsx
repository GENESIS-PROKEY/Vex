// ============================================================
// Vex — Cross the line.
// Payload Generator — Context-aware XSS payload generation
// ============================================================

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Wand2, Download, Copy, Check, RefreshCw, AlertTriangle, Zap, Shield, Hash } from 'lucide-react';
import { ALL_PAYLOADS } from '@/data/payloads';
import type { Payload } from '@/types';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import PayloadCode from '@/components/payload/PayloadCode';

// ── Types ──
interface Restrictions {
  noAngles: boolean;
  noQuotes: boolean;
  noParens: boolean;
  noSlash: boolean;
  noSemicolon: boolean;
  lengthLimit: boolean;
  maxLength: number;
}

interface GeneratedPayload {
  code: string;
  original: Payload;
  effectiveness: number;
  context: string;
  waf: string;
}

const CONTEXTS = [
  { value: 'html', label: 'HTML Context' },
  { value: 'javascript', label: 'JavaScript Context' },
  { value: 'css', label: 'CSS Context' },
  { value: 'url', label: 'URL Parameter' },
  { value: 'attribute', label: 'HTML Attribute' },
  { value: 'dom', label: 'DOM Context' },
];

const WAFS = [
  { value: 'none', label: 'No WAF' },
  { value: 'cloudflare', label: 'Cloudflare' },
  { value: 'aws', label: 'AWS WAF' },
  { value: 'akamai', label: 'Akamai' },
  { value: 'modsecurity', label: 'ModSecurity' },
  { value: 'f5', label: 'F5 ASM' },
];

const RESTRICTION_OPTIONS = [
  { id: 'noAngles', label: 'No < > brackets' },
  { id: 'noQuotes', label: 'No quotes (\' ")' },
  { id: 'noParens', label: 'No parentheses ( )' },
  { id: 'noSlash', label: 'No forward slash /' },
  { id: 'noSemicolon', label: 'No semicolon ;' },
];

// ── WAF bypass maps ──
const WAF_BYPASSES: Record<string, Record<string, string>> = {
  cloudflare: { 'script': 'ſcript', 'alert': '\u0061lert', 'onerror': 'on\u0065rror', 'javascript': 'java\u0073cript' },
  aws: { '<script>': '<ſcript>', 'javascript:': 'data:text/html,<script>', 'eval': 'setTimeout' },
  akamai: { 'script': 'SCRIPT', 'src=': 'src =', 'onerror': 'oN\u0065rror' },
  modsecurity: { 'script': 'scr<>ipt', 'alert': 'confirm' },
  f5: { '<': '%3C', '>': '%3E', 'script': 'ſcript' },
};

// ── Helper functions ──
function matchesContext(payload: Payload, context: string): boolean {
  const contextMap: Record<string, string[]> = {
    html: ['html', 'tag', 'element'],
    javascript: ['script', 'js', 'javascript'],
    css: ['css', 'style'],
    url: ['url', 'parameter', 'query'],
    attribute: ['attribute', 'attr'],
    dom: ['dom', 'javascript'],
  };
  const tags = contextMap[context] || [];
  return tags.some(t => payload.tags.some(pt => pt.toLowerCase().includes(t)))
    || payload.payload.toLowerCase().includes(context);
}

function passesRestrictions(code: string, r: Restrictions): boolean {
  if (r.noAngles && (code.includes('<') || code.includes('>'))) return false;
  if (r.noQuotes && (code.includes('"') || code.includes("'"))) return false;
  if (r.noParens && (code.includes('(') || code.includes(')'))) return false;
  if (r.noSlash && code.includes('/')) return false;
  if (r.noSemicolon && code.includes(';')) return false;
  if (r.lengthLimit && code.length > r.maxLength) return false;
  return true;
}

function applyWAFBypass(code: string, waf: string): string {
  if (waf === 'none' || !WAF_BYPASSES[waf]) return code;
  let result = code;
  for (const [orig, repl] of Object.entries(WAF_BYPASSES[waf])) {
    result = result.replace(new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), repl);
  }
  return result;
}

function applyRestrictionBypass(code: string, r: Restrictions): string {
  let m = code;
  if (r.noParens) m = m.replace(/alert\([^)]*\)/gi, 'alert`1`').replace(/confirm\([^)]*\)/gi, 'confirm`1`').replace(/prompt\([^)]*\)/gi, 'prompt`1`');
  if (r.noSemicolon) m = m.replace(/;/g, '');
  return m;
}

function calcEffectiveness(waf: string, r: Restrictions): number {
  let e = 90;
  const wafPen: Record<string, number> = { none: 0, cloudflare: -10, aws: -8, akamai: -12, modsecurity: -15, f5: -10 };
  e += wafPen[waf] || 0;
  if (r.noAngles) e -= 15;
  if (r.noQuotes) e -= 10;
  if (r.noParens) e -= 8;
  if (r.noSlash) e -= 5;
  if (r.noSemicolon) e -= 3;
  if (r.lengthLimit) e -= 10;
  return Math.max(30, e);
}

// ── Component ──
export default function GeneratorClient() {
  const [context, setContext] = useState('html');
  const [waf, setWaf] = useState('none');
  const [restrictions, setRestrictions] = useState<Restrictions>({
    noAngles: false, noQuotes: false, noParens: false,
    noSlash: false, noSemicolon: false, lengthLimit: false, maxLength: 100,
  });
  const [results, setResults] = useState<GeneratedPayload[]>([]);
  const [history, setHistory] = useState<GeneratedPayload[]>([]);
  const [error, setError] = useState('');
  const { copiedId, copy } = useCopyToClipboard();

  const toggleRestriction = useCallback((key: keyof Restrictions) => {
    setRestrictions(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const generate = useCallback(() => {
    setError('');

    // Filter payloads by context + restrictions
    let filtered = ALL_PAYLOADS.filter(p =>
      matchesContext(p, context) && passesRestrictions(p.payload, restrictions)
    );

    if (filtered.length === 0) {
      // Fallback: relax context match
      filtered = ALL_PAYLOADS.filter(p => passesRestrictions(p.payload, restrictions));
    }

    if (filtered.length === 0) {
      setError('No payloads match these restrictions. Try relaxing some constraints.');
      setResults([]);
      return;
    }

    // Pick 5 random
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const generated: GeneratedPayload[] = [];
    for (const p of selected) {
      let code = applyWAFBypass(p.payload, waf);
      code = applyRestrictionBypass(code, restrictions);
      if (passesRestrictions(code, restrictions)) {
        generated.push({
          code,
          original: p,
          effectiveness: calcEffectiveness(waf, restrictions),
          context,
          waf,
        });
      }
    }

    if (generated.length === 0) {
      setError('No payloads passed restrictions after transformation. Try relaxing constraints.');
      setResults([]);
      return;
    }

    setResults(generated);
    setHistory(prev => [...generated, ...prev].slice(0, 50));
  }, [context, waf, restrictions]);

  const exportPayloads = useCallback(() => {
    if (results.length === 0) return;
    const text = results.map(r => r.code).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vex-payloads-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const effColor = useMemo(() => {
    if (results.length === 0) return '#555';
    const e = results[0]?.effectiveness || 0;
    return e > 70 ? '#00ff88' : e > 50 ? '#ff8800' : '#ff3366';
  }, [results]);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Inputs */}
        <div className="lg:col-span-1 space-y-5">
          {/* Context */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Injection Context
            </label>
            <select
              value={context}
              onChange={e => setContext(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green/30"
            >
              {CONTEXTS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* WAF */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              WAF Type
            </label>
            <select
              value={waf}
              onChange={e => setWaf(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green/30"
            >
              {WAFS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
            </select>
          </div>

          {/* Restrictions */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Character Restrictions
            </label>
            <div className="space-y-2">
              {RESTRICTION_OPTIONS.map(opt => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={restrictions[opt.id as keyof Restrictions] as boolean}
                    onChange={() => toggleRestriction(opt.id as keyof Restrictions)}
                    className="w-4 h-4 rounded border-border bg-bg-elevated text-accent-green focus:ring-accent-green/30 accent-accent-green"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {opt.label}
                  </span>
                </label>
              ))}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={restrictions.lengthLimit}
                  onChange={() => toggleRestriction('lengthLimit')}
                  className="w-4 h-4 rounded border-border bg-bg-elevated text-accent-green focus:ring-accent-green/30 accent-accent-green"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  Length limit
                </span>
              </label>
              {restrictions.lengthLimit && (
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={restrictions.maxLength}
                  onChange={e => setRestrictions(prev => ({ ...prev, maxLength: parseInt(e.target.value) || 100 }))}
                  className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                  placeholder="Max characters"
                />
              )}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Wand2 className="w-4 h-4" />
            Generate Payloads
          </button>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-bg-surface/50 overflow-hidden">
            {/* Output header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-elevated/50">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-accent-green" />
                <span className="text-sm font-medium text-text-secondary">
                  Generated Payloads
                  {results.length > 0 && <span className="text-accent-green ml-1">({results.length})</span>}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {results.length > 0 && (
                  <>
                    <button
                      onClick={exportPayloads}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-text-secondary hover:text-accent-green hover:bg-accent-green/10 transition-all"
                    >
                      <Download className="w-3 h-3" /> Export
                    </button>
                    <button
                      onClick={generate}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all"
                    >
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="divide-y divide-border">
              {error && (
                <div className="flex items-center gap-2 px-4 py-6 text-sm text-accent-red">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </div>
              )}

              {results.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Wand2 className="w-8 h-8 text-text-muted/30 mb-3" />
                  <p className="text-sm text-text-muted">
                    Configure options and click &quot;Generate Payloads&quot;
                  </p>
                </div>
              )}

              {results.map((r, i) => (
                <div key={i} className="p-4 hover:bg-bg-surface-hover/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-accent-green/10 text-accent-green border border-accent-green/20">
                        {r.original.category}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">
                        #{i + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono" style={{ color: effColor }}>
                        {r.effectiveness}% effective
                      </span>
                      <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                        <Hash className="w-2.5 h-2.5" />
                        {r.code.length} chars
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); copy(r.code, `gen-${i}`); }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          copiedId === `gen-${i}` ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' : 'bg-bg-elevated text-text-secondary border border-border hover:text-accent-green hover:border-accent-green/30'
                        }`}
                        aria-label="Copy payload"
                      >
                        {copiedId === `gen-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedId === `gen-${i}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <PayloadCode code={r.code} maxLength={0} />
                  <p className="mt-1.5 text-xs text-text-muted truncate">
                    {r.original.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-bg-surface/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-accent-green" />
            <h3 className="text-sm font-semibold text-text-primary">Context Matters</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Choose the correct injection context for maximum effectiveness
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-bg-surface/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-accent-orange" />
            <h3 className="text-sm font-semibold text-text-primary">Test Responsibly</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Only use generated payloads on systems you own or have permission to test
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-bg-surface/30">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-accent-cyan" />
            <h3 className="text-sm font-semibold text-text-primary">Export & Document</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Export payloads to save and document findings for your reports
          </p>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-surface/30 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <h3 className="text-sm font-semibold text-text-secondary">
              Generation History ({history.length})
            </h3>
          </div>
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {history.slice(0, 15).map((h, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 hover:bg-bg-surface-hover/30 transition-colors">
                <code className="text-xs font-mono text-text-secondary truncate flex-1 mr-4">
                  {h.code}
                </code>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-text-muted">{h.context}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); copy(h.code, `hist-${i}`); }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                      copiedId === `hist-${i}` ? 'text-accent-green' : 'text-text-muted hover:text-accent-green'
                    }`}
                    aria-label="Copy"
                  >
                    {copiedId === `hist-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
