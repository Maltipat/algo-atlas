/**
 * Seeds PostgreSQL with the full curriculum and the demo learner.
 * Run: npm run db:push && npm run db:seed
 *
 * Content comes from the same files the mock data layer uses (src/data), so the
 * database and the mock layer never drift apart.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { topics } from "../src/data/topics";
import { problems } from "../src/data/problems";
import { patterns } from "../src/data/patterns";
import { companies } from "../src/data/companies";
import { achievements } from "../src/data/achievements";
import { learningPaths } from "../src/data/plans";
import { createDemoProgress } from "../src/store/seed";

const prisma = new PrismaClient();

const STATUS = {
  Accepted: "Accepted",
  "Wrong Answer": "WrongAnswer",
  "Runtime Error": "RuntimeError",
  "Time Limit Exceeded": "TimeLimitExceeded",
  "Compilation Error": "CompilationError",
} as const;

const day = (key: string) => new Date(`${key}T00:00:00.000Z`);
const json = (v: unknown) => v as Prisma.InputJsonValue;

async function reset() {
  // Children first.
  await prisma.userDailyChallenge.deleteMany();
  await prisma.dailyChallenge.deleteMany();
  await prisma.userLearningPath.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.dailyActivity.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.interviewQuestion.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.company.deleteMany();
  await prisma.pattern.deleteMany();
  await prisma.subTopic.deleteMany();
  await prisma.topicPrerequisite.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.learningPath.deleteMany();
}

async function seedCurriculum() {
  await prisma.topic.createMany({
    data: topics.map((t) => ({
      id: t.slug, slug: t.slug, name: t.name, level: t.level, order: t.order, tier: t.tier, icon: t.icon,
      summary: t.summary, what: t.what, why: t.why, whereUsed: t.where, estimatedHours: t.estimatedHours, quiz: json(t.quiz),
    })),
  });
  await prisma.topicPrerequisite.createMany({
    data: topics.flatMap((t) => t.prerequisites.map((p) => ({ topicId: t.slug, prerequisiteId: p }))),
  });
  await prisma.subTopic.createMany({
    data: topics.flatMap((t) => t.concepts.map((c, i) => ({
      slug: c.id, title: c.title, order: i + 1, explanation: c.explanation, visual: c.visual ?? null,
      frames: c.frames ? json(c.frames) : undefined, code: c.code, complexity: c.complexity, mistakes: c.mistakes, tips: c.tips, topicId: t.slug,
    }))),
  });
  await prisma.pattern.createMany({
    data: patterns.map((p) => ({ id: p.slug, slug: p.slug, name: p.name, icon: p.icon, summary: p.summary, explanation: p.explanation, whenToUse: p.whenToUse, signals: p.signals, template: p.template })),
  });
  await prisma.company.createMany({
    data: companies.map((c) => ({ id: c.slug, slug: c.slug, name: c.name, color: c.color, description: c.description, process: c.process, focusTopics: json(c.focusTopics) })),
  });

  for (const p of problems) {
    await prisma.problem.create({
      data: {
        id: p.id, number: p.number, slug: p.slug, title: p.title, description: p.description, examples: json(p.examples),
        constraints: p.constraints, difficulty: p.difficulty, level: p.level, subtopic: p.subtopic, tags: p.tags, hints: p.hints,
        explanation: p.explanation, approach: p.approach, alternatives: json(p.alternatives), solution: json(p.solution),
        timeComplexity: p.timeComplexity, spaceComplexity: p.spaceComplexity, starterCode: json(p.starterCode), signature: json(p.signature),
        expectedOutput: p.expectedOutput, compare: p.compare, runnable: p.runnable, acceptance: p.acceptance, frequency: p.frequency,
        solvedCount: p.solvedCount, estimatedMinutes: p.estimatedMinutes, addedAt: new Date(p.addedAt),
        topic: { connect: { id: p.topic } },
        patterns: { connect: p.patterns.map((id) => ({ id })) },
        companies: { connect: p.companies.map((id) => ({ id })) },
      },
    });
  }
  await prisma.testCase.createMany({
    data: problems.flatMap((p) => p.testCases.map((t, i) => ({ id: t.id, order: i + 1, input: json(t.input), expected: json(t.expected), hidden: t.hidden, problemId: p.id }))),
  });
  await prisma.interviewQuestion.createMany({
    data: companies.flatMap((c) => c.questions.map((q) => ({ id: q.id, type: q.type, question: q.question, answerOutline: q.answerOutline, companyId: c.slug, problemId: q.problemSlug ?? null }))),
  });
  await prisma.achievement.createMany({ data: achievements.map((a) => ({ id: a.id, name: a.name, emoji: a.emoji, description: a.description, xp: a.xp, category: a.category })) });
  await prisma.learningPath.createMany({
    data: learningPaths.map((l) => ({ id: l.slug, slug: l.slug, name: l.name, description: l.description, audience: l.audience, durationDays: l.durationDays, days: json(l.days) })),
  });
}

async function seedDemoUser() {
  const d = createDemoProgress();
  const u = d.user!;
  const user = await prisma.user.create({
    data: {
      id: u.id, email: u.email, username: u.username, name: u.name, bio: u.bio, avatarHue: u.avatarHue, xp: d.xp,
      preferredLanguage: d.settings.preferredLanguage, editorFontSize: d.settings.editorFontSize, dailyGoal: d.settings.dailyGoal,
      weeklyGoal: d.settings.weeklyGoal, unlockAllTopics: d.settings.unlockAllTopics, emailReminders: d.settings.emailReminders,
      createdAt: new Date(u.joinedAt),
    },
  });
  await prisma.progress.createMany({
    data: Object.entries(d.problemProgress).map(([problemId, p]) => ({
      userId: user.id, problemId, status: p.status, attempts: p.attempts, firstSolvedAt: p.firstSolvedAt ? new Date(p.firstSolvedAt) : null,
      lastActivityAt: new Date(p.lastActivityAt), bestRuntimeMs: p.bestRuntimeMs ?? null, timeSpentSec: p.timeSpentSec,
      usedSolution: !!p.usedSolution, hintsUsed: p.hintsUsed ?? 0, note: d.notes[problemId] ?? null,
    })),
  });
  await prisma.submission.createMany({
    data: d.submissions.map((s) => ({
      id: s.id, language: s.language, code: "", status: STATUS[s.status], runtimeMs: s.runtimeMs, memoryMb: s.memoryMb, passed: s.passed,
      total: s.total, timeSpentSec: s.timeSpentSec, simulated: s.simulated, createdAt: new Date(s.createdAt), userId: user.id, problemId: s.problemId,
    })),
  });
  await prisma.lessonProgress.createMany({
    data: Object.entries(d.lessons).map(([topicId, l]) => ({
      userId: user.id, topicId, step: l.step, completedSteps: l.completedSteps, quizScore: l.quizScore ?? null, completed: l.completed,
      completedAt: l.completedAt ? new Date(l.completedAt) : null,
    })),
  });
  await prisma.bookmark.createMany({ data: d.bookmarks.map((problemId) => ({ userId: user.id, problemId })) });
  await prisma.revision.createMany({
    data: Object.values(d.revision).map((r) => ({
      userId: user.id, problemId: r.problemId, intervalDays: r.intervalDays, dueDate: day(r.dueDate), lastRating: r.lastRating,
      reviews: r.reviews, lapses: r.lapses, easyStreak: r.easyStreak, lastReviewedAt: new Date(r.lastReviewedAt),
    })),
  });
  await prisma.dailyActivity.createMany({ data: Object.entries(d.activity).map(([k, a]) => ({ userId: user.id, day: day(k), ...a })) });
  await prisma.userAchievement.createMany({ data: Object.entries(d.achievements).map(([achievementId, at]) => ({ userId: user.id, achievementId, unlockedAt: new Date(at) })) });
  await prisma.dailyChallenge.createMany({ data: Object.entries(d.dailyChallenges).map(([k, c]) => ({ day: day(k), problemId: c.problemId })) });
  await prisma.userDailyChallenge.createMany({ data: Object.entries(d.dailyChallenges).map(([k, c]) => ({ userId: user.id, day: day(k), problemId: c.problemId, completed: c.completed })) });
  await prisma.userLearningPath.createMany({
    data: Object.values(d.planEnrollments).map((e) => ({ userId: user.id, learningPathId: e.slug, startedAt: new Date(e.startedAt), completedDays: e.completedDays })),
  });
  return user.email;
}

async function main() {
  await reset();
  await seedCurriculum();
  const email = await seedDemoUser();
  const [t, p, s] = await Promise.all([prisma.topic.count(), prisma.problem.count(), prisma.submission.count()]);
  console.log(`Seeded ${t} topics, ${p} problems, ${s} demo submissions. Demo user: ${email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
