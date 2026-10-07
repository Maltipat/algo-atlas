"use client";

import { useState } from "react";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Quiz({ questions, onSubmit, bestScore }: { questions: QuizQuestion[]; onSubmit: (score: number) => void; bestScore?: number }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const correct = answers.filter((a, i) => a === questions[i]!.answer).length;
  const score = Math.round((correct / questions.length) * 100);

  const submit = () => { setSubmitted(true); onSubmit(score); };
  const retry = () => { setAnswers(questions.map(() => null)); setSubmitted(false); };

  return (
    <div className="space-y-5">
      {bestScore !== undefined && !submitted && <p className="text-sm text-muted">Best score so far: {bestScore}%. You need 60% to pass.</p>}
      {questions.map((q, qi) => (
        <fieldset key={qi} className="rounded-[var(--radius-control)] border border-border p-4">
          <legend className="px-1 text-sm font-medium"><span className="text-muted">{qi + 1}.</span> {q.question}</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {q.options.map((opt, oi) => {
              const chosen = answers[qi] === oi;
              const isRight = submitted && oi === q.answer;
              const isWrong = submitted && chosen && oi !== q.answer;
              return (
                <label key={oi} className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors",
                  chosen ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-2",
                  isRight && "border-success bg-success-soft",
                  isWrong && "border-danger bg-danger-soft",
                  submitted && "cursor-default",
                )}>
                  <input type="radio" name={`q${qi}`} className="accent-[var(--primary)]" checked={chosen} disabled={submitted} onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))} />
                  <span className="flex-1">{opt}</span>
                  {isRight && <CircleCheck className="size-4 text-success" aria-label="Correct answer" />}
                  {isWrong && <CircleX className="size-4 text-danger" aria-label="Incorrect" />}
                </label>
              );
            })}
          </div>
          {submitted && <p className="mt-3 text-sm text-muted">{q.explanation}</p>}
        </fieldset>
      ))}
      {!submitted ? (
        <Button onClick={submit} disabled={answers.some((a) => a === null)}>Submit answers</Button>
      ) : (
        <div className={cn("flex flex-wrap items-center gap-3 rounded-[var(--radius-control)] p-4", score >= 60 ? "bg-success-soft" : "bg-warning-soft")} role="status">
          <p className="flex-1 text-sm font-medium">You scored {score}% ({correct} of {questions.length}). {score >= 60 ? "Quiz passed." : "Review the explanations and try again. You need 60%."}</p>
          <Button variant="outline" size="sm" onClick={retry}><RotateCcw /> Retake quiz</Button>
        </div>
      )}
    </div>
  );
}
