/**
 * Soft amber ambient glow at the top of the hero. Pure CSS via a radial
 * gradient. Sits behind content, very low opacity — the page feels warmer
 * without ever reading as a "gradient background."
 */
export function HeroAmbient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[120%] -translate-x-1/2"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--accent) / 0.08), transparent 65%)",
      }}
    />
  );
}
