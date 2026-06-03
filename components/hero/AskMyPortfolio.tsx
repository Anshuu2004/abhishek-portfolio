"use client";

import { type ComponentProps, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, CornerDownLeft, Loader2, RotateCcw } from "lucide-react";

import { PromptSuggestion } from "@/components/ui/prompt-suggestion";

const SAMPLE_QUESTIONS = [
  "What's Simption ERP?",
  "Did you work with OpenVINO?",
  "Show me CodeHeal's architecture",
  "Is Abhishek hiring-ready?",
];

// Citation slugs the agent can return, mapped to their on-site pages. Bare
// slugs are accepted too (live RAG sources) — anything else (e.g. resume.*)
// renders as a plain, non-clickable chip.
const PROJECT_SLUGS = new Set([
  "simption-erp",
  "codeheal",
  "driveaware",
  "ai-question-paper-generator",
  "brosplit",
]);
const POST_SLUGS = new Set([
  "multi-tenant-laravel-13",
  "openvino-fp16-benchmarks",
  "codeheal-rag-pipeline",
  "brosplit-debt-simplification",
]);

type LinkHref = ComponentProps<typeof Link>["href"];

function sourceHref(source: string): LinkHref | null {
  if (source.startsWith("projects/")) return `/work/${source.slice(9)}` as LinkHref;
  if (source.startsWith("posts/")) return `/writing/${source.slice(6)}` as LinkHref;
  const bare = source.split("/").pop() ?? source;
  if (PROJECT_SLUGS.has(bare)) return `/work/${bare}` as LinkHref;
  if (POST_SLUGS.has(bare)) return `/writing/${bare}` as LinkHref;
  return null;
}

type Mode = "idle" | "streaming" | "done" | "error";

export function AskMyPortfolio() {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("idle");
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState<boolean | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function submit(q: string) {
    if (!q.trim()) return;
    if (mode === "streaming") return;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setQuestion(q);
    setAnswer("");
    setSources([]);
    setError(null);
    setMode("streaming");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const reader = res.body?.getReader();
      if (!reader) throw new Error("no stream body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const segments = buffer.split("\n\n");
        buffer = segments.pop() ?? "";

        for (const segment of segments) {
          const line = segment.trimStart();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "mode") {
              setDemoMode(evt.mode === "demo");
            } else if (evt.type === "token") {
              setAnswer((prev) => prev + evt.token);
            } else if (evt.type === "sources") {
              setSources(evt.sources);
            } else if (evt.type === "error") {
              setError(evt.error);
            }
          } catch {
            // ignore malformed segments
          }
        }
      }
      setMode("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "stream failed");
      setMode("error");
    }
  }

  function reset() {
    abortRef.current?.abort();
    setQuestion(null);
    setAnswer("");
    setSources([]);
    setError(null);
    setMode("idle");
    setInput("");
  }

  const isStreaming = mode === "streaming";

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30 p-5 transition-colors duration-fast hover:border-foreground/40 sm:p-6">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-accent to-transparent opacity-60"
      />

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Ask my portfolio · live agent
        </p>
        {demoMode !== null && (
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
              demoMode ? "text-muted-foreground" : "text-accent"
            }`}
          >
            {demoMode ? "Demo mode" : "Live · Gemini"}
          </span>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="mt-4 flex items-stretch gap-2"
      >
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-accent">
            ›
          </span>
          <input
            type="text"
            placeholder="Ask anything about Abhishek's work…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            className="h-10 w-full rounded-md border border-border bg-background/60 pl-7 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          aria-label="Submit"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/60 text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ArrowUp className="h-4 w-4" aria-hidden />
          )}
        </button>
      </form>

      {/* Idle affordance — suggestions sit directly under the input so a
          first-time visitor immediately sees what they can ask. */}
      {!question && (
        <div className="mt-3.5 space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
            Try asking
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q) => (
              <PromptSuggestion
                key={q}
                onClick={() => submit(q)}
                disabled={isStreaming}
                icon={<CornerDownLeft className="h-3 w-3" aria-hidden />}
              >
                {q}
              </PromptSuggestion>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 min-h-[5.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {question ? (
            <motion.div
              key={`a-${question}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-2.5"
            >
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="text-accent">›</span> {question}
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {answer}
                {isStreaming && (
                  <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.18em] bg-accent" />
                )}
              </p>
              {sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    Sources
                  </span>
                  {sources.map((s) => {
                    const href = sourceHref(s);
                    const base =
                      "rounded-sm border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground";
                    return href ? (
                      <Link
                        key={s}
                        href={href}
                        className={`${base} transition-colors duration-fast hover:border-accent/50 hover:text-foreground`}
                      >
                        {s}
                      </Link>
                    ) : (
                      <span key={s} className={base}>
                        {s}
                      </span>
                    );
                  })}
                </div>
              )}
              {error && (
                <p className="font-mono text-xs text-accent/80">⚠ {error}</p>
              )}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              Ask anything about Abhishek&apos;s work — production multi-tenant
              SaaS, AI agents, edge ML, his stack. RAG-backed when{" "}
              <code className="rounded-sm border border-border/60 bg-background/60 px-1 py-0.5 font-mono text-[11px]">
                GEMINI_API_KEY
              </code>{" "}
              is set, demo mode otherwise.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* After a question: offer the same prompts as follow-ups, plus reset. */}
      {question && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {SAMPLE_QUESTIONS.map((q) => (
            <PromptSuggestion
              key={q}
              onClick={() => submit(q)}
              disabled={isStreaming}
              icon={<CornerDownLeft className="h-3 w-3" aria-hidden />}
            >
              {q}
            </PromptSuggestion>
          ))}
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors duration-fast hover:border-foreground/40 hover:text-foreground"
            aria-label="Reset"
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
