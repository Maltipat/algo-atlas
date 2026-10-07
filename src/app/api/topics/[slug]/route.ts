import { NextResponse } from "next/server";
import { topicsBySlug } from "@/data/topics";
import { problems } from "@/data/problems";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = topicsBySlug[slug];
  if (!t) return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  return NextResponse.json({ ...t, problems: problems.filter((p) => p.topic === slug).map((p) => ({ slug: p.slug, title: p.title, difficulty: p.difficulty })) });
}
