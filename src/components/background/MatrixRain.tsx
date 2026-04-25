// ============================================================
// Vex — Cross the line.
// MatrixRain — Falling character background effect
// ============================================================

'use client';

import { useEffect, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}()=;\'\"\\!@#$%^&*αβγδεζηθικλμ';
const FONT_SIZE = 14;
const FADE_ALPHA = 0.04;
const COLOR = '#00ff8830';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, drops: number[], columns: number) => {
    // Semi-transparent black overlay for trail effect
    ctx.fillStyle = `rgba(5, 5, 5, ${FADE_ALPHA})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = COLOR;
    ctx.font = `${FONT_SIZE}px monospace`;

    for (let i = 0; i < columns; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;

      ctx.fillText(char, x, y);

      // Reset drop to top with random chance
      if (y > ctx.canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const columns = Math.floor(canvas.width / FONT_SIZE);
    const drops: number[] = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * -50) // Start at random negative positions for stagger
    );

    // Slow it down — only draw every ~50ms
    let lastTime = 0;
    const throttledAnimate = (time: number) => {
      if (time - lastTime > 50) {
        draw(ctx, drops, columns);
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(throttledAnimate);
    };

    throttledAnimate(0);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
      aria-hidden="true"
    />
  );
}
