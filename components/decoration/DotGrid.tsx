/**
 * Subtle dot grid background. Pure CSS via Tailwind's arbitrary value support.
 * Designed to fade out at the edges of its container with a radial mask.
 */
export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(circle,hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] ${className}`}
    />
  );
}
