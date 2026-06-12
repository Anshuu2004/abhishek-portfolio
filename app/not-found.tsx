import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { FadeUp } from "@/components/motion/FadeUp";

/**
 * Custom 404 — terminal-toned. The error line decodes like a failed lookup,
 * then offers the two routes a lost visitor actually wants.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[60dvh] flex-col justify-center space-y-8">
      <div className="space-y-4">
        <Kicker>Error</Kicker>
        <h1 className="text-balance text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-none tracking-tight">
          404
        </h1>
        <p className="font-mono text-sm text-accent">
          <ScrambleText delay={0.2}>route not found — no such path</ScrambleText>
        </p>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          The page you&apos;re after doesn&apos;t exist or moved. Everything
          worth seeing is reachable from the work index — or press{" "}
          <kbd className="rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]">
            ⌘K
          </kbd>{" "}
          and jump anywhere.
        </p>
      </div>

      <FadeUp delay={0.25}>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/work">
              See the work
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </FadeUp>
    </section>
  );
}
