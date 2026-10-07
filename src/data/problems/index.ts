import type { Problem } from "@/types";
import { build } from "./builder";
import { problemDefs } from "./defs";
import { topicsBySlug } from "../topics";

export const problems: Problem[] = problemDefs.map((def, i) => build(def, i + 1, topicsBySlug[def.topic]?.prerequisites ?? []));

export const problemsBySlug: Record<string, Problem> = Object.fromEntries(problems.map((p) => [p.slug, p]));
export const problemsById: Record<string, Problem> = Object.fromEntries(problems.map((p) => [p.id, p]));
