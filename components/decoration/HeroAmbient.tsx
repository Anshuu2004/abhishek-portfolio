/**
 * Layered amber ambient behind the hero. Pure CSS — two stacked radial
 * gradients give the glow depth (a tight warm core over a wide soft wash)
 * plus a faint accent hairline that grounds the top edge. Sits behind
 * content at very low opacity: the page reads warmer and more dimensional
 * without ever becoming a "gradient background."
 */
export function HeroAmbient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-32 -z-10">
      {/* Wide soft wash */}
      <div
        className="absolute left-1/2 h-[520px] w-[130%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 0%, hsl(var(--accent) / 0.07), transparent 70%)",
        }}
      />
      {/* Tight warm core */}
      <div
        className="absolute left-1/2 top-6 h-[300px] w-[70%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 0%, hsl(var(--accent) / 0.10), transparent 60%)",
        }}
      />
      {/* Accent hairline grounding the top edge */}
      <div
        className="absolute left-1/2 top-32 h-px w-[40%] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--accent) / 0.45), transparent)",
        }}
      />
    </div>
  );
}
