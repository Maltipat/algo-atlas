import type { Concept, QuizQuestion, VisualFrame } from "@/types";
import { slugify } from "../problems/builder";

/** Compact concept constructor used by the topic content files. */
export function c(
  title: string,
  explanation: string,
  code: string,
  complexity: string,
  mistakes: string[],
  tips: string[],
  visual?: string,
  frames?: VisualFrame[],
): Concept {
  return { id: slugify(title), title, explanation, code, complexity, mistakes, tips, visual, frames };
}

export function q(question: string, options: string[], answer: number, explanation: string): QuizQuestion {
  return { question, options, answer, explanation };
}
