import { chunkText, DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP } from "./chunker";
import { cosineSimilarity } from "./similarity";
import type { Chunk, Doc, Embedder, RagIndex } from "./types";

export interface RagIndexOptions {
  embedder: Embedder;
  /** Loads previously persisted chunks (e.g. read JSON from disk). */
  load?: () => Promise<Chunk[]>;
  /** Persists newly built chunks (e.g. write JSON to disk). */
  save?: (chunks: Chunk[]) => Promise<void>;
  chunkSize?: number;
  overlap?: number;
}

export function createRagIndex(opts: RagIndexOptions): RagIndex {
  const { embedder, load, save } = opts;
  const chunkSize = opts.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = opts.overlap ?? DEFAULT_OVERLAP;
  let cached: Chunk[] | null = null;

  async function ensureLoaded(): Promise<Chunk[]> {
    if (cached) return cached;
    if (load) {
      cached = await load();
      return cached;
    }
    throw new Error(
      "RagIndex: no chunks available — call build() first or provide a load() option"
    );
  }

  return {
    async build(docs: Doc[]): Promise<Chunk[]> {
      const chunks: Chunk[] = [];
      for (const doc of docs) {
        const pieces = chunkText(doc.text, chunkSize, overlap);
        for (const text of pieces) {
          const embedding = await embedder.embed(text);
          chunks.push({
            docId: doc.id,
            source: doc.source,
            text,
            embedding,
            meta: doc.meta,
          });
        }
      }
      cached = chunks;
      if (save) await save(chunks);
      return chunks;
    },

    async query(
      question: string,
      k = 6,
      threshold?: number
    ): Promise<Chunk[]> {
      const chunks = await ensureLoaded();
      if (chunks.length === 0) return [];
      const qVec = await embedder.embed(question);
      const scored = chunks.map((chunk) => ({
        chunk,
        score: cosineSimilarity(qVec, chunk.embedding),
      }));
      scored.sort((a, b) => b.score - a.score);
      const filtered =
        threshold !== undefined
          ? scored.filter((s) => s.score >= threshold)
          : scored;
      return filtered.slice(0, k).map((s) => s.chunk);
    },
  };
}

export type { Doc, Chunk, Embedder, RagIndex } from "./types";
