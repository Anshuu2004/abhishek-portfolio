import { Marquee } from "@/components/motion/Marquee";

const STACK = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Laravel 13",
  "Livewire 4",
  "Python",
  "Flask",
  "OpenVINO",
  "Gemini API",
  "Claude API",
  "Supabase",
  "PostgreSQL",
  "Redis",
  "Tailwind",
  "shadcn/ui",
  "Vitest",
  "Docker",
  "Vercel",
];

export function StackRibbon() {
  return (
    <div className="space-y-2.5 pt-2">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
        Stack ↘
      </p>
      <Marquee duration={50}>
        {STACK.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[12px] text-foreground/80"
          >
            <span>{item}</span>
            <span aria-hidden className="text-border">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
