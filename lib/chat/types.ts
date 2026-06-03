export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface LLMStreamer {
  /**
   * Streams the assistant's response token-by-token (or chunk-by-chunk).
   * Each yielded string is appended to the visible answer.
   */
  stream(opts: {
    systemPrompt: string;
    messages: Message[];
  }): AsyncIterable<string>;
}

export interface ChatRequest {
  question: string;
  history?: Message[];
}

/**
 * Each yielded event is either a token to append, a final source list, an
 * error to display inline, or a `done` marker signalling completion.
 */
export type ChatEvent =
  | { type: "token"; token: string }
  | { type: "sources"; sources: string[] }
  | { type: "error"; error: string }
  | { type: "done" };
