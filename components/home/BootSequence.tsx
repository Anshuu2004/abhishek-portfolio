"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  "> init abhishek.dev",
  "> loading: 5 projects · 41 tests green",
  "> ready",
] as const;

const SESSION_KEY = "boot-done";

/**
 * Opening title — a three-line terminal boot that plays exactly once per
 * session, then the curtain lifts into the hero reveal. Any click or
 * keypress skips it instantly. Total runtime ≈1.3s. Never shown for
 * reduced-motion users or return navigations.
 */
export function BootSequence() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setShow(true);

    const dismiss = () => setShow(false);
    const timer = window.setTimeout(dismiss, 1300);
    window.addEventListener("pointerdown", dismiss);
    window.addEventListener("keydown", dismiss);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-[90] flex items-end bg-background"
        >
          <div className="space-y-1.5 p-8 font-mono text-xs text-muted-foreground sm:p-12 sm:text-sm">
            {LINES.map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.22, duration: 0.05 }}
                className={i === LINES.length - 1 ? "text-accent" : undefined}
              >
                {line}
                {i === LINES.length - 1 && (
                  <span className="ml-1 inline-block h-[1em] w-[6px] translate-y-[0.15em] animate-pulse bg-accent" />
                )}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
