import type { Metadata } from "next";

import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/project/ProjectCard";
import { FadeUp } from "@/components/motion/FadeUp";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Five projects across production multi-tenant SaaS, AI agents, and edge ML — with architecture diagrams, decisions, and metrics.",
};

export default async function WorkPage() {
  const projects = await getAllProjects();

  return (
    <section className="space-y-12">
      <header className="space-y-3">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Work · {projects.length} project{projects.length === 1 ? "" : "s"} of 5
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Things I've built
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Production multi-tenant SaaS, AI agents on top of Gemini and Claude,
          and edge ML running at 30 FPS on a CPU. Each card leads with the
          architecture and the engineering decisions behind it.
        </p>
      </header>

      <div className="space-y-6">
        {projects.map((project, i) => (
          <FadeUp key={project.slug} delay={i * 0.05}>
            <ProjectCard project={project} />
          </FadeUp>
        ))}

        {projects.length < 5 && (
          <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {5 - projects.length} more project
            {5 - projects.length === 1 ? "" : "s"} land in Issue #4
          </p>
        )}
      </div>
    </section>
  );
}
