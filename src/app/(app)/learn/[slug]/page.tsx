import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { topics, topicsBySlug } from "@/data/topics";
import { LearningMode } from "./learning-mode";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Learn ${topicsBySlug[slug]?.name ?? ""}` };
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!topicsBySlug[slug]) notFound();
  return <LearningMode slug={slug} />;
}
