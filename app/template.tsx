"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Template-level page transition. Re-renders on every route change (unlike
 * layout.tsx which persists), so framer-motion's animate-on-mount fires
 * for each navigation. Subtle fade + 8px slide.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
