// ============================================================
// Vex — Cross the line.
// PlaygroundClient — Live DOM Viewer with editor + browser chrome
// Ported from original play.html with full browser window UI
// ============================================================

'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Play, RotateCcw, Code, Eye, Copy, Check, Trash2,
  ChevronLeft, ChevronRight, Lock, Share2, RefreshCw,
  AlertTriangle, FileCode, Terminal, Maximize2, Minimize2,
  Network,
} from 'lucide-react';

// ── Presets ──
const PRESETS = [
  {
    name: 'Vulnerable Search',
    icon: '🔍',
    desc: 'innerHTML sink via search input',
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: system-ui, sans-serif; background: #fafafa; color: #333; padding: 24px; }
  h1 { color: #1a1a1a; margin-bottom: 8px; }
  p { color: #666; margin-bottom: 16px; }
  .search-box { padding: 10px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; width: 100%; max-width: 400px; outline: none; }
  .search-box:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
  .result { margin-top: 16px; padding: 16px; background: #fff; border: 1px solid #eee; border-radius: 8px; min-height: 40px; }
</style>
</head>
<body>
  <h1>Search Page</h1>
  <p>Try entering XSS payloads in the search box below:</p>
  <input class="search-box" id="search" placeholder="Search..." oninput="document.getElementById('output').innerHTML = 'Results for: ' + this.value">
  <div class="result" id="output">Results will appear here...</div>
</body>
</html>`,
  },
  {
    name: 'InnerHTML Sink',
    icon: '💉',
    desc: 'Direct innerHTML assignment',
    code: `<!DOCTYPE html>
<html><body style="font-family:system-ui;padding:24px;background:#fafafa;color:#333">
<h2 style="margin-bottom:8px">InnerHTML Sink Demo</h2>
<p style="color:#666;margin-bottom:16px">Type your payload below — it will be rendered via innerHTML:</p>
<textarea id="input" rows="3" style="width:100%;max-width:500px;padding:12px;border:1px solid #ddd;border-radius:8px;font-family:monospace;font-size:13px;resize:vertical;outline:none" placeholder="<img src=x onerror=alert('XSS')>"></textarea>
<button onclick="document.getElementById('out').innerHTML=document.getElementById('input').value" style="display:block;margin:12px 0;padding:10px 24px;background:#4f46e5;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px">Render</button>
<div id="out" style="padding:16px;background:#fff;border:1px solid #eee;border-radius:8px;min-height:60px">Output appears here...</div>
</body></html>`,
  },
  {
    name: 'Eval Sink',
    icon: '⚡',
    desc: 'JavaScript eval() execution',
    code: `<!DOCTYPE html>
<html><body style="font-family:monospace;padding:24px;background:#1a1a2e;color:#00ff88">
<h2 style="color:#00ff88;margin-bottom:8px">JavaScript Eval Console</h2>
<p style="color:#888;margin-bottom:16px;font-size:13px">Enter JavaScript to execute via eval():</p>
<div style="display:flex;gap:8px;max-width:500px">
  <input id="cmd" style="flex:1;padding:10px 12px;background:#0d0d1a;border:1px solid #333;border-radius:8px;color:#00ff88;font-family:monospace;font-size:13px;outline:none" placeholder="alert('XSS')">
  <button onclick="try{eval(document.getElementById('cmd').value)}catch(e){document.getElementById('res').textContent='Error: '+e.message}" style="padding:10px 20px;background:#00ff88;color:#000;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-family:monospace;white-space:nowrap">▶ Run</button>
</div>
<pre id="res" style="margin-top:12px;padding:16px;background:#0d0d1a;border:1px solid #333;border-radius:8px;min-height:60px;color:#ccc;font-size:13px">Waiting for input...</pre>
</body></html>`,
  },
  {
    name: 'DOM Clobbering',
    icon: '🌐',
    desc: 'URL hash → innerHTML sink',
    code: `<!DOCTYPE html>
<html><body style="font-family:system-ui;padding:24px;background:#fafafa;color:#333">
<h2 style="margin-bottom:8px">URL Hash Sink</h2>
<p style="color:#666;margin-bottom:16px">This page reads from location.hash and renders via innerHTML:</p>
<div id="content" style="padding:16px;background:#fff;border:1px solid #eee;border-radius:8px;min-height:60px"></div>
<script>
var hash = location.hash.substring(1);
if (hash) {
  document.getElementById('content').innerHTML = decodeURIComponent(hash);
} else {
  document.getElementById('content').innerHTML = '<em style="color:#999">Add a #payload to the URL hash to test</em>';
}
</script>
</body></html>`,
  },
  {
    name: 'Form Hijack',
    icon: '📝',
    desc: 'Login form credential theft',
    code: `<!DOCTYPE html>
<html><body style="font-family:system-ui;padding:24px;background:#fafafa;color:#333">
<div style="max-width:360px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
  <h2 style="text-align:center;margin-bottom:4px">Sign In</h2>
  <p style="text-align:center;color:#999;font-size:13px;margin-bottom:24px">Enter your credentials</p>
  <form onsubmit="alert('Credentials: ' + this.user.value + ':' + this.pass.value); return false;">
    <input name="user" placeholder="Username" style="width:100%;padding:10px 12px;margin-bottom:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box">
    <input name="pass" type="password" placeholder="Password" style="width:100%;padding:10px 12px;margin-bottom:16px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box">
    <button type="submit" style="width:100%;padding:12px;background:#4f46e5;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">Login</button>
  </form>
</div>
</body></html>`,
  },
];

const DEFAULT_CODE = PRESETS[0].code;
// ── Onboarding steps ──
const ONBOARD_STEPS = [
  { icon: '👋', title: 'Welcome to the Playground!', desc: 'This is a safe sandbox where you can write HTML/JS code and see it rendered live — perfect for learning XSS techniques.' },
  { icon: '📝', title: 'Write Code (Left Panel)', desc: 'Type or paste HTML in the editor on the left. You can use the preset buttons above to load example vulnerable pages.' },
  { icon: '👁️', title: 'Live Preview (Right Panel)', desc: 'Your code is rendered instantly in the browser preview. alert(), confirm(), and prompt() are intercepted safely.' },
  { icon: '🎯', title: 'Try a Preset', desc: 'Click any preset button (e.g., "Vulnerable Search") to load a demo page, then try injecting <img src=x onerror=alert(1)> in its input fields.' },
  { icon: '🎨', title: 'Customize Your View', desc: 'Switch between Split/Editor/Preview layouts. Use the theme toggle in the navbar to change site colors. Toggle Live or Manual rendering mode.' },
];

export default function PlaygroundClient() {
  const [html, setHtml] = useState(DEFAULT_CODE);
  const [autoRender, setAutoRender] = useState(true);
  const [manualRender, setManualRender] = useState(0);
  const [copied, setCopied] = useState(false);
  const [layout, setLayout] = useState<'split' | 'editor' | 'preview'>('split');
  const [lineCount, setLineCount] = useState(1);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  // Show guide on first visit
  useEffect(() => {
    const seen = localStorage.getItem('vex-playground-onboarded');
    if (!seen) setShowGuide(true);
  }, []);

  const dismissGuide = useCallback(() => {
    setShowGuide(false);
    localStorage.setItem('vex-playground-onboarded', '1');
  }, []);

  // Count lines
  useEffect(() => {
    setLineCount(html.split('\n').length);
  }, [html]);

  // Sync scroll between line numbers and textarea
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Build srcdoc with interceptors
  const srcdoc = useMemo(() => {
    const interceptScript = `<script>
window.alert = function(m) {
  var e = document.createElement('div');
  e.style.cssText = 'display:inline-block;background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.35);color:#00ff88;padding:6px 14px;border-radius:6px;margin:6px 4px;font-family:monospace;font-size:13px;backdrop-filter:blur(4px)';
  e.textContent = '\\u2713 alert(' + m + ')';
  document.body.appendChild(e);
};
window.confirm = function(m) { window.alert(m); return true; };
window.prompt = function(m) { window.alert(m); return 'xss'; };
</` + 'script>';
    if (html.includes('</head>')) {
      return html.replace('</head>', interceptScript + '</head>');
    }
    return interceptScript + html;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRender ? html : manualRender, html]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  const handleClear = useCallback(() => {
    setHtml('');
    textareaRef.current?.focus();
  }, []);

  const loadPreset = useCallback((code: string) => {
    setHtml(code);
    if (!autoRender) setManualRender(p => p + 1);
  }, [autoRender]);

  const handleManualRun = useCallback(() => {
    setManualRender(p => p + 1);
  }, []);

  return (
    <div className="space-y-5">
      {/* ── Onboarding Guide Modal ── */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-bg-primary shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border bg-bg-elevated/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <span className="text-2xl">{ONBOARD_STEPS[guideStep].icon}</span>
                  {ONBOARD_STEPS[guideStep].title}
                </h2>
                <button onClick={dismissGuide} className="text-text-muted hover:text-text-primary transition-colors text-xs">
                  Skip
                </button>
              </div>
              {/* Step dots */}
              <div className="flex gap-1.5 mt-3">
                {ONBOARD_STEPS.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full flex-1 transition-all ${i <= guideStep ? 'bg-accent-green' : 'bg-border'}`} />
                ))}
              </div>
            </div>
            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-sm text-text-secondary leading-relaxed">{ONBOARD_STEPS[guideStep].desc}</p>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-bg-elevated/30">
              <span className="text-[10px] text-text-muted">{guideStep + 1} / {ONBOARD_STEPS.length}</span>
              <div className="flex gap-2">
                {guideStep > 0 && (
                  <button onClick={() => setGuideStep(s => s - 1)} className="px-4 py-2 rounded-lg text-xs font-medium text-text-secondary border border-border hover:bg-bg-surface transition-all">
                    Back
                  </button>
                )}
                {guideStep < ONBOARD_STEPS.length - 1 ? (
                  <button onClick={() => setGuideStep(s => s + 1)} className="px-4 py-2 rounded-lg text-xs font-bold bg-accent-green text-bg-primary hover:opacity-90 transition-all">
                    Next
                  </button>
                ) : (
                  <button onClick={dismissGuide} className="px-4 py-2 rounded-lg text-xs font-bold bg-accent-green text-bg-primary hover:opacity-90 transition-all">
                    Get Started 🚀
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Help Button ── */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => { setGuideStep(0); setShowGuide(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
        >
          <AlertTriangle className="w-3 h-3" /> How to Use
        </button>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => loadPreset(p.code)}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border border-border bg-bg-elevated/50 text-text-secondary hover:border-accent-green/30 hover:text-accent-green hover:bg-accent-green/5 hover:shadow-[0_0_15px_var(--color-accent-green-glow)] transition-all"
          >
            <span className="text-sm">{p.icon}</span>
            <div className="text-left">
              <div>{p.name}</div>
              <div className="text-[10px] text-text-muted group-hover:text-accent-green/60 transition-colors">{p.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main editor/browser layout */}
      <div className={`grid gap-0 rounded-2xl border border-border overflow-hidden bg-bg-primary ${
        layout === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>

        {/* ── Code Editor Panel ── */}
        {layout !== 'preview' && (
          <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-border">
            {/* Editor header */}
            <div className="flex items-center justify-between px-3 py-2 bg-bg-elevated/80 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bg-surface border border-border text-xs font-medium text-text-secondary">
                  <FileCode className="w-3 h-3 text-accent-cyan" />
                  index.html
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-surface transition-all"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-md text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all"
                  title="Clear"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editor body with line numbers */}
            <div className="flex flex-1 min-h-[420px] max-h-[600px] bg-bg-primary">
              {/* Line numbers */}
              <div
                ref={lineNumRef}
                className="flex flex-col items-end px-3 py-3 bg-bg-elevated/40 text-text-muted/40 text-[11px] font-mono leading-[1.65] select-none overflow-hidden border-r border-border/50 min-w-[40px]"
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={html}
                onChange={e => setHtml(e.target.value)}
                onScroll={handleScroll}
                className="flex-1 px-3 py-3 bg-transparent text-accent-cyan/90 font-mono text-[12.5px] leading-[1.65] resize-none focus:outline-none placeholder:text-text-muted/20 min-h-full"
                spellCheck={false}
                placeholder="Type your HTML here..."
              />
            </div>

            {/* Editor footer */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-bg-elevated/50 border-t border-border text-[10px]">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRender}
                    onChange={e => setAutoRender(e.target.checked)}
                    className="w-3 h-3 rounded accent-accent-green"
                  />
                  <span className="flex items-center gap-1 text-text-muted">
                    <span className={`w-1.5 h-1.5 rounded-full ${autoRender ? 'bg-accent-green animate-pulse' : 'bg-text-muted/30'}`} />
                    {autoRender ? 'Live' : 'Manual'}
                  </span>
                </label>
                {!autoRender && (
                  <button
                    onClick={handleManualRun}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent-green/10 text-accent-green hover:bg-accent-green/20 transition-all font-medium"
                  >
                    <Play className="w-2.5 h-2.5" /> Render
                  </button>
                )}
              </div>
              <span className="text-text-muted font-mono">{html.length} chars · {lineCount} lines</span>
            </div>
          </div>
        )}

        {/* ── Browser Preview Panel ── */}
        {layout !== 'editor' && (
          <div className="flex flex-col">
            {/* Browser chrome - traffic lights + tabs */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#1c1c1e] border-b border-border">
              <div className="flex items-center gap-4">
                {/* Traffic lights */}
                <div className="flex items-center gap-[6px]">
                  <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                  <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e] border border-[#dea123]" />
                  <span className="w-[11px] h-[11px] rounded-full bg-[#28c840] border border-[#1aab29]" />
                </div>
                {/* Tab */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-surface/50 text-xs text-text-secondary">
                  <Eye className="w-3 h-3" />
                  Preview
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLayout(layout === 'split' ? 'preview' : 'split')}
                  className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
                  title={layout === 'preview' ? 'Show editor' : 'Full preview'}
                >
                  {layout === 'preview' ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* URL bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2c2c2e] border-b border-border">
              <div className="flex items-center gap-0.5">
                <button className="p-1 rounded text-text-muted/30" disabled><ChevronLeft className="w-3 h-3" /></button>
                <button className="p-1 rounded text-text-muted/30" disabled><ChevronRight className="w-3 h-3" /></button>
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-md bg-bg-surface/60 border border-border/50">
                <Lock className="w-2.5 h-2.5 text-accent-green/60" />
                <span className="text-[11px] font-mono text-text-muted">vex.local/playground/preview</span>
              </div>
              <button
                onClick={handleManualRun}
                className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Browser content - iframe */}
            <div className="flex-1 min-h-[420px] max-h-[600px] bg-white">
              <iframe
                srcDoc={srcdoc}
                sandbox="allow-scripts allow-forms"
                title="Live DOM preview"
                className="w-full h-full border-0"
                style={{ minHeight: '420px' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Layout toggle + safety notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Layout buttons */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-elevated border border-border">
          {(['split', 'editor', 'preview'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                layout === l
                  ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {l === 'split' && <><Code className="w-3 h-3" /> Split</>}
              {l === 'editor' && <><Terminal className="w-3 h-3" /> Editor</>}
              {l === 'preview' && <><Eye className="w-3 h-3" /> Preview</>}
            </button>
          ))}
        </div>

        {/* Safety notice */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <AlertTriangle className="w-3.5 h-3.5 text-accent-orange" />
          <span>Sandboxed execution · alert/confirm/prompt intercepted · For educational use only</span>
        </div>
      </div>
    </div>
  );
}
