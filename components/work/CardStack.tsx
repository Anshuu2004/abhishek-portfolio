"use client";

import { useRef, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Scroll-stacking deck: each card sticks near the top of the viewport and
 * the next one slides over it; the covered card recedes (slight scale-down
 * and dim, scrubbed 1:1 with scroll). Built on position:sticky — the GSAP
 * work is only the recede effect, so reduced-motion users still get clean
 * sticky stacking with no scale/dim.
 */
export function CardStack({ children }: { children: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-stack-item]")
      );

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tweens = items.slice(0, -1).map((item, i) =>
          gsap.to(item, {
            scale: 0.95,
            filter: "brightness(0.55)",
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: items[i + 1],
              start: "top bottom",
              end: "top top+=120",
              scrub: true,
            },
          })
        );
        return () => {
          tweens.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
        };
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="space-y-10">
      {children.map((child, i) => (
        <div
          key={i}
          data-stack-item
          className="sticky"
          style={{ top: `calc(5.5rem + ${i * 14}px)` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
