"use client";

import { useRef, type ReactNode } from "react";

import { EASE_OUT, SplitText, gsap, useGSAP } from "@/lib/gsap";

/**
 * Scroll-triggered masked text reveal. Splits the content into lines, wraps
 * each in an overflow clip, and slides them up as the element enters the
 * viewport. Fires once. Reduced-motion shows the text statically (GSAP
 * matchMedia gate).
 */
export function RevealText({
  children,
  className,
  as: Tag = "div",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          linesClass: "overflow-hidden",
          autoSplit: true,
          mask: "lines",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: EASE_OUT,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
