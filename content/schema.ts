import { z } from "zod";

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const CURRENT_YEAR = new Date().getFullYear();

export const ProjectSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().regex(KEBAB_CASE, "slug must be kebab-case"),
    year: z.number().int().min(2020).max(CURRENT_YEAR + 1),
    order: z.number().int().min(1),
    summary: z.string().min(1),
    stack: z.array(z.string().min(1)).min(1),
    repo: z.url().nullable(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
  })
  .strict();

export const PostSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().regex(KEBAB_CASE, "slug must be kebab-case"),
    date: z
      .string()
      .regex(ISO_DATE, "date must be ISO YYYY-MM-DD")
      .refine(
        (d) => !Number.isNaN(Date.parse(d)),
        "date must be a valid calendar date"
      ),
    summary: z.string().min(1),
    tags: z.array(z.string().min(1)).min(1),
    readTime: z.number().int().positive(),
    draft: z.boolean().default(false),
  })
  .strict();

export type Project = z.infer<typeof ProjectSchema>;
export type Post = z.infer<typeof PostSchema>;
