import type { LLMStreamer } from "../types";

interface StubOpts {
  tokens?: string[];
  throwError?: string;
  capture?: { systemPrompt: string; messages: { role: string; content: string }[] };
}

/**
 * Test LLM streamer. Either yields the provided tokens, or throws.
 * If `capture` is passed, the most-recent call's prompt + messages get
 * mutated onto it so tests can assert what was sent.
 */
export function createStubStreamer(opts: StubOpts = {}): LLMStreamer {
  return {
    async *stream({ systemPrompt, messages }) {
      if (opts.capture) {
        opts.capture.systemPrompt = systemPrompt;
        opts.capture.messages = messages.map((m) => ({ ...m }));
      }
      if (opts.throwError) {
        throw new Error(opts.throwError);
      }
      for (const t of opts.tokens ?? []) {
        yield t;
      }
    },
  };
}
