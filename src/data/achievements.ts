import type { Achievement } from "@/types";

export const achievements: Achievement[] = [
  { id: "first-problem", name: "First Problem", emoji: "🏆", description: "Solve your first problem.", xp: 20, category: "Milestone" },
  { id: "ten-solved", name: "Getting Warmed Up", emoji: "✋", description: "Solve 10 problems.", xp: 40, category: "Milestone" },
  { id: "fifty-solved", name: "Half Century", emoji: "🎯", description: "Solve 50 problems.", xp: 100, category: "Milestone" },
  { id: "hundred-solved", name: "100 Problems Solved", emoji: "💯", description: "Solve 100 problems.", xp: 250, category: "Milestone" },
  { id: "two-hundred-solved", name: "Problem Machine", emoji: "🛠️", description: "Solve 200 problems.", xp: 500, category: "Milestone" },
  { id: "streak-3", name: "Three in a Row", emoji: "✨", description: "Practise 3 days in a row.", xp: 30, category: "Streak" },
  { id: "streak-7", name: "7 Day Streak", emoji: "🔥", description: "Practise 7 days in a row.", xp: 70, category: "Streak" },
  { id: "streak-30", name: "Monthly Habit", emoji: "📅", description: "Practise 30 days in a row.", xp: 300, category: "Streak" },
  { id: "first-hard", name: "Hard Hitter", emoji: "🥊", description: "Solve your first Hard problem.", xp: 50, category: "Skill" },
  { id: "ten-hard", name: "Hard Mode", emoji: "⛰️", description: "Solve 10 Hard problems.", xp: 200, category: "Skill" },
  { id: "speed-solver", name: "Speed Solver", emoji: "⚡", description: "Solve a Medium or Hard problem in under 10 minutes.", xp: 60, category: "Skill" },
  { id: "no-hints", name: "Unassisted", emoji: "🧭", description: "Solve a Medium problem on the first try without hints.", xp: 40, category: "Skill" },
  { id: "array-ace", name: "Array Ace", emoji: "📊", description: "Solve every Arrays problem.", xp: 150, category: "Mastery" },
  { id: "tree-explorer", name: "Tree Explorer", emoji: "🌳", description: "Solve 15 tree problems (trees, BSTs and traversals).", xp: 150, category: "Mastery" },
  { id: "graph-master", name: "Graph Master", emoji: "🕸️", description: "Solve 15 graph problems.", xp: 200, category: "Mastery" },
  { id: "dp-master", name: "DP Master", emoji: "🧠", description: "Solve 15 dynamic programming problems.", xp: 250, category: "Mastery" },
  { id: "first-topic", name: "Topic Complete", emoji: "🎓", description: "Finish Learning Mode for any topic.", xp: 50, category: "Mastery" },
  { id: "level-1-complete", name: "Solid Foundations", emoji: "🧱", description: "Finish Learning Mode for every Level 1 topic.", xp: 200, category: "Mastery" },
  { id: "perfect-quiz", name: "Perfect Score", emoji: "📝", description: "Score 100% on a topic quiz.", xp: 30, category: "Skill" },
  { id: "revision-10", name: "Spaced Out", emoji: "🔁", description: "Complete 10 revision reviews.", xp: 50, category: "Habit" },
  { id: "daily-5", name: "Daily Devotee", emoji: "☀️", description: "Complete 5 daily challenges.", xp: 80, category: "Habit" },
  { id: "bookworm", name: "Collector", emoji: "🔖", description: "Bookmark 10 problems.", xp: 20, category: "Habit" },
  { id: "mock-interview", name: "Under Pressure", emoji: "⏱️", description: "Finish a mock interview.", xp: 60, category: "Habit" },
];

export const achievementsById: Record<string, Achievement> = Object.fromEntries(achievements.map((a) => [a.id, a]));
