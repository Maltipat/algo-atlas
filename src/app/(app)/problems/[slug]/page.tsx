import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { problems, problemsBySlug } from "@/data/problems";
import { ProblemWorkspace } from "./problem-workspace";

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = problemsBySlug[slug];
  return { title: p ? `${p.number}. ${p.title}` : "Problem" };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!problemsBySlug[slug]) notFound();
  return <ProblemWorkspace slug={slug} />;
}
