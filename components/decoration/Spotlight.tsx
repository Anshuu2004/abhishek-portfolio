"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-follow ambient spotlight. Renders a soft accent glow at the cursor
 * position across the viewport. Pure CSS variable updates — no React re-renders
 * per mouse event. Respects reduced-motion (the glow is positioned but does
 * not transition).
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--spotlight-x", `${e.clientX}px`);
      el.style.setProperty("--spotlight-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-slow [&]:opacity-100"
      style={{
        background:
          "radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 30%), hsl(var(--accent) / 0.06), transparent 70%)",
      }}
    />
  );
}
