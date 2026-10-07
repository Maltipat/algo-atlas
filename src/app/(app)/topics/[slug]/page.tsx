import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { topics, topicsBySlug } from "@/data/topics";
import { TopicView } from "./topic-view";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: topicsBySlug[slug]?.name ?? "Topic" };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!topicsBySlug[slug]) notFound();
  return <TopicView slug={slug} />;
}
