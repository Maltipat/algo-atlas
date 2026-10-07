import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { learningPaths, learningPathsBySlug } from "@/data/plans";
import { PlanView } from "./plan-view";

export function generateStaticParams() {
  return learningPaths.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: learningPathsBySlug[slug]?.name ?? "Plan" };
}

export default async function PlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!learningPathsBySlug[slug]) notFound();
  return <PlanView slug={slug} />;
}
