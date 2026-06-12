"use client";

import { useEffect, useRef } from "react";

/**
 * The site mark: an "A" reduced to a terminal caret — an upward chevron
 * with an ember cursor-block at its heart. Hand-drawn path, no icon set.
 * Strokes draw themselves once on mount (≈600ms, ease-out), then the mark
 * is static; reduced-motion renders it fully drawn.
 */
export function Monogram({ className = "h-5 w-5" }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    dot.style.opacity = "0";

    // Draw the chevron, then pop the ember block in.
    const start = performance.now();
    const DRAW = 520;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DRAW);
      path.style.strokeDashoffset = `${len * (1 - ease(t))}`;
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        path.style.strokeDasharray = "none";
        dot.style.transition = "opacity 180ms ease-out";
        dot.style.opacity = "1";
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        ref={pathRef}
        d="M4 20 L12 4.5 L20 20"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        ref={dotRef}
        x="10.4"
        y="13.2"
        width="3.2"
        height="3.2"
        rx="0.6"
        fill="hsl(var(--accent))"
      />
    </svg>
  );
}
