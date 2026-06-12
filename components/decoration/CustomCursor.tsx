"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — small accent dot that follows the mouse and expands over
 * interactive elements (anchors, buttons). Hidden on touch devices and
 * when prefers-reduced-motion is set.
 *
 * Implementation notes:
 * - Position is set via CSS variables on the DOM, not React state, to avoid
 *   re-renders on every mousemove (would be expensive).
 * - Hover state DOES use React state because it changes class names.
 * - Native cursor remains visible (we do not hide it) — the custom cursor
 *   is additive, so accessibility is preserved.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || isReducedMotion) return;
    setEnabled(true);

    // Trailing ring: lerped toward the cursor each frame so it lags with
    // weight (confident ease-out feel, no spring overshoot).
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
    };
    raf = requestAnimationFrame(tick);

    const move = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--cursor-x", `${e.clientX}px`);
      el.style.setProperty("--cursor-y", `${e.clientY}px`);
    };

    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest('a, button, [role="button"], input, textarea, select');

    const enter = (e: MouseEvent) => {
      if (isInteractive(e.target)) setHovered(true);
    };
    const leave = (e: MouseEvent) => {
      if (isInteractive(e.target)) setHovered(false);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden sm:block"
        style={{
          transform:
            "translate3d(var(--cursor-x, -100px), var(--cursor-y, -100px), 0) translate(-50%, -50%)",
        }}
      >
        <div
          className={`rounded-full bg-accent transition-all duration-200 ease-out ${
            hovered ? "h-7 w-7 opacity-25" : "h-2 w-2 opacity-90"
          }`}
        />
      </div>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] hidden sm:block"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <div
          className={`rounded-full border border-accent/40 transition-all duration-300 ease-out ${
            hovered ? "h-10 w-10 opacity-0" : "h-6 w-6 opacity-60"
          }`}
        />
      </div>
    </>
  );
}
