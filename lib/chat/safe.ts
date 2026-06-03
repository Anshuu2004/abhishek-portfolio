import type { ChatEvent, ChatRequest } from "./types";
import type { ChatService } from "./index";

/**
 * Wraps a "real" ChatService with a "fallback" one. If the real service
 * errors BEFORE producing any tokens, the fallback takes over for the
 * whole response. If the real service errors AFTER producing tokens
 * (mid-stream), we emit the error and stop — falling back mid-stream
 * would produce a confusing mash-up.
 */
export function createSafeChat(opts: {
  real: ChatService;
  fallback: ChatService;
  onRealFailure?: (err: string) => void;
}): ChatService {
  return {
    async *ask(req: ChatRequest): AsyncIterable<ChatEvent> {
      let producedToken = false;
      let earlyError: string | null = null;

      try {
        for await (const event of opts.real.ask(req)) {
          if (event.type === "token") {
            producedToken = true;
            yield event;
            continue;
          }
          if (event.type === "error") {
            if (!producedToken) {
              earlyError = event.error;
              break;
            }
            // mid-stream error — emit and finish
            yield event;
            yield { type: "done" };
            return;
          }
          yield event;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown error";
        if (producedToken) {
          yield { type: "error", error: message };
          yield { type: "done" };
          return;
        }
        earlyError = message;
      }

      if (earlyError !== null) {
        opts.onRealFailure?.(earlyError);
        yield* opts.fallback.ask(req);
      }
    },
  };
}
