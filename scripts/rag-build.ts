/**
 * Build the RAG index from content/ → data/rag-index.json.
 *
 * Requires GEMINI_API_KEY to be set (.env.local or shell env).
 *
 * Sources indexed:
 *   - content/resume.json   (summary + experience bullets + education)
 *   - content/projects/*.mdx
 *   - content/posts/*.mdx
 *
 * Each doc is chunked (~800 chars with 100-char overlap), embedded via
 * Gemini text-embedding-004, and stored as JSON in data/rag-index.json.
 *
 * Run: npm run rag:build
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { createRagIndex } from "../lib/rag";
import { createGeminiEmbedder } from "../lib/rag/embedders/gemini";
import type { Doc } from "../lib/rag/types";

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, "data", "rag-index.json");

interface ResumeFile {
  summary?: string;
  education?: Array<{ school: string; degree: string; start: string; end: string }>;
  experience?: Array<{
    company: string;
    role: string;
    bullets?: string[];
  }>;
  skills?: Record<string, string[]>;
}

async function readMdxDocs(dir: string, type: string): Promise<Doc[]> {
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  const docs: Doc[] = [];
  for (const f of files) {
    if (!f.endsWith(".mdx")) continue;
    const source = await readFile(path.join(dir, f), "utf-8");
    const { data, content } = matter(source);
    const slug = typeof data.slug === "string" ? data.slug : f.replace(/\.mdx$/, "");
    const title = typeof data.title === "string" ? data.title : slug;
    const summary = typeof data.summary === "string" ? data.summary : "";
    docs.push({
      id: `${type}:${slug}`,
      source: `${type}s/${slug}`,
      text: `${title}\n\n${summary}\n\n${content}`,
      meta: { type, slug, title },
    });
  }
  return docs;
}

async function readResumeDocs(): Promise<Doc[]> {
  const filePath = path.join(ROOT, "content", "resume.json");
  const source = await readFile(filePath, "utf-8");
  const resume: ResumeFile = JSON.parse(source);

  const docs: Doc[] = [];
  if (resume.summary) {
    docs.push({
      id: "resume:summary",
      source: "resume.summary",
      text: `Resume summary: ${resume.summary}`,
      meta: { type: "resume", section: "summary" },
    });
  }
  resume.experience?.forEach((exp, i) => {
    (exp.bullets ?? []).forEach((bullet, j) => {
      docs.push({
        id: `resume:experience:${i}:${j}`,
        source: `resume.experience[${i}].bullets[${j}]`,
        text: `At ${exp.company} (${exp.role}): ${bullet}`,
        meta: { type: "resume", section: "experience", company: exp.company },
      });
    });
  });
  resume.education?.forEach((edu, i) => {
    docs.push({
      id: `resume:education:${i}`,
      source: `resume.education[${i}]`,
      text: `${edu.degree} at ${edu.school}, ${edu.start}–${edu.end}.`,
      meta: { type: "resume", section: "education" },
    });
  });
  if (resume.skills) {
    Object.entries(resume.skills).forEach(([category, items]) => {
      docs.push({
        id: `resume:skills:${category}`,
        source: `resume.skills.${category}`,
        text: `${category}: ${items.join(", ")}.`,
        meta: { type: "resume", section: "skills", category },
      });
    });
  }
  return docs;
}

async function main() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error(
      "GEMINI_API_KEY missing — set it in .env.local before building the RAG index."
    );
    process.exit(1);
  }

  console.log("Reading content…");
  const [projectDocs, postDocs, resumeDocs] = await Promise.all([
    readMdxDocs(path.join(ROOT, "content", "projects"), "project"),
    readMdxDocs(path.join(ROOT, "content", "posts"), "post"),
    readResumeDocs(),
  ]);
  const docs = [...projectDocs, ...postDocs, ...resumeDocs];
  console.log(
    `Read ${projectDocs.length} projects, ${postDocs.length} posts, ${resumeDocs.length} resume snippets (${docs.length} total)`
  );

  const embedder = createGeminiEmbedder(key);
  const index = createRagIndex({
    embedder,
    save: async (chunks) => {
      await mkdir(path.dirname(INDEX_PATH), { recursive: true });
      await writeFile(INDEX_PATH, JSON.stringify(chunks));
    },
  });

  console.log("Embedding…");
  const start = Date.now();
  const chunks = await index.build(docs);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`Wrote ${chunks.length} chunks in ${elapsed}s to ${INDEX_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
