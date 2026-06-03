import { readFile } from "node:fs/promises";
import path from "node:path";

import { createRagIndex } from "@/lib/rag";
import { createGeminiEmbedder } from "@/lib/rag/embedders/gemini";
import { createChat } from "@/lib/chat";
import { createGeminiStreamer } from "@/lib/chat/llm/gemini";
import { createFallbackChat } from "@/lib/chat/fallback";
import { createSafeChat } from "@/lib/chat/safe";
import { logChat } from "@/lib/chat/logger";
import type { ChatRequest, ChatService } from "@/lib/chat";
import type { Chunk } from "@/lib/rag/types";

export const runtime = "nodejs";

async function loadIndex(): Promise<Chunk[] | null> {
  const indexPath = path.join(process.cwd(), "data", "rag-index.json");
  try {
    const source = await readFile(indexPath, "utf-8");
    return JSON.parse(source) as Chunk[];
  } catch {
    return null;
  }
}

async function makeChat(): Promise<{
  chat: ChatService;
  mode: "live" | "demo";
  realFailureRef: { error: string | null };
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  const chunks = await loadIndex();
  const realFailureRef = { error: null as string | null };

  if (!apiKey) {
    return {
      chat: createFallbackChat({ reason: "no-key" }),
      mode: "demo",
      realFailureRef,
    };
  }
  if (!chunks) {
    return {
      chat: createFallbackChat({ reason: "no-index" }),
      mode: "demo",
      realFailureRef,
    };
  }

  const embedder = createGeminiEmbedder(apiKey);
  const llm = createGeminiStreamer(apiKey);
  const rag = createRagIndex({ embedder, load: async () => chunks });
  const real = createChat({ rag, llm });
  const fallback = createFallbackChat({ reason: "rate-limit" });

  const safe = createSafeChat({
    real,
    fallback,
    onRealFailure: (err) => {
      realFailureRef.error = err;
    },
  });

  return { chat: safe, mode: "live", realFailureRef };
}

export async function POST(req: Request) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body?.question) {
    return new Response(JSON.stringify({ error: "question required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { chat, mode, realFailureRef } = await makeChat();

  // Accumulators for the log entry (built up as the stream proceeds).
  const collectedSources: string[] = [];
  const previewChunks: string[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );

      send({ type: "mode", mode });

      try {
        for await (const event of chat.ask(body)) {
          if (event.type === "token" && previewChunks.length < 32) {
            previewChunks.push(event.token);
          }
          if (event.type === "sources") {
            collectedSources.push(...event.sources);
          }
          send(event);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown error";
        send({ type: "error", error: message });
        send({ type: "done" });
      } finally {
        controller.close();

        // Anonymous log entry — runs after the stream is closed.
        // No IPs, user-agents, cookies, or identifiers of any kind.
        logChat({
          ts: new Date().toISOString(),
          question: body.question,
          mode,
          sources: Array.from(new Set(collectedSources)),
          fallback_used: realFailureRef.error !== null,
          real_error: realFailureRef.error,
          answer_preview: previewChunks.join("").slice(0, 240),
        });
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
