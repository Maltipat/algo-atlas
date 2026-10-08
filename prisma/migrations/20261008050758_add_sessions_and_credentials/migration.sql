-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- CreateEnum
CREATE TYPE "LearningLevel" AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Interview');

-- CreateEnum
CREATE TYPE "TopicTier" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('cpp', 'java', 'python', 'javascript');

-- CreateEnum
CREATE TYPE "ProblemStatus" AS ENUM ('todo', 'attempted', 'solved');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error');

-- CreateEnum
CREATE TYPE "RevisionRating" AS ENUM ('easy', 'practice', 'difficult', 'forgot');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('Coding', 'Conceptual', 'Behavioral', 'Design');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('Milestone', 'Streak', 'Mastery', 'Skill', 'Habit');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "passwordHash" TEXT,
    "avatarHue" INTEGER NOT NULL DEFAULT 245,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "preferredLanguage" "Language" NOT NULL DEFAULT 'javascript',
    "editorFontSize" INTEGER NOT NULL DEFAULT 14,
    "dailyGoal" INTEGER NOT NULL DEFAULT 3,
    "weeklyGoal" INTEGER NOT NULL DEFAULT 15,
    "unlockAllTopics" BOOLEAN NOT NULL DEFAULT false,
    "emailReminders" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "tier" "TopicTier" NOT NULL,
    "icon" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "what" TEXT NOT NULL,
    "why" TEXT NOT NULL,
    "whereUsed" TEXT[],
    "estimatedHours" INTEGER NOT NULL,
    "quiz" JSONB NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicPrerequisite" (
    "topicId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,

    CONSTRAINT "TopicPrerequisite_pkey" PRIMARY KEY ("topicId","prerequisiteId")
);

-- CreateTable
CREATE TABLE "SubTopic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "visual" TEXT,
    "frames" JSONB,
    "code" TEXT NOT NULL,
    "complexity" TEXT NOT NULL,
    "mistakes" TEXT[],
    "tips" TEXT[],
    "topicId" TEXT NOT NULL,

    CONSTRAINT "SubTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "whenToUse" TEXT[],
    "signals" TEXT[],
    "template" TEXT NOT NULL,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "process" TEXT[],
    "focusTopics" JSONB NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "question" TEXT NOT NULL,
    "answerOutline" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "problemId" TEXT,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "examples" JSONB NOT NULL,
    "constraints" TEXT[],
    "difficulty" "Difficulty" NOT NULL,
    "level" "LearningLevel" NOT NULL,
    "subtopic" TEXT NOT NULL,
    "tags" TEXT[],
    "hints" TEXT[],
    "explanation" TEXT NOT NULL,
    "approach" TEXT[],
    "alternatives" JSONB NOT NULL,
    "solution" JSONB NOT NULL,
    "timeComplexity" TEXT NOT NULL,
    "spaceComplexity" TEXT NOT NULL,
    "starterCode" JSONB NOT NULL,
    "signature" JSONB NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "compare" TEXT NOT NULL DEFAULT 'exact',
    "runnable" BOOLEAN NOT NULL DEFAULT true,
    "acceptance" DOUBLE PRECISION NOT NULL,
    "frequency" INTEGER NOT NULL,
    "solvedCount" INTEGER NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "input" JSONB NOT NULL,
    "expected" JSONB NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "code" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "runtimeMs" INTEGER NOT NULL,
    "memoryMb" DOUBLE PRECISION NOT NULL,
    "passed" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "timeSpentSec" INTEGER NOT NULL,
    "simulated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "status" "ProblemStatus" NOT NULL DEFAULT 'todo',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "firstSolvedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bestRuntimeMs" INTEGER,
    "timeSpentSec" INTEGER NOT NULL DEFAULT 0,
    "usedSolution" BOOLEAN NOT NULL DEFAULT false,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("userId","problemId")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 1,
    "completedSteps" INTEGER[],
    "quizScore" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("userId","topicId")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("userId","problemId")
);

-- CreateTable
CREATE TABLE "Revision" (
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "intervalDays" INTEGER NOT NULL,
    "dueDate" DATE NOT NULL,
    "lastRating" "RevisionRating" NOT NULL,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "easyStreak" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("userId","problemId")
);

-- CreateTable
CREATE TABLE "DailyActivity" (
    "userId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "solved" INTEGER NOT NULL DEFAULT 0,
    "attempted" INTEGER NOT NULL DEFAULT 0,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "reviews" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyActivity_pkey" PRIMARY KEY ("userId","day")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "category" "AchievementCategory" NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("userId","achievementId")
);

-- CreateTable
CREATE TABLE "DailyChallenge" (
    "day" DATE NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "DailyChallenge_pkey" PRIMARY KEY ("day")
);

-- CreateTable
CREATE TABLE "UserDailyChallenge" (
    "userId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "problemId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserDailyChallenge_pkey" PRIMARY KEY ("userId","day")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "days" JSONB NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLearningPath" (
    "userId" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedDays" INTEGER[],

    CONSTRAINT "UserLearningPath_pkey" PRIMARY KEY ("userId","learningPathId")
);

-- CreateTable
CREATE TABLE "_PatternToProblem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PatternToProblem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CompanyToProblem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyToProblem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_order_key" ON "Topic"("order");

-- CreateIndex
CREATE INDEX "Topic_level_idx" ON "Topic"("level");

-- CreateIndex
CREATE UNIQUE INDEX "SubTopic_topicId_slug_key" ON "SubTopic"("topicId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pattern_slug_key" ON "Pattern"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_number_key" ON "Problem"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- CreateIndex
CREATE INDEX "Problem_topicId_difficulty_idx" ON "Problem"("topicId", "difficulty");

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");

-- CreateIndex
CREATE INDEX "Problem_frequency_idx" ON "Problem"("frequency");

-- CreateIndex
CREATE INDEX "TestCase_problemId_idx" ON "TestCase"("problemId");

-- CreateIndex
CREATE INDEX "Submission_userId_createdAt_idx" ON "Submission"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Submission_userId_problemId_idx" ON "Submission"("userId", "problemId");

-- CreateIndex
CREATE INDEX "Progress_userId_status_idx" ON "Progress"("userId", "status");

-- CreateIndex
CREATE INDEX "Revision_userId_dueDate_idx" ON "Revision"("userId", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE INDEX "_PatternToProblem_B_index" ON "_PatternToProblem"("B");

-- CreateIndex
CREATE INDEX "_CompanyToProblem_B_index" ON "_CompanyToProblem"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicPrerequisite" ADD CONSTRAINT "TopicPrerequisite_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicPrerequisite" ADD CONSTRAINT "TopicPrerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTopic" ADD CONSTRAINT "SubTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDailyChallenge" ADD CONSTRAINT "UserDailyChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDailyChallenge" ADD CONSTRAINT "UserDailyChallenge_day_fkey" FOREIGN KEY ("day") REFERENCES "DailyChallenge"("day") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningPath" ADD CONSTRAINT "UserLearningPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningPath" ADD CONSTRAINT "UserLearningPath_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatternToProblem" ADD CONSTRAINT "_PatternToProblem_A_fkey" FOREIGN KEY ("A") REFERENCES "Pattern"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatternToProblem" ADD CONSTRAINT "_PatternToProblem_B_fkey" FOREIGN KEY ("B") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToProblem" ADD CONSTRAINT "_CompanyToProblem_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToProblem" ADD CONSTRAINT "_CompanyToProblem_B_fkey" FOREIGN KEY ("B") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
