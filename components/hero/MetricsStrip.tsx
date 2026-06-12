import { CountUp } from "@/components/motion/CountUp";

/**
 * Recruiter-first proof strip. Hiring research says a screener gives the
 * page ~15 seconds — these four numbers put the strongest evidence in that
 * window. Every figure is substantiated by a case study on this site.
 */
const METRICS: {
  value: number;
  suffix: string;
  label: string;
  detail: string;
}[] = [
  {
    value: 30,
    suffix: " FPS",
    label: "edge ML on a bare CPU",
    detail: "DriveAware · 3 chained OpenVINO models, async inference",
  },
  {
    value: 1000,
    suffix: "+",
    label: "institutions, one codebase",
    detail: "Simption ERP · isolated DB per tenant",
  },
  {
    value: 20,
    suffix: "+",
    label: "self-registering modules",
    detail: "JSON-driven plugin architecture, Laravel 13",
  },
  {
    value: 6,
    suffix: "",
    label: "languages auto-fixed",
    detail: "CodeHeal · Gemini-powered GitHub agent",
  },
];

export function MetricsStrip() {
  return (
    <section aria-label="Engineering proof points">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border/60 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="group bg-background/95 p-5 transition-colors duration-slow hover:bg-muted/60 sm:p-6"
          >
            <dt className="sr-only">{m.label}</dt>
            <dd className="space-y-1.5">
              <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                <CountUp value={m.value} suffix={m.suffix} />
              </p>
              <p className="text-sm text-foreground/85">{m.label}</p>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {m.detail}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
