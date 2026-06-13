"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Perspective tilt wrapper. The child leans toward the cursor in 3D and a
 * faint sheen tracks the high edge — the card feels like a physical panel
 * catching light. Transform-only (GPU), no React state per move, springs
 * back on leave. Disabled for coarse pointers and reduced-motion.
 *
 * Note: this is the sanctioned exception to the "no scale-on-hover" rule —
 * it's a rotation in perspective, not a 2D scale, so it adds depth without
 * the layout-shifting jump the anti-patterns doc warns against.
 */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  /** maximum tilt in degrees */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const apply = (rx: number, ry: number, px: number, py: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${px}%`);
    el.style.setProperty("--my", `${py}%`);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      apply(
        (0.5 - py) * max * 2,
        (px - 0.5) * max * 2,
        px * 100,
        py * 100
      );
    });
  };

  const onLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    apply(0, 0, 50, 50);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("tilt-card", className)}
    >
      {children}
    </div>
  );
}
