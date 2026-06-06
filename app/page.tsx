import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";
import { LetterReveal } from "@/components/motion/LetterReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { DotGrid } from "@/components/decoration/DotGrid";
import { HeroAmbient } from "@/components/decoration/HeroAmbient";
import { AskMyPortfolio } from "@/components/hero/AskMyPortfolio";
import { AvailabilityPill } from "@/components/hero/AvailabilityPill";
import { ResumeButton } from "@/components/hero/ResumeButton";
import { StackRibbon } from "@/components/hero/StackRibbon";

export default function HomePage() {
  return (
    <section className="relative space-y-16 pt-6 sm:pt-10">
      <HeroAmbient />
      <DotGrid />

      <div className="relative space-y-7">
        <FadeUp>
          <AvailabilityPill />
        </FadeUp>

        <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
          <LetterReveal>Abhishek Choudhary</LetterReveal>
        </h1>

        <FadeUp delay={0.4}>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            AI-native full-stack engineer. I build AI products on real
            engineering foundations — production multi-tenant SaaS, RAG
            pipelines, edge ML at{" "}
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

      <FadeUp delay={0.85}>
        <AskMyPortfolio />
      </FadeUp>

      <FadeUp delay={1.0}>
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowDown
            className="h-3 w-3 transition-transform group-hover:translate-y-0.5"
            aria-hidden
          />
          Five projects below
        </Link>
      </FadeUp>
    </section>
  );
}
