import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The mono uppercase section label. One source of truth — the exact same
 * size/tracking/color everywhere, instead of fourteen hand-copied variants
 * drifting a pixel at a time.
 */
export function Kicker({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "h2" | "span";
}) {
  return (
    <Tag
      className={cn(
        "font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground",
        className
      )}
    >
      {children}
    </Tag>
  );
}
