import type { RoadmapLevel, Topic } from "@/types";
import { foundationCoreTopics } from "./foundations-core";
import { advancedTopics } from "./advanced";

export const topics: Topic[] = [...foundationCoreTopics, ...advancedTopics].sort((a, b) => a.order - b.order);

export const topicsBySlug: Record<string, Topic> = Object.fromEntries(topics.map((t) => [t.slug, t]));

export const roadmapLevels: RoadmapLevel[] = [
  { level: 1, name: "Foundations", description: "Language fluency, complexity analysis, arrays, strings, math and first steps in recursion." },
  { level: 2, name: "Core Data Structures", description: "Linked lists, stacks, queues, hashing and the array techniques that solve most medium problems." },
  { level: 3, name: "Trees & Advanced Structures", description: "Binary trees, BSTs, heaps, tries and range-query trees." },
  { level: 4, name: "Graphs", description: "Traversals, ordering, shortest paths, spanning trees and union-find." },
  { level: 5, name: "Advanced Algorithms", description: "Greedy, backtracking, dynamic programming, bits and advanced graph and string algorithms." },
];
