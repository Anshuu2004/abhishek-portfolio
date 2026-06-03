import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

import type { ProjectWithBody } from "@/lib/content";
import { makeProjectMdxComponents } from "@/lib/mdx-components";
import { FadeUp } from "@/components/motion/FadeUp";

export function ProjectCaseStudy({ project }: { project: ProjectWithBody }) {
  const components = makeProjectMdxComponents(project.slug);

  return (
    <article className="space-y-8">
      <FadeUp>
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All work
        </Link>
      </FadeUp>

      <FadeUp delay={0.05}>
        <header className="space-y-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Case study · {project.year}
            {project.featured && (
              <>
                <span aria-hidden className="mx-2 text-border">·</span>
                <span className="text-accent">Featured</span>
              </>
            )}
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
            {project.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground transition-colors hover:text-accent"
              >
                Live demo
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" aria-hidden />
                Repository
              </a>
            )}
          </div>

          <ul className="flex flex-wrap gap-1.5 pt-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-sm border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-foreground/80"
              >
                {tech}
              </li>
            ))}
          </ul>
        </header>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="prose-none">
          <MDXRemote source={project.body} components={components} />
        </div>
      </FadeUp>
    </article>
  );
}
