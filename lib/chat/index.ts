import type { RagIndex } from "@/lib/rag/types";
import {
  DEFAULT_SIMILARITY_THRESHOLD,
  REFUSAL_RESPONSE,
  SYSTEM_PROMPT,
} from "./system-prompt";
import type { ChatEvent, ChatRequest, LLMStreamer, Message } from "./types";

export interface ChatOptions {
  rag: RagIndex;
  llm: LLMStreamer;
  k?: number;
  similarityThreshold?: number;
  systemPrompt?: string;
  refusalResponse?: string;
}

export interface ChatService {
  ask(req: ChatRequest): AsyncIterable<ChatEvent>;
}

export function createChat(opts: ChatOptions): ChatService {
  const k = opts.k ?? 6;
  const threshold = opts.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  const systemPromptBase = opts.systemPrompt ?? SYSTEM_PROMPT;
  const refusal = opts.refusalResponse ?? REFUSAL_RESPONSE;

  return {
    async *ask(req: ChatRequest): AsyncIterable<ChatEvent> {
      const question = req.question.trim();
      if (!question) {
        yield { type: "error", error: "Empty question" };
        yield { type: "done" };
        return;
      }

      const chunks = await opts.rag.query(question, k, threshold);

      if (chunks.length === 0) {
        for (const word of refusal.split(/(\s+)/)) {
          yield { type: "token", token: word };
        }
        yield { type: "done" };
        return;
      }

      const context = chunks
        .map((c) => `[source: ${c.source}]\n${c.text}`)
        .join("\n\n");
      const sources = Array.from(new Set(chunks.map((c) => c.source)));
      const fullSystemPrompt = `${systemPromptBase}\n\n---\nContext:\n\n${context}`;
      const messages: Message[] = [
        ...(req.history ?? []),
        { role: "user", content: question },
      ];

      try {
        for await (const token of opts.llm.stream({
          systemPrompt: fullSystemPrompt,
          messages,
        })) {
          yield { type: "token", token };
        }
        yield { type: "sources", sources };
        yield { type: "done" };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "LLM call failed";
        yield { type: "error", error: message };
        yield { type: "done" };
      }
    },
  };
}

export type { ChatEvent, ChatRequest, LLMStreamer, Message } from "./types";
