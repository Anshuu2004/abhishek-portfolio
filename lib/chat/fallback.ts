import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ChatEvent, ChatRequest } from "./types";
import type { ChatService } from "./index";

interface FaqEntry {
  match: string;
  answer: string;
  sources: string[];
}

interface FaqFile {
  entries: FaqEntry[];
  demoDefault: string;
  refusal: string;
}

let cached: FaqFile | null = null;

async function loadFaq(): Promise<FaqFile> {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "content", "faq.json");
  const source = await readFile(filePath, "utf-8");
  cached = JSON.parse(source) as FaqFile;
  return cached;
}

export interface FallbackOptions {
  /** Why we're in fallback. Drives the user-facing wording. */
  reason: "no-key" | "no-index" | "rate-limit" | "error";
  /** Milliseconds between token yields. Lower = faster stream. Default 22. */
  tokenIntervalMs?: number;
  /** Override the FAQ file for tests. */
  faq?: FaqFile;
}

async function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function createFallbackChat(opts: FallbackOptions): ChatService {
  const interval = opts.tokenIntervalMs ?? 22;

  return {
    async *ask(req: ChatRequest): AsyncIterable<ChatEvent> {
      const question = req.question.trim();
      if (!question) {
        yield { type: "error", error: "Empty question" };
        yield { type: "done" };
        return;
      }

      const faq = opts.faq ?? (await loadFaq());

      const hit = faq.entries.find((e) =>
        new RegExp(e.match, "i").test(question)
      );
      const isPortfolioish =
        /(abhishek|portfolio|project|build|engineer|stack|skill|work)/i.test(
          question
        );

      let answer: string;
      let sources: string[];
      if (hit) {
        answer = hit.answer;
        sources = hit.sources;
      } else if (isPortfolioish) {
        answer = faq.demoDefault;
        sources = ["demo-mode"];
      } else {
        answer = faq.refusal;
        sources = [];
      }

      const tokens = answer.match(/\S+\s*/g) ?? [answer];
      for (const t of tokens) {
        yield { type: "token", token: t };
        if (interval > 0) await delay(interval);
      }
      if (sources.length > 0) {
        yield { type: "sources", sources };
      }
      yield { type: "done" };
    },
  };
}
