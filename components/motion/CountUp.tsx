"use client";

import { useRef } from "react";

import { EASE_OUT, gsap, useGSAP } from "@/lib/gsap";

/**
 * Number that counts up from 0 when it scrolls into view. Tabular figures
 * prevent layout shift while the digits spin. Fires once; reduced-motion
 * renders the final value immediately (matchMedia gate).
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  duration = 1.6,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = `${prefix}${value.toFixed(decimals)}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { n: 0 };
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });

        // Count up to the value…
        tl.to(counter, {
          n: value,
          duration,
          ease: EASE_OUT,
          onUpdate: () => {
            el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
          },
        });

        // …then a mechanical "lock": two quick flickers as the digits settle,
        // like a split-flap display snapping into place.
        tl.to(el, {
          keyframes: {
            opacity: [1, 0.35, 1, 0.6, 1],
            "--lock-x": ["0px", "-1px", "1px", "0px", "0px"],
          },
          duration: 0.32,
          ease: "steps(5)",
          onComplete: () => {
            el.textContent = final;
            el.style.removeProperty("opacity");
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {final}
    </span>
  );
}
