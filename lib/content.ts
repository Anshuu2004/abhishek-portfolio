import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import {
  PostSchema,
  ProjectSchema,
  type Post,
  type Project,
} from "@/content/schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type ProjectWithBody = Project & { body: string };
export type PostWithBody = Post & { body: string };

async function loadMdxFiles<T>(
  dir: string,
  schema: typeof ProjectSchema | typeof PostSchema,
  label: "project" | "post"
): Promise<(T & { body: string })[]> {
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  const mdx = files.filter((f) => f.endsWith(".mdx"));

  const out = await Promise.all(
    mdx.map(async (file) => {
      const source = await readFile(path.join(dir, file), "utf-8");
      const { data, content } = matter(source);
      const result = schema.safeParse(data);
      if (!result.success) {
        const issues = result.error.issues
          .map((i) => `  • ${i.path.join(".") || "<root>"}: ${i.message}`)
          .join("\n");
        throw new Error(
          `Invalid ${label} frontmatter in ${file}:\n${issues}`
        );
      }
      return { ...(result.data as T), body: content };
    })
  );
  return out;
}

export async function getAllProjects(): Promise<ProjectWithBody[]> {
  const projects = await loadMdxFiles<Project>(PROJECTS_DIR, ProjectSchema, "project");
  return projects.sort((a, b) => a.order - b.order);
}

export async function getProject(slug: string): Promise<ProjectWithBody | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getAllPosts(opts: { includeDrafts?: boolean } = {}): Promise<PostWithBody[]> {
  const posts = await loadMdxFiles<Post>(POSTS_DIR, PostSchema, "post");
  const filtered = opts.includeDrafts ? posts : posts.filter((p) => !p.draft);
  return filtered.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<PostWithBody | null> {
  const all = await getAllPosts({ includeDrafts: true });
  return all.find((p) => p.slug === slug) ?? null;
}
