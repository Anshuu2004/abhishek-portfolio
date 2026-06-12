"use client";

/**
 * Module-level handle to the live Lenis instance. SmoothScroll writes it on
 * mount; anything needing scroll velocity (VelocityMarquee) or programmatic
 * scrolling reads it. Avoids a React context re-render chain for what is
 * fundamentally an imperative, frame-driven value.
 */
import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
