"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { ScrollTrigger } from "@/lib/gsap";

/**
 * Template-level page transition. Re-renders on every route change (unlike
 * layout.tsx which persists), so the entrance fires for each navigation.
 * Cinematic but quick: fade + 14px rise + a blur that snaps to focus, like
 * a rack-focus cut. Reduced-motion gets a plain crossfade.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 14, filter: "blur(8px)" }
      }
      animate={
        reduced
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      onAnimationComplete={() => {
        // Scroll choreography measured during the entrance transform would
        // be off by the entrance offset — re-measure once settled.
        ScrollTrigger.refresh();
      }}
    >
      {children}
    </motion.div>
  );
}
