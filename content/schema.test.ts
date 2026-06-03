import { describe, expect, it } from "vitest";
import { ProjectSchema, PostSchema } from "./schema";

const validProject = {
  title: "Simption ERP",
  slug: "simption-erp",
  year: 2025,
  order: 1,
  summary:
    "A multi-tenant SaaS ERP for educational institutions, serving 1000+ tenants with isolated MySQL databases per tenant.",
  stack: ["Laravel 13", "Livewire 4", "MySQL", "Redis", "Tailwind"],
  repo: null,
  demo: "https://collegedemo.simption.com/",
  featured: true,
};

const validPost = {
  title: "Multi-tenant SaaS in Laravel 13",
  slug: "multi-tenant-laravel-13",
  date: "2026-04-12",
  summary:
    "Tenant resolution, schema isolation, and the Livewire serialization trap.",
  tags: ["laravel", "saas", "architecture"],
  readTime: 12,
  draft: false,
};

describe("ProjectSchema", () => {
  it("accepts a valid project frontmatter", () => {
    const result = ProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("rejects a project missing the title", () => {
    const { title: _omitted, ...withoutTitle } = validProject;
    const result = ProjectSchema.safeParse(withoutTitle);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("title"))).toBe(
        true
      );
    }
  });

  it("rejects a project missing the slug", () => {
    const { slug: _omitted, ...withoutSlug } = validProject;
    const result = ProjectSchema.safeParse(withoutSlug);
    expect(result.success).toBe(false);
  });

  it("rejects a project with a non-kebab-case slug", () => {
    const result = ProjectSchema.safeParse({
      ...validProject,
      slug: "Simption_ERP",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (i) =>
            i.path.includes("slug") &&
            i.message.toLowerCase().includes("kebab")
        )
      ).toBe(true);
    }
  });

  it("rejects a project with an unrealistic year", () => {
    const tooOld = ProjectSchema.safeParse({ ...validProject, year: 1999 });
    const tooNew = ProjectSchema.safeParse({ ...validProject, year: 2099 });
    expect(tooOld.success).toBe(false);
    expect(tooNew.success).toBe(false);
  });

  it("rejects a project with an empty stack", () => {
    const result = ProjectSchema.safeParse({ ...validProject, stack: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a project with an unknown field (strict mode)", () => {
    const result = ProjectSchema.safeParse({
      ...validProject,
      mysteryField: "should fail",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null repo (work projects with no public repo)", () => {
    const result = ProjectSchema.safeParse({ ...validProject, repo: null });
    expect(result.success).toBe(true);
  });

  it("accepts a missing demo (some projects have no live demo)", () => {
    const { demo: _omitted, ...withoutDemo } = validProject;
    const result = ProjectSchema.safeParse(withoutDemo);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid demo URL", () => {
    const result = ProjectSchema.safeParse({
      ...validProject,
      demo: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("PostSchema", () => {
  it("accepts a valid post frontmatter", () => {
    const result = PostSchema.safeParse(validPost);
    expect(result.success).toBe(true);
  });

  it("rejects a post missing the title", () => {
    const { title: _omitted, ...withoutTitle } = validPost;
    const result = PostSchema.safeParse(withoutTitle);
    expect(result.success).toBe(false);
  });

  it("rejects a post with non-kebab-case slug", () => {
    const result = PostSchema.safeParse({
      ...validPost,
      slug: "Multi Tenant Post",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a post with an invalid ISO date", () => {
    const result = PostSchema.safeParse({
      ...validPost,
      date: "April 12, 2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a post with zero or negative readTime", () => {
    const zero = PostSchema.safeParse({ ...validPost, readTime: 0 });
    const negative = PostSchema.safeParse({ ...validPost, readTime: -5 });
    expect(zero.success).toBe(false);
    expect(negative.success).toBe(false);
  });

  it("rejects a post with no tags", () => {
    const result = PostSchema.safeParse({ ...validPost, tags: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a post with an unknown field (strict mode)", () => {
    const result = PostSchema.safeParse({
      ...validPost,
      mysteryField: "fail",
    });
    expect(result.success).toBe(false);
  });

  it("defaults draft to false when omitted", () => {
    const { draft: _omitted, ...withoutDraft } = validPost;
    const result = PostSchema.safeParse(withoutDraft);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.draft).toBe(false);
    }
  });
});
