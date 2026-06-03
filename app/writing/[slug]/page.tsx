import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllPosts, getPost } from "@/lib/content";
import { makePostMdxComponents } from "@/lib/mdx-post-components";
import { FadeUp } from "@/components/motion/FadeUp";

export async function generateStaticParams() {
  const posts = await getAllPosts({ includeDrafts: false });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  const ogImage = `/api/og?title=${encodeURIComponent(post.title)}&kicker=Writing`;
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      tags: [...post.tags],
      images: [ogImage],
    },
    twitter: { title: post.title, description: post.summary, images: [ogImage] },
    alternates: { canonical: `/writing/${post.slug}` },
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.draft) notFound();

  const components = makePostMdxComponents();

  return (
    <article className="space-y-8">
      <FadeUp>
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All writing
        </Link>
      </FadeUp>

      <FadeUp delay={0.05}>
        <header className="space-y-4 border-b border-border/60 pb-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
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
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
            {post.summary}
          </p>
        </header>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="prose-none max-w-3xl">
          <MDXRemote source={post.body} components={components} />
        </div>
      </FadeUp>
    </article>
  );
}
