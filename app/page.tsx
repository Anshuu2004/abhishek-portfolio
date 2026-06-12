import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import { getAllProjects } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";
import { LetterReveal } from "@/components/motion/LetterReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { DotGrid } from "@/components/decoration/DotGrid";
import { HeroAmbient } from "@/components/decoration/HeroAmbient";
import { EmberField } from "@/components/decoration/EmberField";
import { AskMyPortfolio } from "@/components/hero/AskMyPortfolio";
import { AvailabilityPill } from "@/components/hero/AvailabilityPill";
import { MetricsStrip } from "@/components/hero/MetricsStrip";
import { ResumeButton } from "@/components/hero/ResumeButton";
import { StackRibbon } from "@/components/hero/StackRibbon";
import { FeaturedRail } from "@/components/work/FeaturedRail";
import { Outro } from "@/components/home/Outro";

export default async function HomePage() {
  const projects = await getAllProjects();
  const railProjects = projects.map(
    ({ title, slug, year, summary, stack, featured }) => ({
      title,
      slug,
      year,
      summary,
      stack,
      featured,
    })
  );

  return (
    <>
      {/* ——— Act I: hero. Fills the first viewport; answers who/what/where
          plus a CTA inside the recruiter's 15-second scan window. */}
      <section className="relative flex min-h-[calc(100dvh-8.5rem)] flex-col justify-center">
        {/* Full-bleed ember shader behind the hero; CSS ambient stays
            underneath as the static / no-WebGL / reduced-motion fallback. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-7.5rem] -z-10 h-[110dvh] w-screen -translate-x-1/2 overflow-hidden"
        >
          <HeroAmbient />
          <EmberField />
        </div>
        <DotGrid />

        <div className="relative space-y-7">
          <FadeUp>
            <AvailabilityPill />
          </FadeUp>

          <h1 className="text-balance text-[clamp(2.9rem,9vw,6.25rem)] font-semibold leading-[0.98] tracking-tight">
            <LetterReveal>Abhishek Choudhary</LetterReveal>
          </h1>

          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent sm:text-sm">
            <ScrambleText delay={0.7}>
              ai-native full-stack engineer
            </ScrambleText>
          </p>

          <FadeUp delay={0.4}>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              I build AI products on{" "}
              <em className="font-display text-foreground">
                real engineering foundations
              </em>{" "}
              — production multi-tenant SaaS, RAG pipelines, edge ML at{" "}
              <span className="text-foreground">30 FPS on a CPU</span>.
            </p>
          </FadeUp>

          <FadeUp delay={0.55}>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <MagneticButton>
                <Button asChild size="lg">
                  <Link href="/work">
                    See the work
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </MagneticButton>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">About me</Link>
              </Button>
              <MagneticButton>
                <ResumeButton variant="hero" />
              </MagneticButton>
            </div>
          </FadeUp>

          <FadeUp delay={0.7}>
            <StackRibbon />
          </FadeUp>
        </div>

        <FadeUp delay={1.0} className="absolute bottom-6 left-0">
          <Link
            href="#proof"
            className="group inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowDown
              className="h-3 w-3 transition-transform group-hover:translate-y-0.5"
              aria-hidden
            />
            The evidence below
          </Link>
        </FadeUp>
      </section>

      {/* ——— Act II: proof strip + live agent. */}
      <div id="proof" className="space-y-16 pt-24">
        <MetricsStrip />
        <AskMyPortfolio />
      </div>

      {/* ——— Act III: horizontal work rail, full-bleed. */}
      <div className="relative left-1/2 mt-24 w-screen -translate-x-1/2">
        <FeaturedRail projects={railProjects} />
      </div>

      {/* ——— Act IV: closing frame. */}
      <Outro />
    </>
  );
}
