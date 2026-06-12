import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import type { Project } from "@/content/schema";
import { ARCH_DIAGRAMS } from "@/components/diagram/registry";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface ProjectCardProps {
  project: Project;
  /** When true, links to /work/[slug] case study page. Defaults true. */
  caseStudyLink?: boolean;
}

export function ProjectCard({ project, caseStudyLink = true }: ProjectCardProps) {
  const { title, slug, year, summary, stack, repo, demo, featured } = project;
  const Diagram = ARCH_DIAGRAMS[slug];

  return (
    <SpotlightCard>
    <article
      className="group relative overflow-hidden rounded-lg border border-border bg-surface p-5 transition-colors duration-fast hover:border-foreground/40 sm:p-6"
      data-slug={slug}
    >
      <div className="relative mb-5 overflow-hidden rounded-md border border-border/60 bg-background/40 p-3 text-foreground sm:p-4">
        {Diagram ? (
          <Diagram />
        ) : (
          <div className="flex h-40 items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Diagram pending
            </span>
          </div>
        )}
      </div>

      <header className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {caseStudyLink ? (
              <Link
                href={`/work/${slug}`}
                className="transition-colors hover:text-accent"
              >
                {title}
                <ArrowUpRight
                  className="ml-1 inline h-4 w-4 -translate-y-px text-muted-foreground transition-colors group-hover:text-accent"
                  aria-hidden
                />
              </Link>
            ) : (
              title
            )}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">{year}</span>
        </div>
        {featured && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
            Featured
          </span>
        )}
      </header>

      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
        {summary}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {stack.map((tech) => (
          <li
            key={tech}
            className="rounded-sm border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[11px] text-foreground/80"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-border/60 pt-4">
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground transition-colors hover:text-accent"
          >
            Live demo
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-3.5 w-3.5" aria-hidden />
            Repo
          </a>
        )}
        {!repo && (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/60">
            <Github className="h-3.5 w-3.5" aria-hidden />
            Private repo
          </span>
        )}
      </div>
    </article>
    </SpotlightCard>
  );
}
