import type { Metadata } from "next";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { ResumeButton } from "@/components/hero/ResumeButton";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Abhishek Choudhary — Computer Science undergraduate, Full-Stack Developer at SimptionTech, AI-native engineer based in Bhopal, India.",
};

const FACTS: { label: string; value: string }[] = [
  { label: "Location", value: "Bhopal, Madhya Pradesh, India" },
  {
    label: "Current role",
    value: "Full-Stack Developer · SimptionTech (since May 2025)",
  },
  {
    label: "Education",
    value: "B.Tech CSE · UIT-RGPV (2023 – 2027)",
  },
  {
    label: "Looking for",
    value: "SDE internship / full-time, India + US/EU",
  },
];

const NOW: string[] = [
  "Shipping Simption ERP — multi-tenant SaaS on Laravel 13 + Livewire 4, 20+ self-registering modules.",
  "Sharpening edge-ML chops on OpenVINO async inference (~30 FPS on a CPU).",
  "Writing technical posts grounded in production work — multi-tenancy, RAG agents, OpenVINO benchmarks.",
];

const PRINCIPLES: { rule: string; reason: string }[] = [
  {
    rule: "Architecture before clever code.",
    reason:
      "A clear module boundary saves more debugging hours than a clever one-liner ever costs.",
  },
  {
    rule: "Measure before optimising.",
    reason:
      "FP16 vs FP32 isn't a vibe; it's a benchmark. So is every other 'should be faster' instinct.",
  },
  {
    rule: "Ship the slice that proves the system end-to-end.",
    reason:
      "A vertical tracer through every layer flushes out unknown unknowns. A horizontal layer doesn't.",
  },
  {
    rule: "AI is the new control plane, not the new compiler.",
    reason:
      "LLMs orchestrate; production code still needs the discipline of types, tests, and rollback paths.",
  },
];

export default function AboutPage() {
  return (
    <section className="space-y-14">
      <FadeUp>
        <header className="space-y-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            About
          </p>
          <RevealText
            as="h1"
            className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            AI-native full-stack engineer
            <br />
            <span className="text-muted-foreground">
              grounded in{" "}
              <em className="font-display font-normal text-foreground/90">
                production
              </em>{" "}
              code.
            </span>
          </RevealText>
        </header>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="max-w-2xl space-y-4 text-pretty leading-relaxed text-foreground/85">
          <p>
            I'm Abhishek, a Computer Science undergraduate at UIT-RGPV in
            Bhopal and a Full-Stack Developer at SimptionTech. My day job is
            shipping{" "}
            <a
              href="/work/simption-erp"
              className="text-foreground underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              Simption ERP
            </a>
            — a multi-tenant SaaS on Laravel 13 + Livewire 4 designed to serve
            1000+ educational institutions with isolated databases per tenant
            and a JSON-driven pluggable module system across 20+ modules.
          </p>
          <p>
            Outside work I build AI products on real engineering foundations.{" "}
            <a
              href="/work/codeheal"
              className="text-foreground underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              CodeHeal
            </a>{" "}
            is a GitHub OAuth agent that auto-fixes bugs across six languages
            using Gemini.{" "}
            <a
              href="/work/driveaware"
              className="text-foreground underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              DriveAware
            </a>{" "}
            is a driver-drowsiness detector that runs three OpenVINO models at{" "}
            <span className="text-foreground">~30 FPS on a CPU</span> by
            chaining them through async inference.
          </p>
          <p>
            What I'm optimising for: SDE roles where the engineering bar is
            high, the stack is modern, and there's real product behind the
            problems. India or international. Most of what I&apos;ve built so
            far is on the{" "}
            <a
              href={SITE.resume}
              download
              className="text-foreground underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              résumé
            </a>
            , and the rest is on this site.
          </p>
        </div>
      </FadeUp>

      <FadeUp delay={0.16}>
        <section className="space-y-4">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Facts
          </h2>
          <dl className="grid gap-x-8 gap-y-3 border-y border-border/60 py-5 sm:grid-cols-[max-content_1fr]">
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="contents font-mono text-sm"
              >
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </FadeUp>

      <FadeUp delay={0.24}>
        <section className="space-y-4">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Now · what I&apos;m currently shipping
          </h2>
          <ul className="space-y-2.5">
            {NOW.map((line) => (
              <li
                key={line}
                className="relative pl-6 text-foreground/85 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
              >
                {line}
              </li>
            ))}
          </ul>
        </section>
      </FadeUp>

      <FadeUp delay={0.32}>
        <section className="space-y-4">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Principles · how I work
          </h2>
          <ul className="space-y-4">
            {PRINCIPLES.map((p) => (
              <li
                key={p.rule}
                className="border-l-2 border-border pl-4"
              >
                <p className="font-semibold text-foreground">{p.rule}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {p.reason}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </FadeUp>

      <FadeUp delay={0.4}>
        <section className="space-y-3 rounded-lg border border-border bg-muted/30 p-6">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Reach me
          </h2>
          <p className="text-pretty text-foreground/85">
            For roles, freelance briefs, or to argue about the right multi-tenancy
            strategy:{" "}
            <a
              href="mailto:abhishekcse2004@gmail.com"
              className="text-foreground underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              abhishekcse2004@gmail.com
            </a>
            . LinkedIn and GitHub on{" "}
            <a
              href="/contact"
              className="text-foreground underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              /contact
            </a>
            .
          </p>
          <div className="pt-1">
            <ResumeButton variant="hero" />
          </div>
        </section>
      </FadeUp>
    </section>
  );
}
