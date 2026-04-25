// ============================================================
// Vex — Cross the line.
// Terminal — Expanding typewriter with 3D mouse-tilt effect
// ============================================================

'use client';

import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TERMINAL_COMMANDS } from '@/lib/constants';

interface TerminalLine {
  type: 'prompt' | 'response';
  text: string;
}

type Phase = 'typing' | 'response' | 'pause';

interface TerminalState {
  lines: TerminalLine[];
  currentCmd: number;
  typingText: string;
  phase: Phase;
}

type Action =
  | { type: 'TYPE_CHAR'; cmd: string }
  | { type: 'FINISH_TYPING'; cmd: string }
  | { type: 'SHOW_RESPONSE'; responseLines: string[] }
  | { type: 'ADVANCE' };

function reducer(state: TerminalState, action: Action): TerminalState {
  switch (action.type) {
    case 'TYPE_CHAR':
      return {
        ...state,
        typingText: action.cmd.slice(0, state.typingText.length + 1),
      };
    case 'FINISH_TYPING':
      return {
        ...state,
        lines: [
          ...state.lines.slice(-12),
          { type: 'prompt', text: action.cmd },
        ],
        typingText: '',
        phase: 'response',
      };
    case 'SHOW_RESPONSE':
      return {
        ...state,
        lines: [
          ...state.lines,
          ...action.responseLines.map((text) => ({
            type: 'response' as const,
            text,
          })),
        ],
        phase: 'pause',
      };
    case 'ADVANCE':
      return {
        ...state,
        currentCmd: (state.currentCmd + 1) % TERMINAL_COMMANDS.length,
        typingText: '',
        phase: 'typing',
      };
    default:
      return state;
  }
}

const initialState: TerminalState = {
  lines: [],
  currentCmd: 0,
  typingText: '',
  phase: 'typing',
};

export default function Terminal() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 3D tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { lines, currentCmd, typingText, phase } = state;

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, typingText]);

  const advanceToNext = useCallback(() => {
    dispatch({ type: 'ADVANCE' });
  }, []);

  // Typing effect
  useEffect(() => {
    if (phase !== 'typing') return;

    const cmd = TERMINAL_COMMANDS[currentCmd].cmd;
    if (typingText.length < cmd.length) {
      const timer = setTimeout(() => {
        dispatch({ type: 'TYPE_CHAR', cmd });
      }, 60 + Math.random() * 30);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'FINISH_TYPING', cmd });
    }, 100);
    return () => clearTimeout(timer);
  }, [phase, typingText, currentCmd]);

  // Response phase
  useEffect(() => {
    if (phase !== 'response') return;

    const response = TERMINAL_COMMANDS[currentCmd].response;
    const responseLines = response.split('\\n');

    const timer = setTimeout(() => {
      dispatch({ type: 'SHOW_RESPONSE', responseLines });
    }, 300);

    return () => clearTimeout(timer);
  }, [phase, currentCmd]);

  // Pause then advance
  useEffect(() => {
    if (phase !== 'pause') return;
    const timer = setTimeout(advanceToNext, 2500);
    return () => clearTimeout(timer);
  }, [phase, advanceToNext]);

  // Mouse tilt handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setTilt({ x: y * -8, y: x * 8 }); // rotateX from Y offset, rotateY from X offset
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  // Dynamic height: min 200px, grows with content
  const lineCount = lines.length + (phase === 'typing' || phase === 'pause' ? 1 : 0);
  const dynamicHeight = Math.max(200, Math.min(420, 80 + lineCount * 24));

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-2xl mx-auto"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
        className="rounded-xl border border-accent-green/20 bg-bg-primary/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `0 25px 60px rgba(0,0,0,0.5), 0 0 40px var(--color-accent-green-glow), 0 0 80px var(--color-accent-green-glow), inset 0 1px 0 rgba(255,255,255,0.05)`
            : `0 20px 40px rgba(0,0,0,0.4), 0 0 20px var(--color-accent-green-glow)`,
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg-surface/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-accent-red/80" />
            <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
            <div className="w-3 h-3 rounded-full bg-accent-green/80" />
          </div>
          <span className="text-[11px] font-mono text-text-muted ml-2">
            vex@security:~
          </span>
        </div>

        {/* Terminal content — expands with output */}
        <motion.div
          ref={containerRef}
          animate={{ height: dynamicHeight }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="p-4 font-mono text-[13px] leading-relaxed overflow-hidden"
        >
          {/* Rendered lines */}
          <AnimatePresence mode="popLayout">
            {lines.map((line, i) => (
              <motion.div
                key={`${i}-${line.text.slice(0, 20)}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  line.type === 'prompt'
                    ? 'text-text-primary'
                    : 'text-accent-green/80'
                }
              >
                {line.type === 'prompt' && (
                  <span className="text-accent-cyan mr-2">❯</span>
                )}
                {line.type === 'response' && (
                  <span className="text-text-muted mr-2">  </span>
                )}
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Currently typing line */}
          {phase === 'typing' && (
            <div className="text-text-primary">
              <span className="text-accent-cyan mr-2">❯</span>
              {typingText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block w-2 h-4 bg-accent-green ml-0.5 align-text-bottom"
              />
            </div>
          )}

          {/* Idle cursor */}
          {phase === 'pause' && (
            <div className="text-text-primary">
              <span className="text-accent-cyan mr-2">❯</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block w-2 h-4 bg-accent-green ml-0.5 align-text-bottom"
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
