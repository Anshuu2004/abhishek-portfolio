/**
 * Subtle grain texture overlay. Renders an SVG turbulence pattern at very
 * low opacity — adds the analog "film grain" feeling that makes flat dark
 * surfaces feel less digital. Inspired by Linear / Vercel's home pages.
 *
 * Inline data URI so no external request. Positioned fixed, pointer-events
 * disabled, behind content (z-0).
 */
const NOISE_DATA_URI =
  "data:image/svg+xml;utf8,<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

export function Noise() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("${NOISE_DATA_URI}")`,
        backgroundSize: "256px 256px",
      }}
    />
  );
}
