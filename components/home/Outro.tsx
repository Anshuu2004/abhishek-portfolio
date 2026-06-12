"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import { ResumeButton } from "@/components/hero/ResumeButton";
import { SITE } from "@/lib/site";
import { SplitText, gsap, useGSAP } from "@/lib/gsap";

/**
 * Closing frame. The headline's characters ignite from muted to full
 * foreground as the section scrolls through — a scrubbed fill that gives
 * the page a deliberate final beat before the contact actions.
 */
export function Outro() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heading = ref.current?.querySelector("[data-outro-heading]");
      if (!heading) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(heading, {
          type: "chars,words",
          autoSplit: true,
        });
        gsap.from(split.chars, {
          opacity: 0.12,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="flex min-h-[70dvh] flex-col items-start justify-center space-y-10 py-20"
    >
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        Next step
      </p>

      <h2
        data-outro-heading
        className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
      >
        Let&apos;s ship something{" "}
        <em className="font-display font-normal text-accent">real</em>.
      </h2>

      <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
        I&apos;m looking for SDE roles with a high engineering bar — India or
        international. If your team ships real product, I want to hear about
        it.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${SITE.email}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-8 text-sm font-medium text-accent-foreground transition-colors duration-fast hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          {SITE.email}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
        <ResumeButton variant="hero" />
      </div>
    </section>
  );
}
