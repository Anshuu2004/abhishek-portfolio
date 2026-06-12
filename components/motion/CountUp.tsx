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
        gsap.to(counter, {
          n: value,
          duration,
          ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
          },
          onComplete: () => {
            el.textContent = final;
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
