import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllProjects, getProject } from "@/lib/content";
import { ProjectCaseStudy } from "@/components/project/ProjectCaseStudy";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };
  const ogImage = `/api/og?title=${encodeURIComponent(project.title)}&kicker=Work`;
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [ogImage],
    },
    twitter: { title: project.title, description: project.summary, images: [ogImage] },
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return <ProjectCaseStudy project={project} />;
}
