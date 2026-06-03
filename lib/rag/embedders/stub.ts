import type { Embedder } from "../types";

/**
 * Test embedder: returns a vector from a map. Throws on missing keys so
 * tests fail fast on unexpected inputs.
 */
export function createStubEmbedder(map: Map<string, number[]>): Embedder {
  return {
    async embed(text: string) {
      const v = map.get(text);
      if (!v) {
        throw new Error(
          `stub embedder: no embedding for ${JSON.stringify(text.slice(0, 60))}`
        );
      }
      return [...v];
    },
  };
}
