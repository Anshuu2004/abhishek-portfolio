"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Terminal decode effect: text resolves left-to-right out of a glyph
 * scramble, like a hash being cracked. Mount-once motion (allowed by the
 * motion grammar), ~40ms per character. Reduced-motion renders the final
 * string immediately.
 */
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789{}<>/_-#$%&";

export function ScrambleText({
  children,
  delay = 0,
  className,
}: {
  children: string;
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(children);
  const [started, setStarted] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(children);
      return;
    }

    let raf = 0;
    let cancelled = false;
    const target = children;

    const timeout = window.setTimeout(() => {
      setStarted(true);
      const begin = performance.now();
      const perChar = 28; // ms each character takes to lock in
      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = now - begin;
        const locked = Math.floor(elapsed / perChar);
        frameRef.current++;
        const out = target
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < locked) return char;
            // Re-roll scramble glyphs every few frames so it shimmers.
            return GLYPHS[
              (i * 7 + frameRef.current * 3 + i * frameRef.current) %
                GLYPHS.length
            ];
          })
          .join("");
        setDisplay(out);
        if (locked < target.length) raf = requestAnimationFrame(tick);
        else setDisplay(target);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [children, delay]);

  return (
    <span className={className} aria-label={children}>
      <span aria-hidden className={started ? "" : "opacity-0"}>
        {display}
      </span>
    </span>
  );
}
