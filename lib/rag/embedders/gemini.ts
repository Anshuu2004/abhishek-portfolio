import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Embedder } from "../types";

/**
 * Gemini embedding model. Defaults to `embedding-001` (768-dim) which is
 * the most universally available embedding endpoint on the v1beta API.
 * Pass a different model name if your account supports `text-embedding-004`.
 *
 * Throws if the API key is missing — fail loud rather than silently
 * shipping a non-functional index.
 */
export function createGeminiEmbedder(
  apiKey: string | undefined,
  modelName = "gemini-embedding-001"
): Embedder {
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY missing — set it in .env.local before building the RAG index"
    );
  }
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: modelName });

  return {
    async embed(text: string): Promise<number[]> {
      const result = await model.embedContent(text);
      return result.embedding.values;
    },
  };
}
