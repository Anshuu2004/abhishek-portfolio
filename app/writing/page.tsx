import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getAllPosts } from "@/lib/content";
import { FadeUp } from "@/components/motion/FadeUp";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Technical writing — architecture, benchmarks, and decisions from real production work.",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function WritingPage() {
  const posts = await getAllPosts();

  return (
    <section className="space-y-12">
      <header className="space-y-3">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Writing · {posts.length} post{posts.length === 1 ? "" : "s"}
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Engineering writing
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Architecture writeups, benchmarks, and the decisions behind real
          production work — not "10 tips for React".
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          No posts yet — first one lands in Issue #9.
        </p>
      ) : (
        <ul className="divide-y divide-border/60 border-y border-border/60">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <FadeUp delay={i * 0.05}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="group block py-6 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <div className="space-y-2">
                      <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground group-hover:text-accent">
                        {post.title}
                      </h2>
                      <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
                        {post.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                        <span>{formatDate(post.date)}</span>
                        <span aria-hidden className="text-border">·</span>
                        <span>{post.readTime} min read</span>
                        {post.tags.length > 0 && (
                          <>
                            <span aria-hidden className="text-border">·</span>
                            <span>{post.tags.join(" · ")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
                      aria-hidden
                    />
                  </div>
                </Link>
              </FadeUp>
            </li>
          ))}
        </ul>
      )}

      {posts.length > 0 && posts.length < 4 && (
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {4 - posts.length} more deep technical post
          {4 - posts.length === 1 ? "" : "s"} land in Issue #10
        </p>
      )}
    </section>
  );
}
