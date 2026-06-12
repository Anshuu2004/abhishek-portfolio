"use client";

import { useRef, type ReactNode } from "react";

import { EASE_OUT, gsap, useGSAP } from "@/lib/gsap";

/**
 * Makes the hand-built architecture SVGs perform. Works on the diagrams'
 * shared anatomy: `rect` = system nodes, `text` = labels, `path[marker-end]`
 * = directed edges.
 *
 * - On scroll into view (once): nodes fade in dependency order, labels
 *   follow, then every edge stroke-draws toward its arrowhead.
 * - On hover: edges switch to a dashed "packet flow" that travels along the
 *   data path — the diagram reads as a live system while the cursor is on it.
 *
 * Reduced-motion: the SVG renders fully drawn, no triggers, no pulse.
 */
export function DiagramReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pulseTweens = useRef<gsap.core.Tween[]>([]);
  const drawn = useRef(false);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const svg = root.querySelector("svg");
      if (!svg) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nodes = Array.from(svg.querySelectorAll("rect"));
        const labels = Array.from(svg.querySelectorAll("text"));
        const edges = Array.from(
          svg.querySelectorAll<SVGPathElement>("path[marker-end]")
        );

        gsap.set(nodes, { autoAlpha: 0 });
        gsap.set(labels, { autoAlpha: 0 });
        edges.forEach((edge) => {
          const len = edge.getTotalLength();
          gsap.set(edge, {
            strokeDasharray: len,
            strokeDashoffset: len,
            autoAlpha: 0,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
          defaults: { ease: EASE_OUT },
          onComplete: () => {
            // Hand the edges back to a solid stroke so the hover pulse can
            // own the dash pattern.
            edges.forEach((e) => {
              e.style.strokeDasharray = "none";
            });
            drawn.current = true;
          },
        });

        tl.to(nodes, { autoAlpha: 1, duration: 0.45, stagger: 0.07 })
          .to(labels, { autoAlpha: 1, duration: 0.4, stagger: 0.03 }, "-=0.3")
          .to(
            edges,
            {
              autoAlpha: 1,
              strokeDashoffset: 0,
              duration: 0.5,
              stagger: 0.09,
              ease: "power2.out",
            },
            "-=0.25"
          );

        const startPulse = () => {
          if (!drawn.current) return;
          stopPulse();
          edges.forEach((edge) => {
            edge.style.strokeDasharray = "5 9";
            pulseTweens.current.push(
              gsap.to(edge, {
                strokeDashoffset: -28,
                duration: 0.9,
                ease: "none",
                repeat: -1,
              })
            );
          });
        };
        const stopPulse = () => {
          pulseTweens.current.forEach((t) => t.kill());
          pulseTweens.current = [];
          edges.forEach((edge) => {
            edge.style.strokeDasharray = "none";
            gsap.set(edge, { strokeDashoffset: 0 });
          });
        };

        root.addEventListener("mouseenter", startPulse);
        root.addEventListener("mouseleave", stopPulse);
        return () => {
          root.removeEventListener("mouseenter", startPulse);
          root.removeEventListener("mouseleave", stopPulse);
          stopPulse();
        };
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
