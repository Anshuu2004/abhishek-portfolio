/**
 * "Available for SDE roles · Bhopal, India" pill with radar-pulse dot.
 * Server component — the pulse is pure CSS via Tailwind's animate-ping.
 *
 * Status-indicator pulse is an explicit exception to the no-auto-motion rule
 * (see docs/anti-patterns.md). Pulsing dots are a universal convention for
 * live-status indicators (terminal cursors, online dots, recording lights) —
 * they read as "live signal," not decoration.
 */
export function AvailabilityPill() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-muted/40 px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        Available for SDE roles
      </span>
      <span aria-hidden className="text-border">
        ·
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        Bhopal, India
      </span>
    </div>
  );
}
