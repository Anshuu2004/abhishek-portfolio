import { describe, expect, it, vi } from "vitest";

import { createSafeChat } from "./safe";
import type { ChatEvent, ChatRequest } from "./types";
import type { ChatService } from "./index";

function makeChat(eventBatches: ChatEvent[][]): ChatService {
  let calls = 0;
  return {
    async *ask(_req: ChatRequest) {
      const batch = eventBatches[calls++] ?? [];
      for (const e of batch) yield e;
    },
  };
}

async function collect(events: AsyncIterable<ChatEvent>): Promise<ChatEvent[]> {
  const out: ChatEvent[] = [];
  for await (const e of events) out.push(e);
  return out;
}

describe("createSafeChat", () => {
  it("passes through events from the real service on the happy path", async () => {
    const real = makeChat([
      [
        { type: "token", token: "hello" },
        { type: "token", token: " world" },
        { type: "sources", sources: ["test"] },
        { type: "done" },
      ],
    ]);
    const fallback = makeChat([[{ type: "token", token: "FALLBACK" }]]);
    const onFail = vi.fn();

    const safe = createSafeChat({ real, fallback, onRealFailure: onFail });
    const events = await collect(safe.ask({ question: "hi" }));

    const tokens = events
      .filter((e): e is { type: "token"; token: string } => e.type === "token")
      .map((t) => t.token)
      .join("");
    expect(tokens).toBe("hello world");
    expect(onFail).not.toHaveBeenCalled();
  });

  it("falls back to fallback service when real errors before any token", async () => {
    const real = makeChat([
      [
        { type: "error", error: "rate limited" },
        { type: "done" },
      ],
    ]);
    const fallback = makeChat([
      [
        { type: "token", token: "FALLBACK " },
        { type: "token", token: "ANSWER" },
        { type: "done" },
      ],
    ]);
    const onFail = vi.fn();

    const safe = createSafeChat({ real, fallback, onRealFailure: onFail });
    const events = await collect(safe.ask({ question: "hi" }));

    const tokens = events
      .filter((e): e is { type: "token"; token: string } => e.type === "token")
      .map((t) => t.token)
      .join("");
    expect(tokens).toBe("FALLBACK ANSWER");
    expect(onFail).toHaveBeenCalledWith("rate limited");
  });

  it("does NOT fall back mid-stream when real errors after producing tokens", async () => {
    const real = makeChat([
      [
        { type: "token", token: "partial " },
        { type: "error", error: "network glitch" },
        { type: "done" },
      ],
    ]);
    const fallback = makeChat([[{ type: "token", token: "FALLBACK" }]]);
    const onFail = vi.fn();

    const safe = createSafeChat({ real, fallback, onRealFailure: onFail });
    const events = await collect(safe.ask({ question: "hi" }));

    const tokens = events
      .filter((e): e is { type: "token"; token: string } => e.type === "token")
      .map((t) => t.token)
      .join("");
    expect(tokens).toBe("partial ");
    expect(events.some((e) => e.type === "error")).toBe(true);
    expect(onFail).not.toHaveBeenCalled();
  });

  it("falls back when real throws synchronously / asynchronously before any token", async () => {
    const real: ChatService = {
      async *ask() {
        throw new Error("immediate failure");
      },
    };
    const fallback = makeChat([
      [
        { type: "token", token: "OK" },
        { type: "done" },
      ],
    ]);
    const onFail = vi.fn();

    const safe = createSafeChat({ real, fallback, onRealFailure: onFail });
    const events = await collect(safe.ask({ question: "hi" }));

    const tokens = events
      .filter((e): e is { type: "token"; token: string } => e.type === "token")
      .map((t) => t.token)
      .join("");
    expect(tokens).toBe("OK");
    expect(onFail).toHaveBeenCalledWith("immediate failure");
  });
});
