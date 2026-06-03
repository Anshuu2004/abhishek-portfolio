import { describe, expect, it } from "vitest";

import { createRagIndex } from "./index";
import { chunkText } from "./chunker";
import { cosineSimilarity } from "./similarity";
import { createStubEmbedder } from "./embedders/stub";
import type { Chunk, Doc } from "./types";

describe("chunkText", () => {
  it("returns a single chunk if text fits the window", () => {
    expect(chunkText("short", 800, 100)).toEqual(["short"]);
  });

  it("splits long text into overlapping windows", () => {
    const text = "abcdefghijklmnopqrstuvwxyz".repeat(50); // 1300 chars
    const chunks = chunkText(text, 500, 50);
    expect(chunks.length).toBeGreaterThanOrEqual(3);
    // Adjacent chunks overlap by exactly `overlap` characters
    expect(chunks[1].startsWith(chunks[0].slice(-50))).toBe(true);
  });

  it("throws on invalid size or overlap", () => {
    expect(() => chunkText("x", 0, 0)).toThrow();
    expect(() => chunkText("x", 10, 10)).toThrow();
    expect(() => chunkText("x", 10, -1)).toThrow();
  });
});

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBe(1);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
  });

  it("returns -1 for opposite vectors", () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBe(-1);
  });

  it("throws on length mismatch", () => {
    expect(() => cosineSimilarity([1, 2], [1])).toThrow();
  });
});

describe("createRagIndex", () => {
  const docs: Doc[] = [
    { id: "a", source: "doc-a", text: "alpha bravo" },
    { id: "b", source: "doc-b", text: "delta echo" },
    { id: "c", source: "doc-c", text: "alpha gamma" },
  ];

  function makeEmbedder() {
    return createStubEmbedder(
      new Map([
        ["alpha bravo", [1, 0, 0]],
        ["delta echo", [0, 1, 0]],
        ["alpha gamma", [0.95, 0, 0.3]],
        ["alpha", [1, 0, 0]],
        ["alpha bravo charlie", [0.9, 0, 0.1]],
      ])
    );
  }

  it("build produces one chunk per short doc", async () => {
    const index = createRagIndex({ embedder: makeEmbedder() });
    const chunks = await index.build(docs);
    expect(chunks).toHaveLength(3);
    expect(chunks.map((c) => c.docId).sort()).toEqual(["a", "b", "c"]);
  });

  it("query returns chunks sorted by similarity (highest first)", async () => {
    const index = createRagIndex({ embedder: makeEmbedder() });
    await index.build(docs);
    const results = await index.query("alpha", 3);
    expect(results[0].docId).toBe("a"); // perfect match
    expect(results[1].docId).toBe("c"); // partial match
    expect(results[2].docId).toBe("b"); // no match
  });

  it("query honours threshold and returns empty when nothing passes", async () => {
    const index = createRagIndex({ embedder: makeEmbedder() });
    await index.build(docs);
    const results = await index.query("alpha", 6, 0.99);
    expect(results).toHaveLength(1); // only the perfect match passes
    expect(results[0].docId).toBe("a");

    const noneMatch = await index.query("alpha", 6, 1.1);
    expect(noneMatch).toHaveLength(0);
  });

  it("query throws if no chunks were built and no load is provided", async () => {
    const index = createRagIndex({ embedder: makeEmbedder() });
    await expect(index.query("alpha")).rejects.toThrow(/build\(\)/);
  });

  it("persists chunks via save and re-loads via load (round-trip)", async () => {
    let persisted: Chunk[] | null = null;
    const embedder = makeEmbedder();

    const writer = createRagIndex({
      embedder,
      save: async (chunks) => {
        persisted = chunks;
      },
    });
    await writer.build(docs);
    expect(persisted).not.toBeNull();
    expect(persisted).toHaveLength(3);

    const reader = createRagIndex({
      embedder,
      load: async () => persisted!,
    });
    const results = await reader.query("alpha", 1);
    expect(results[0].docId).toBe("a");
  });

  it("chunks long docs and preserves doc identity", async () => {
    const longText = "alpha bravo charlie".repeat(60); // ~1140 chars
    const embedder = createStubEmbedder(
      // build will chunk this; we need embeddings for each piece.
      // Use a single embedding for any text starting with "alpha" — simplest stub for this test
      new Map()
    );
    // Build a stub that returns the same vector for any input
    const universalEmbedder = {
      async embed() {
        return [1, 0, 0];
      },
    };
    const index = createRagIndex({
      embedder: universalEmbedder,
      chunkSize: 200,
      overlap: 20,
    });
    const longDocs: Doc[] = [
      { id: "big", source: "big", text: longText },
    ];
    const chunks = await index.build(longDocs);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((c) => c.docId === "big")).toBe(true);
  });
});
