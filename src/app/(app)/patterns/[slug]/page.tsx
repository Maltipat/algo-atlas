import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { patterns, patternsBySlug } from "@/data/patterns";
import { PatternView } from "./pattern-view";

export function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: patternsBySlug[slug]?.name ?? "Pattern" };
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!patternsBySlug[slug]) notFound();
  return <PatternView slug={slug} />;
}
