export interface Doc {
  /** Stable unique identifier for the document */
  id: string;
  /** Human-readable origin (e.g. "projects/simption-erp", "resume.experience[0]") */
  source: string;
  /** Full text content to index */
  text: string;
  /** Optional structured metadata kept on every derived chunk */
  meta?: Record<string, unknown>;
}

export interface Chunk {
  docId: string;
  source: string;
  text: string;
  embedding: number[];
  meta?: Record<string, unknown>;
}

export interface Embedder {
  embed(text: string): Promise<number[]>;
}

export interface RagIndex {
  /**
   * Chunks + embeds every doc, persists via the `save` callback if provided,
   * returns the in-memory chunks. Subsequent `query` calls use the cached
   * chunks until a load callback is supplied.
   */
  build(docs: Doc[]): Promise<Chunk[]>;
  /**
   * Embeds the question, ranks all chunks by cosine similarity, returns the
   * top `k` (default 6) above the `threshold` (if set). Empty array when no
   * chunk passes the threshold.
   */
  query(question: string, k?: number, threshold?: number): Promise<Chunk[]>;
}
