// ============================================================
// Vex — Cross the line.
// PayloadTester — Sandboxed browser-style preview for payloads
// ============================================================

'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Play, Square, AlertTriangle, ChevronLeft, ChevronRight,
  Lock, RefreshCw, Eye, Shield,
} from 'lucide-react';

interface PayloadTesterProps {
  payload: string;
}

export default function PayloadTester({ payload }: PayloadTesterProps) {
  const [running, setRunning] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Build the srcdoc HTML for the iframe
  const srcdoc = useMemo(() => {
    if (!running) return '';
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #fafafa;
      color: #333;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      padding: 16px 20px;
      line-height: 1.6;
    }
    .xss-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.35);
      color: #00cc6a;
      padding: 6px 14px;
      border-radius: 8px;
      margin: 6px 4px;
      font-size: 13px;
      font-family: 'SF Mono', 'JetBrains Mono', monospace;
      font-weight: 500;
    }
    .xss-badge::before {
      content: "✓";
      font-weight: bold;
      color: #00ff88;
    }
  </style>
  <script>
    window.alert = function(msg) {
      var el = document.createElement('span');
      el.className = 'xss-badge';
      el.textContent = 'alert(' + msg + ')';
      document.body.appendChild(el);
    };
    window.confirm = function(msg) { window.alert(msg); return true; };
    window.prompt = function(msg) { window.alert(msg); return 'xss'; };
  </script>
</head>
<body>${payload}</body>
</html>`;
  }, [running, payload]);

  const handleRun = useCallback(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setRunning(true);
  }, [confirmed]);

  const handleStop = useCallback(() => {
    setRunning(false);
    setConfirmed(false);
  }, []);

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-bg-primary">
      {/* ── Browser Chrome ── */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1c1c1e] border-b border-border">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-[6px]">
            <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57] border border-[#e0443e]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e] border border-[#dea123]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>
          {/* Tab */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-bg-surface/40 text-[11px] text-text-secondary">
            <Eye className="w-2.5 h-2.5" />
            Sandbox
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {running ? (
            <button
              onClick={handleStop}
              aria-label="Stop payload execution"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-accent-red/15 text-accent-red hover:bg-accent-red/25 transition-all"
            >
              <Square className="w-2.5 h-2.5" /> Stop
            </button>
          ) : (
            <button
              onClick={handleRun}
              aria-label={confirmed ? 'Confirm payload execution' : 'Run payload in sandbox'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                confirmed
                  ? 'bg-accent-orange/15 text-accent-orange hover:bg-accent-orange/25 animate-pulse'
                  : 'bg-accent-green/15 text-accent-green hover:bg-accent-green/25'
              }`}
            >
              <Play className="w-2.5 h-2.5" />
              {confirmed ? 'Confirm Run' : 'Run'}
            </button>
          )}
        </div>
      </div>

      {/* ── URL Bar ── */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2c2c2e] border-b border-border">
        <div className="flex items-center gap-0.5">
          <button className="p-0.5 rounded text-text-muted/25" disabled><ChevronLeft className="w-3 h-3" /></button>
          <button className="p-0.5 rounded text-text-muted/25" disabled><ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bg-surface/40 border border-border/30">
          <Lock className="w-2.5 h-2.5 text-accent-green/50" />
          <span className="text-[10px] font-mono text-text-muted truncate">
            vex.local/sandbox/{running ? 'running' : 'idle'}
          </span>
        </div>
        <button
          onClick={running ? handleStop : handleRun}
          className="p-1 rounded text-text-muted/40 hover:text-text-muted transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* ── Warning ── */}
      {confirmed && !running && (
        <div className="flex items-start gap-2 px-3.5 py-2.5 bg-accent-orange/5 border-b border-accent-orange/15">
          <AlertTriangle className="w-3.5 h-3.5 text-accent-orange shrink-0 mt-0.5" />
          <p className="text-[11px] text-accent-orange/80 leading-relaxed">
            This will render the payload in a sandboxed iframe. Only run payloads you understand. Click &quot;Confirm Run&quot; to proceed.
          </p>
        </div>
      )}

      {/* ── Browser Content ── */}
      <div className="relative">
        {running ? (
          <iframe
            srcDoc={srcdoc}
            sandbox="allow-scripts"
            title="Payload tester sandbox"
            className="w-full border-0 bg-white"
            style={{ height: '180px' }}
          />
        ) : (
          <div className="h-[140px] flex flex-col items-center justify-center bg-bg-primary/50">
            <Shield className="w-6 h-6 text-text-muted/15 mb-2" />
            <span className="text-[11px] text-text-muted/40 font-mono">
              Click Run → Confirm Run to execute
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
