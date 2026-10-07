import { NextResponse } from "next/server";
import { roadmapLevels, topics } from "@/data/topics";

export function GET() {
  return NextResponse.json({ levels: roadmapLevels, topics: topics.map(({ concepts, quiz, ...t }) => ({ ...t, conceptCount: concepts.length, quizCount: quiz.length })) });
}
