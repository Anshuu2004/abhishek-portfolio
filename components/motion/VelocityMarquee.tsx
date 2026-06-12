"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis-store";

/**
 * Marquee that breathes with the page: a slow ambient drift (the documented
 * ticker exception) whose speed and skew respond to scroll velocity — scroll
 * fast and the ribbon rushes and leans, stop and it settles back to its
 * ~50s-per-loop crawl. Content is doubled for a seamless wrap.
 *
 * Falls back to a static (non-drifting) strip under reduced motion.
 */
export function VelocityMarquee({
  children,
  baseSpeed = 0.035,
}: {
  children: ReactNode;
  /** percent of track width per second at rest */
  baseSpeed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let skew = 0;

    const tick = (_t: number, deltaMs: number) => {
      const lenis = getLenis();
      // Lenis velocity is px/frame-ish; normalise and clamp.
      const velocity = lenis ? Math.abs(lenis.velocity) : 0;
      const boost = Math.min(velocity / 12, 6);
      const dir = lenis && lenis.velocity < 0 ? -1 : 1;

      const ambient = hoverRef.current ? 0 : baseSpeed;
      x -= (ambient + boost * 0.12 * dir) * (deltaMs / 16.7);
      // Wrap within the doubled track: [-50, 0)
      if (x <= -50) x += 50;
      if (x > 0) x -= 50;

      const targetSkew = Math.min(Math.max(lenis ? lenis.velocity * 0.06 : 0, -6), 6);
      skew += (targetSkew - skew) * 0.08;

      track.style.transform = `translate3d(${x}%, 0, 0) skewX(${-skew}deg)`;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [baseSpeed]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div ref={trackRef} className="flex w-max gap-x-1.5 will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
}
