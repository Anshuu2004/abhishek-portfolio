export const DEFAULT_CHUNK_SIZE = 800;
export const DEFAULT_OVERLAP = 100;

/**
 * Sliding-window text chunker. Splits into windows of `size` characters with
 * `overlap` characters carried into the next window. Short inputs return one
 * chunk equal to the input.
 */
export function chunkText(
  text: string,
  size = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP
): string[] {
  if (size <= 0) throw new Error("size must be > 0");
  if (overlap < 0 || overlap >= size) {
    throw new Error("overlap must be in [0, size)");
  }
  if (text.length <= size) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - overlap;
  }
  return chunks;
}
