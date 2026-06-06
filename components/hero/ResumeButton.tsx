import { Download } from "lucide-react";

import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type Variant = "hero" | "nav" | "footer";

/**
 * Résumé download button. Serves the PDF from /public via a native
 * `download` anchor — no JS, works without hydration, right-clickable.
 *
 * The hero variant carries a 1px accent gradient ring (CSS mask technique)
 * that fades in on hover. It's an accent-color shift, not a drop shadow, and
 * it's user-triggered — both inside the rules in docs/anti-patterns.md.
 */
export function ResumeButton({
  variant = "hero",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const label = variant === "footer" ? "Résumé" : "Download résumé";

  if (variant === "nav") {
    return (
      <a
        href={SITE.resume}
        download
        className={cn(
          "group hidden items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground sm:inline-flex",
          className
        )}
      >
        <Download
          className="h-3 w-3 transition-transform group-hover:translate-y-0.5"
          aria-hidden
        />
        Résumé
      </a>
    );
  }

  if (variant === "footer") {
    return (
      <a
        href={SITE.resume}
        download
        className={cn(
          "group inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
          className
        )}
      >
        <Download
          className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5"
          aria-hidden
        />
        {label}
      </a>
    );
  }

  // hero
  return (
    <a
      href={SITE.resume}
      download
      className={cn(
        "group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-md border border-border bg-muted/20 px-7 text-sm font-medium text-foreground transition-colors duration-200 hover:border-transparent hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
        className
      )}
    >
      {/* Accent gradient ring — 1px border drawn via mask, fades in on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(120deg, hsl(var(--accent)), hsl(var(--accent) / 0.25) 70%, hsl(var(--accent) / 0.6))",
          padding: "1px",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <Download
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
        aria-hidden
      />
      {label}
    </a>
  );
}
