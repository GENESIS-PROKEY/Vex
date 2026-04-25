// ============================================================
// Vex — Cross the line.
// PayloadCode — Shiki-powered syntax highlighted payload display
// ============================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { highlightPayload, detectPayloadLang } from '@/lib/syntax-highlight';
import { truncate } from '@/lib/utils';

interface PayloadCodeProps {
  code: string;
  maxLength?: number;
  className?: string;
}

export default function PayloadCode({
  code,
  maxLength = 200,
  className = '',
}: PayloadCodeProps) {
  const [html, setHtml] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCode = maxLength ? truncate(code, maxLength) : code;

  useEffect(() => {
    let cancelled = false;

    const lang = detectPayloadLang(code);
    highlightPayload(displayCode, lang).then((result) => {
      if (!cancelled) setHtml(result);
    });

    return () => {
      cancelled = true;
    };
  }, [code, displayCode]);

  // Fallback while Shiki loads
  if (!html) {
    return (
      <pre
        className={`text-[13px] font-mono text-accent-cyan leading-relaxed whitespace-pre-wrap break-all select-all ${className}`}
      >
        {displayCode}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`payload-code text-[13px] font-mono leading-relaxed whitespace-pre-wrap break-all select-all [&_.shiki]:!bg-transparent [&_pre]:!bg-transparent [&_code]:!bg-transparent ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
