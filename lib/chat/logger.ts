/**
 * Anonymous chat-question logger. Writes one structured JSON line per call
 * to stdout — works locally (read in terminal) and on Vercel (read in their
 * logs dashboard). Contains NO IPs, NO user-agents, NO cookies, NO user IDs.
 *
 * The point is to learn what recruiters ask, not to track them.
 */

export interface ChatLogEntry {
  ts: string;
  question: string;
  mode: "live" | "demo";
  sources: string[];
  fallback_used: boolean;
  /** Truncated answer preview (for offline review of quality). */
  answer_preview?: string;
  /** Error from the real LLM if fallback was triggered. */
  real_error?: string | null;
}

export function logChat(entry: ChatLogEntry) {
  const line = JSON.stringify({ type: "chat", ...entry });
  // Single line, stdout — consumable by Vercel logs and local tail.
  // Never use console.error here — that classes as error in some hosts.
  // eslint-disable-next-line no-console
  console.log(line);
}
