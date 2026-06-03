"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const promptSuggestionVariants = cva(
  "group inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border font-mono text-xs text-muted-foreground outline-none transition-colors duration-fast focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        normal:
          "border-border/60 bg-background/60 hover:border-accent/50 hover:text-foreground",
        ghost: "border-transparent hover:bg-muted/60 hover:text-foreground",
      },
      size: {
        default: "px-2.5 py-1",
        sm: "px-2 py-0.5 text-[11px]",
      },
    },
    defaultVariants: { variant: "normal", size: "default" },
  }
);

export interface PromptSuggestionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof promptSuggestionVariants> {
  /** Optional leading icon (e.g. a lucide glyph). Tints to the accent on hover. */
  icon?: React.ReactNode;
}

/**
 * A single clickable prompt suggestion ("chip"). On-brand take on
 * 21st.dev's prompt-suggestion: sharp pill, mono label, accent on
 * interaction only — no gradients, no scale-on-hover, no shadows.
 */
export function PromptSuggestion({
  children,
  className,
  variant,
  size,
  icon,
  ...props
}: PromptSuggestionProps) {
  return (
    <button
      type="button"
      className={cn(promptSuggestionVariants({ variant, size }), className)}
      {...props}
    >
      {icon ? (
        <span className="text-muted-foreground/60 transition-colors duration-fast group-hover:text-accent">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
