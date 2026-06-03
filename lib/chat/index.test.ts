import { describe, expect, it } from "vitest";

import { createChat } from "./index";
import { createStubStreamer } from "./llm/stub";
import type { RagIndex, Chunk } from "@/lib/rag/types";

function makeRag(chunks: Chunk[]): RagIndex {
  return {
    async build() {
      return chunks;
    },
    async query() {
      return chunks;
    },
  };
}

function makeChunk(overrides: Partial<Chunk> = {}): Chunk {
  return {
    docId: "doc",
    source: "test-source",
    text: "test chunk text",
    embedding: [],
    ...overrides,
  };
}

async function collect(events: AsyncIterable<unknown>): Promise<unknown[]> {
  const out: unknown[] = [];
  for await (const e of events) out.push(e);
  return out;
}

describe("createChat", () => {
  it("yields refusal when RAG returns zero chunks (off-topic)", async () => {
    const rag = makeRag([]);
    const llm = createStubStreamer({ tokens: ["should not be called"] });
    const chat = createChat({ rag, llm });

    const events = await collect(chat.ask({ question: "tell me a joke" }));
    const tokens = events.filter(
      (e): e is { type: "token"; token: string } =>
        (e as { type: string }).type === "token"
    );
    const tokensText = tokens.map((t) => t.token).join("");

    expect(tokensText).toContain("portfolio agent");
    expect(tokensText).toContain("only answer");
    expect(events.at(-1)).toEqual({ type: "done" });
  });

  it("includes RAG chunks in the system prompt with source labels", async () => {
    const chunks = [
      makeChunk({ source: "projects/simption-erp", text: "Tenants resolve via subdomain." }),
      makeChunk({ source: "resume.experience[0]", text: "Built Simption ERP at SimptionTech." }),
    ];
    const rag = makeRag(chunks);
    const capture = { systemPrompt: "", messages: [] as { role: string; content: string }[] };
    const llm = createStubStreamer({ tokens: ["ok"], capture });
    const chat = createChat({ rag, llm });

    await collect(chat.ask({ question: "what is simption erp?" }));

    expect(capture.systemPrompt).toContain("[source: projects/simption-erp]");
    expect(capture.systemPrompt).toContain("Tenants resolve via subdomain.");
    expect(capture.systemPrompt).toContain("[source: resume.experience[0]]");
  });

  it("appends the current question to history as the last user message", async () => {
    const rag = makeRag([makeChunk()]);
    const capture = { systemPrompt: "", messages: [] as { role: string; content: string }[] };
    const llm = createStubStreamer({ tokens: ["ok"], capture });
    const chat = createChat({ rag, llm });

    const history = [
      { role: "user" as const, content: "what's your stack?" },
      { role: "assistant" as const, content: "Next.js, Laravel, Python..." },
    ];
    await collect(chat.ask({ question: "did you use OpenVINO?", history }));

    expect(capture.messages).toHaveLength(3);
    expect(capture.messages[0]).toEqual({ role: "user", content: "what's your stack?" });
    expect(capture.messages[2]).toEqual({ role: "user", content: "did you use OpenVINO?" });
  });

  it("emits tokens then a sources event then done on the happy path", async () => {
    const chunks = [
      makeChunk({ source: "projects/codeheal" }),
      makeChunk({ source: "projects/codeheal" }), // duplicate source -> deduped
      makeChunk({ source: "resume.experience[0]" }),
    ];
    const rag = makeRag(chunks);
    const llm = createStubStreamer({ tokens: ["Code", "Heal", " is..."] });
    const chat = createChat({ rag, llm });

    const events = await collect(chat.ask({ question: "what is codeheal?" }));
    const sourcesEvent = events.find(
      (e): e is { type: "sources"; sources: string[] } =>
        (e as { type: string }).type === "sources"
    );
    expect(sourcesEvent?.sources).toEqual([
      "projects/codeheal",
      "resume.experience[0]",
    ]);
    expect(events.at(-1)).toEqual({ type: "done" });

    const tokens = events
      .filter(
        (e): e is { type: "token"; token: string } =>
          (e as { type: string }).type === "token"
      )
      .map((t) => t.token)
      .join("");
    expect(tokens).toBe("CodeHeal is...");
  });

  it("emits an error event when the LLM throws", async () => {
    const rag = makeRag([makeChunk()]);
    const llm = createStubStreamer({ throwError: "rate limited" });
    const chat = createChat({ rag, llm });

    const events = await collect(chat.ask({ question: "anything" }));
    const errEvent = events.find(
      (e): e is { type: "error"; error: string } =>
        (e as { type: string }).type === "error"
    );
    expect(errEvent?.error).toBe("rate limited");
    expect(events.at(-1)).toEqual({ type: "done" });
  });

  it("rejects empty questions with an error event", async () => {
    const rag = makeRag([makeChunk()]);
    const llm = createStubStreamer({ tokens: ["ignored"] });
    const chat = createChat({ rag, llm });

    const events = await collect(chat.ask({ question: "   " }));
    const errEvent = events.find(
      (e): e is { type: "error"; error: string } =>
        (e as { type: string }).type === "error"
    );
    expect(errEvent?.error).toMatch(/empty/i);
  });
});
