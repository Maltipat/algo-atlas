// ---------------------------------------------------------------------------
// Domain types shared by data, services, engine, store and UI.
// These mirror the Prisma models in prisma/schema.prisma so the mock data layer
// can be swapped for the database without touching components.
// ---------------------------------------------------------------------------

export type Difficulty = "Easy" | "Medium" | "Hard";
export type LearningLevel = "Beginner" | "Intermediate" | "Advanced" | "Interview";
export type TopicTier = "Beginner" | "Intermediate" | "Advanced";
export type Language = "cpp" | "java" | "python" | "javascript";

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
];

export type ParamType =
  | "int"
  | "long"
  | "double"
  | "bool"
  | "string"
  | "char"
  | "int[]"
  | "double[]"
  | "bool[]"
  | "string[]"
  | "char[]"
  | "int[][]"
  | "char[][]"
  | "string[][]"
  | "ListNode"
  | "ListNode[]"
  | "TreeNode"
  | "void";

export interface FnSignature {
  name: string;
  params: [string, ParamType][];
  returns: ParamType;
}

export interface DesignSignature {
  className: string;
  ctor: [string, ParamType][];
  methods: FnSignature[];
}

/** How a returned value is compared with the expected value. */
export type CompareMode = "exact" | "unordered" | "unorderedNested" | "float";

export interface TestCase {
  id: string;
  input: unknown[];
  expected: unknown;
  hidden: boolean;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface AlternativeApproach {
  name: string;
  time: string;
  space: string;
  note: string;
}

export interface Problem {
  id: string;
  number: number;
  title: string;
  slug: string;
  description: string;
  examples: Example[];
  constraints: string[];
  difficulty: Difficulty;
  level: LearningLevel;
  topic: string;
  subtopic: string;
  patterns: string[];
  tags: string[];
  prerequisites: string[];
  companies: string[];
  hints: string[];
  explanation: string;
  approach: string[];
  alternatives: AlternativeApproach[];
  solution: Partial<Record<Language, string>>;
  timeComplexity: string;
  spaceComplexity: string;
  starterCode: Record<Language, string>;
  testCases: TestCase[];
  expectedOutput: string;
  signature: FnSignature | DesignSignature;
  /** true when the JavaScript submission can be executed and checked in the browser */
  runnable: boolean;
  compare: CompareMode;
  acceptance: number;
  frequency: number;
  solvedCount: number;
  estimatedMinutes: number;
  addedAt: string;
}

export interface VisualFrame {
  array: (number | string)[];
  marks: Record<number, "i" | "j" | "mid" | "window" | "done" | "found">;
  note: string;
}

export interface Concept {
  id: string;
  title: string;
  explanation: string;
  visual?: string;
  frames?: VisualFrame[];
  code: string;
  complexity: string;
  mistakes: string[];
  tips: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Topic {
  slug: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  order: number;
  tier: TopicTier;
  icon: string;
  summary: string;
  what: string;
  why: string;
  where: string[];
  prerequisites: string[];
  estimatedHours: number;
  concepts: Concept[];
  quiz: QuizQuestion[];
}

export interface RoadmapLevel {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
}

export interface Pattern {
  slug: string;
  name: string;
  icon: string;
  summary: string;
  explanation: string;
  whenToUse: string[];
  signals: string[];
  template: string;
  exampleProblems: string[];
}

export interface InterviewQuestion {
  id: string;
  company: string;
  type: "Coding" | "Conceptual" | "Behavioral" | "Design";
  question: string;
  problemSlug?: string;
  answerOutline: string;
}

export interface Company {
  slug: string;
  name: string;
  color: string;
  description: string;
  process: string[];
  focusTopics: { topic: string; weight: number }[];
  questions: InterviewQuestion[];
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  xp: number;
  category: "Milestone" | "Streak" | "Mastery" | "Skill" | "Habit";
}

export interface PlanDay {
  day: number;
  title: string;
  topics: string[];
  problems: string[];
  minutes: number;
}

export interface LearningPath {
  slug: string;
  name: string;
  description: string;
  durationDays: number;
  audience: string;
  days: PlanDay[];
}

// ---------------------------------------------------------------------------
// User progress (persisted client-side in mock mode, in Postgres in DB mode)
// ---------------------------------------------------------------------------

export type ProblemStatus = "solved" | "attempted" | "todo";

export type SubmissionStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "Time Limit Exceeded"
  | "Compilation Error";

export interface Submission {
  id: string;
  problemId: string;
  language: Language;
  status: SubmissionStatus;
  runtimeMs: number;
  memoryMb: number;
  passed: number;
  total: number;
  createdAt: string;
  timeSpentSec: number;
  simulated: boolean;
}

export interface ProblemProgress {
  status: ProblemStatus;
  attempts: number;
  firstSolvedAt?: string;
  lastActivityAt: string;
  bestRuntimeMs?: number;
  timeSpentSec: number;
  usedSolution?: boolean;
  hintsUsed?: number;
}

export type RevisionRating = "easy" | "practice" | "difficult" | "forgot";

export interface RevisionItem {
  problemId: string;
  intervalDays: number;
  dueDate: string;
  lastRating: RevisionRating;
  reviews: number;
  lapses: number;
  easyStreak: number;
  lastReviewedAt: string;
}

export interface LessonProgress {
  step: number;
  completedSteps: number[];
  quizScore?: number;
  completed: boolean;
  completedAt?: string;
  updatedAt?: string;
}

export interface DayActivity {
  solved: number;
  attempted: number;
  minutes: number;
  xp: number;
  reviews: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  joinedAt: string;
  avatarHue: number;
}

export interface UserSettings {
  preferredLanguage: Language;
  editorFontSize: number;
  dailyGoal: number;
  weeklyGoal: number;
  unlockAllTopics: boolean;
  showTags: boolean;
  emailReminders: boolean;
}

export interface MockInterviewSession {
  id: string;
  company: string;
  problemIds: string[];
  startedAt: string;
  durationMin: number;
  endedAt?: string;
  solvedIds?: string[];
}

export interface PlanEnrollment {
  slug: string;
  startedAt: string;
  completedDays: number[];
}

export interface StudyLogEntry {
  id: string;
  kind: "lesson" | "quiz" | "topic" | "achievement" | "review";
  label: string;
  href?: string;
  createdAt: string;
}

export interface DailyChallengeRecord {
  problemId: string;
  completed: boolean;
}

/** Everything persisted for one user. In DB mode each key maps to a table (see prisma/schema.prisma). */
export interface ProgressData {
  initialized: boolean;
  user: UserProfile | null;
  /** Kept after logging out so the same account can sign back in without losing progress. */
  signedOutUser: UserProfile | null;
  settings: UserSettings;
  xp: number;
  problemProgress: Record<string, ProblemProgress>;
  submissions: Submission[];
  bookmarks: string[];
  revision: Record<string, RevisionItem>;
  lessons: Record<string, LessonProgress>;
  activity: Record<string, DayActivity>;
  achievements: Record<string, string>;
  notifications: AppNotification[];
  dailyChallenges: Record<string, DailyChallengeRecord>;
  planEnrollments: Record<string, PlanEnrollment>;
  mockSessions: MockInterviewSession[];
  studyLog: StudyLogEntry[];
  drafts: Record<string, string>;
  notes: Record<string, string>;
  dailyPlanChecks: Record<string, string[]>;
}
