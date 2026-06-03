"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Slow horizontal marquee. Auto-scrolls one full loop every `duration`
 * seconds. Pauses on hover. Content is doubled internally for a seamless
 * loop. Mask-image fades the edges so items appear/disappear smoothly.
 *
 * Status: explicit exception to the "no auto-playing motion" rule —
 * marquees of credentials/stack are a recognised engineer-portfolio
 * convention and the motion is slow enough to read as "ambient ticker"
 * rather than "decoration."
 */
export function Marquee({
  children,
  duration = 40,
}: {
  children: ReactNode;
  duration?: number;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-x-1.5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        whileHover={{ x: "0%", transition: { duration: 0 } }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
