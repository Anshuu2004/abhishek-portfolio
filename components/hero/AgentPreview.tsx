"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const QUESTIONS: { q: string; a: string; sources: string[] }[] = [
  {
    q: "What's Simption ERP?",
    a: "Simption ERP is a multi-tenant SaaS I built at SimptionTech using Laravel 13 plus Livewire 4. It serves 1000+ institutions with isolated MySQL databases per tenant via stancl/tenancy and subdomain-based routing. Automated provisioning brought onboarding to under 10 minutes. The pluggable module system across 20+ modules ships its own service providers, views, models, routes, and RBAC permissions — cutting feature rollout time by about 40%.",
    sources: ["simption-erp", "resume.experience"],
  },
  {
    q: "Did you work with OpenVINO?",
    a: "Yes — DriveAware (2026) is a real-time driver drowsiness and distraction detector. I chained three OpenVINO Model Zoo models (face detection, head-pose estimation, open/closed-eye classification) through the OpenVINO Async Inference API for overlapped CPU execution. Tested FP32 vs FP16 IR on an Intel Core i5 with no GPU — hit roughly 30 FPS at under 60 ms end-to-end latency with FP16. Added PERCLOS-based drowsiness scoring, head-pose distraction flags, audible alerts, and a local CSV incident log.",
    sources: ["driveaware", "resume.projects"],
  },
  {
    q: "Show me CodeHeal's architecture",
    a: "CodeHeal is a GitHub OAuth AI agent that detects and auto-fixes bugs across Python, JavaScript, TypeScript, Go, Ruby, Java and C++. Stack: React 19, Node, Express, Gemini API, Octokit. Flow: login via GitHub OAuth → select repo → parallel pipeline analyzes up to 10 files concurrently → Gemini detects syntax/lint/logic/type issues → Octokit commits fixes to a new branch. Auth is hardened with JWT sessions, AES-256-GCM token encryption, Helmet, rate limiting and timing-safe comparisons.",
    sources: ["codeheal", "resume.projects"],
  },
];

function Typewriter({ text, speed = 30 }: { text: string; speed?: number }) {
  const words = text.split(/\s+/);
  const [visibleWords, setVisibleWords] = useState(0);

  useEffect(() => {
    setVisibleWords(0);
    const id = window.setInterval(() => {
      setVisibleWords((v) => {
        if (v >= words.length) {
          window.clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, words.length]);

  return (
    <span>
      {words.slice(0, visibleWords).join(" ")}
      {visibleWords < words.length && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.18em] bg-accent" />
      )}
    </span>
  );
}

export function AgentPreview() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const selected = selectedIdx === null ? null : QUESTIONS[selectedIdx];

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30 p-5 transition-colors duration-fast hover:border-foreground/40 sm:p-6">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-accent to-transparent opacity-60"
      />

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Signature feature · live preview
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Try a question
        </span>
      </div>

      <div className="mt-4 min-h-[6rem]">
        <AnimatePresence mode="wait" initial={false}>
          {selected === null ? (
            <motion.p
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base text-foreground"
            >
              <span className="mr-1.5 font-mono text-accent">›</span>
              Ask my portfolio anything about my work — a Gemini-powered RAG
              agent over my resume and projects.
            </motion.p>
          ) : (
            <motion.div
              key={`answer-${selectedIdx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="space-y-2.5"
            >
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="text-accent">›</span> {selected.q}
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                <Typewriter text={selected.a} />
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selected.sources.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {QUESTIONS.map((q, i) => (
          <button
            key={q.q}
            onClick={() => setSelectedIdx(i)}
            className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors duration-fast ${
              selectedIdx === i
                ? "border-accent/60 bg-accent/10 text-foreground"
                : "border-border/60 bg-background/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {q.q}
          </button>
        ))}
        {selectedIdx !== null && (
          <button
            onClick={() => setSelectedIdx(null)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors duration-fast hover:border-foreground/40 hover:text-foreground"
            aria-label="Reset"
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            Reset
          </button>
        )}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
        Demo · hardcoded responses · real RAG ships in Issue #7
      </p>
    </div>
  );
}
