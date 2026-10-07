# AlgoAtlas

**[Live demo →](https://algo-atlas-olive.vercel.app)**

A learning and practice platform for data structures and algorithms, from first loops to interview level. It combines a five-level roadmap, lessons with worked examples and quizzes, 264 practice problems with an in-browser judge, spaced-repetition revision, interview preparation and progress analytics.

Built with Next.js 15, React 19, TypeScript, Tailwind 4, Zustand and Prisma.

> **On the judge:** JavaScript submissions execute for real in a sandboxed Web Worker. C++, Java and Python use a simulated judge unless you point `EXECUTION_API_URL` at a real backend such as Judge0 — see [How code execution works](#how-code-execution-works).

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. You are signed in as the demo learner, Aarav Mehta, who has five months of sample history: 101 problems solved, a 12-day streak, a revision queue and earned badges. To start from scratch, log out and create an account, or use **Settings → Reset progress**.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | TypeScript with no emit |
| `npm run verify:problems` | Runs every reference solution against its own test cases |
| `npm run db:push` / `npm run db:seed` | Create the PostgreSQL schema and load content (see below) |

Requires Node 18.18+ (tested on Node 22).

## What's in it

- **Dashboard**: greeting, eight stat cards, overall and per-level progress, today's plan, roadmap position, weekly activity, daily challenge, activity heatmap, weak areas, recent activity and recommendations.
- **Roadmap and topics**: 44 topics across 5 levels with prerequisites, lock state, status, progress and estimated time. Each topic page has an overview, concept lessons (explanation, diagrams or step-through visualisations, code, complexity, common mistakes, interview tips) and its practice problems.
- **Learning Mode**: an 8-step flow per topic (concept → explanation → examples → Easy → Medium → Hard → quiz → complete) with a progress bar.
- **Problems**: 264 problems with filters for topic, difficulty, status, company, pattern, solution language, revision state and bookmarks, plus 8 sort orders. Filters live in the URL.
- **Problem page**: statement, examples, constraints, expected complexity, progressive hints, gated solution with alternatives, submission history and private notes. The editor supports C++, Java, Python and JavaScript, with Run, Submit, Reset, Get Hint and Show Solution.
- **Patterns**: 17 interview patterns with when to use them, recognition signals, a template, examples and a difficulty progression.
- **Revision**: SM-2-style scheduling from your Easy / Need practice / Difficult / Forgot ratings, grouped into Review Today, Review Soon, Mastered, Weak Topics and Previously Failed.
- **Interview prep**: 8 company pages (topics, patterns, difficulty mix, process, mock questions), 30/60/90-day, placement and FAANG plans, and timed mock interviews.
- **Progress**: analytics charts, achievements with daily and weekly goals, XP levels, streaks and a leaderboard.
- **Profile and settings**: editable profile, theme, default language, goals, topic unlocks, data export and reset.
- **Global search** (Ctrl/Cmd+K or `/`): topics, problems, patterns, lessons and companies.

## How code execution works

`src/services/execution-service.ts` is the single entry point the editor calls.

- **JavaScript** runs for real in a sandboxed Web Worker (`src/lib/execution/browser-runner.ts`). The harness (`harness-source.ts`) builds linked lists and trees from test input, calls your function or design class, compares results (exact, unordered, nested-unordered or floating-point) and enforces a 4-second limit. `npm run verify:problems` uses the same harness.
- **C++, Java and Python** go to `POST /api/execute`. By default this uses the **simulated judge** (`src/lib/execution/mock-judge.ts`): it rejects unchanged starter code, unbalanced brackets and missing returns, then reports the expected outputs. Results are labelled "Simulated" everywhere in the UI.
- **Real execution for every language:** set `EXECUTION_API_URL` (and optionally `EXECUTION_API_KEY`). The route then forwards `{ language, code, mode, signature, tests, compare }` and expects an `ExecutionResult` back (`src/lib/execution/types.ts`). A small adapter in front of Judge0 or Piston can generate per-language drivers from `signature`.

## Architecture

```
src/
  app/                    Next.js App Router
    (app)/                authenticated pages (dashboard, problems, learn, …)
    (auth)/               login and signup
    api/                  REST routes: problems, topics, search, patterns, companies, daily-challenge, execute
  components/
    ui/                   shadcn-style primitives on Radix (button, card, dialog, tabs, dropdown, tooltip…)
    layout/               app shell, collapsible sidebar, mobile drawer, header, search dialog
    shared/ problems/ learn/ dashboard/ charts/ roadmap/
  data/                   curriculum content: problems, topics, patterns, companies, achievements, plans
  lib/
    engine/               pure logic: progress, streaks, XP, stats, revision, weak areas, recommendations, achievements, search
    execution/            harness, browser runner, simulated judge
  services/               data access used by pages and API routes (problem, execution, auth)
  store/                  Zustand store with persistence, and the demo seed
  hooks/ types/
prisma/                   schema.prisma (21 models) and seed.ts
scripts/verify-problems.ts
```

The engine functions take a plain `ProgressData` object and return derived values, so they run unchanged on the client, in API routes or in a background job.

**When you solve a problem**, `recordSubmission` in `src/store/app-store.ts` does the following:

1. Records the submission and marks the problem solved.
2. Adds XP: Easy 10, Medium 25, Hard 50. First-try solves get +5, the daily challenge gets +20, and viewing the solution first halves the XP.
3. Updates today's activity, which drives streaks and analytics.
4. Schedules the problem for revision.
5. Checks achievements.
6. Recommends the next problem.

**When a submission fails**, the attempt is recorded. After two failed attempts the problem is added to revision as "Forgot".

**The recommendation engine** (`lib/engine/recommend.ts`) scores unsolved problems in unlocked topics using:

- distance from your current roadmap topic
- topic mastery (weak topics are boosted)
- recent accuracy, which sets a target difficulty
- previous attempts
- interview frequency

### Adding problems

Problems are written in a compact format in `src/data/problems/*.ts`:

- a function signature (e.g. `["twoSum", [["nums","int[]"],["target","int"]], "int[]"]`) or a design class
- test cases
- a JavaScript reference solution

Starter code for all four languages, formatted examples and metadata are generated by `builder.ts`. Run `npm run verify:problems` after editing.

## Switching to PostgreSQL

By default, progress is stored in the browser (`localStorage`) and content comes from `src/data`. To use a database:

1. `cp .env.example .env` and set `DATABASE_URL`.
2. `npm run db:generate && npm run db:push && npm run db:seed` loads all topics, lessons, problems, test cases, patterns, companies, interview questions, achievements, plans and the demo learner.
3. Replace the bodies of `getAllProblems` / `getProblemBySlug` in `src/services/problem-service.ts` with Prisma queries.
4. Persist progress through API routes instead of the client store. The store's actions map one-to-one onto tables:
   - `recordSubmission` → `Submission`, `Progress`, `DailyActivity`
   - `rateRevision` → `Revision`
   - `toggleBookmark` → `Bookmark`
   - `setLessonStep` / `completeQuiz` / `completeTopic` → `LessonProgress`
   - `enrollPlan` → `UserLearningPath`
   - achievements → `UserAchievement`

## Authentication

Login and signup are a mock: accounts live in the browser. The demo account is `aarav.mehta@example.com`, and any password of 6+ characters works. To add real authentication, replace `signIn` and `signUp` in `src/services/auth-service.ts` with Auth.js (NextAuth) or your provider. `User.passwordHash` exists in the schema for a credentials provider. The app shell redirects to `/login` whenever there is no session, so no page changes are needed.

## Notes

- **Code sources:** reference solutions are verified JavaScript, and many problems also include Python. Lesson and pattern code is Python, for readability.
- **Company tags and frequencies** are curated for practice. They are not official data from those companies.
- **Accessibility:** colours are defined as CSS variables in `src/app/globals.css` for both themes. Motion respects `prefers-reduced-motion`.

## License

MIT — see [LICENSE](LICENSE).
