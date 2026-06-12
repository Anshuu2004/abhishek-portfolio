import type { Metadata } from "next";

import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/project/ProjectCard";
import { CardStack } from "@/components/work/CardStack";
import { FadeUp } from "@/components/motion/FadeUp";
import { Kicker } from "@/components/ui/kicker";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Five projects across production multi-tenant SaaS, AI agents, and edge ML — with architecture diagrams, decisions, and metrics.",
};

export default async function WorkPage() {
  const projects = await getAllProjects();

  return (
    <section className="space-y-16">
      <FadeUp>
        <header className="space-y-3">
          <Kicker>
            Work · {projects.length} project{projects.length === 1 ? "" : "s"} of 5
          </Kicker>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Things I&apos;ve built
          </h1>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Production multi-tenant SaaS, AI agents on top of Gemini and Claude,
            and edge ML running at 30 FPS on a CPU. Each card leads with the
            architecture and the engineering decisions behind it. Scroll — the
            deck stacks.
          </p>
        </header>
      </FadeUp>

      <CardStack>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </CardStack>

      {projects.length < 5 && (
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {5 - projects.length} more project
          {5 - projects.length === 1 ? "" : "s"} land in Issue #4
        </p>
      )}
    </section>
  );
}
