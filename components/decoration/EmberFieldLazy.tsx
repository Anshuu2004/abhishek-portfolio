"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Defers the WebGL ember shader out of the critical path: the chunk loads
 * and the GL context compiles only after the main thread goes idle (or 1.2s,
 * whichever comes first). The CSS HeroAmbient glow underneath means the hero
 * is never visually empty while we wait — the shader fades in over it.
 */
const EmberField = dynamic(
  () => import("./EmberField").then((m) => m.EmberField),
  { ssr: false }
);

export function EmberFieldLazy({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 1200,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;
  return (
    <div className="animate-ember-in">
      <EmberField className={className} />
    </div>
  );
}
