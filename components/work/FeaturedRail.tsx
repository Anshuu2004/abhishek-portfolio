"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { Kicker } from "@/components/ui/kicker";

export interface RailProject {
  title: string;
  slug: string;
  year: number;
  summary: string;
  stack: string[];
  featured: boolean;
}

/**
 * Cinematic horizontal showcase. On desktop the section grows taller than
 * the viewport, a sticky frame holds the cards, and the track translates
 * sideways scrubbed 1:1 with vertical scroll — the "pinned gallery" move,
 * built on position:sticky so it cannot fight Lenis or transformed
 * ancestors. Touch, small screens, and reduced-motion get a native
 * horizontal scroll strip instead (same DOM, zero JS).
 */
export function FeaturedRail({ projects }: { projects: RailProject[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          // The sticky frame needs vertical room to travel through.
          const setHeight = () => {
            section.style.height = `${window.innerHeight + distance()}px`;
          };
          setHeight();
          ScrollTrigger.addEventListener("refreshInit", setHeight);

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", setHeight);
            section.style.height = "";
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="relative">
      <div className="sticky top-0 flex min-h-[100dvh] flex-col justify-center overflow-hidden py-16">
        <div className="mb-10 flex items-end justify-between gap-6 px-6 lg:px-[max(1.5rem,calc((100vw-64rem)/2))]">
          <div className="space-y-3">
            <Kicker>Selected work · scroll to travel</Kicker>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Proof, not promises.
            </h2>
          </div>
          <Link
            href="/work"
            className="group hidden shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            All case studies
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        {/* Mobile: native horizontal scroll. Desktop: GSAP translates the track. */}
        <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          <div
            ref={trackRef}
            className="flex w-max gap-5 px-6 will-change-transform lg:px-[max(1.5rem,calc((100vw-64rem)/2))]"
          >
            {projects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="group relative flex w-[78vw] max-w-[26rem] shrink-0 flex-col justify-between overflow-hidden rounded-lg border border-border bg-muted/30 p-6 transition-colors duration-slow hover:border-accent/50 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent sm:w-[52vw] lg:w-[30rem] lg:max-w-none"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-4 -top-10 select-none font-mono text-[9rem] font-semibold leading-none text-foreground/[0.04] transition-colors duration-slow group-hover:text-accent/[0.07]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative space-y-4">
                  <Kicker>
                    {String(i + 1).padStart(2, "0")} · {project.year}
                    {project.featured && (
                      <span className="text-accent"> · featured</span>
                    )}
                  </Kicker>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground transition-colors duration-fast group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center justify-between gap-4 border-t border-border/60 pt-4">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 3).map((tech) => (
                      <li
                        key={tech}
                        className="rounded-sm border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[11px] text-foreground/80"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors duration-fast group-hover:text-accent">
                    Case study
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
