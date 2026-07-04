"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { Profile, User } from "@/lib/types";
import Markdown from "./Markdown";

const QUESTIONS: { key: string; question: string; hint: string }[] = [
  {
    key: "current",
    question: "What do you currently do?",
    hint: "Your work, business, or studies — e.g. \"I run a small logistics business in Mwanza\" or \"I'm a form six student\".",
  },
  {
    key: "background",
    question: "What is your background or training?",
    hint: "Your field of study, professional training, or experience.",
  },
  {
    key: "strengths",
    question: "What do people come to you for help with?",
    hint: "The problems you enjoy solving — this often points to your real strengths.",
  },
  {
    key: "assets",
    question: "What resources, skills, or connections do you have?",
    hint: "Equipment, savings, networks, languages, digital skills — anything you could build on.",
  },
  {
    key: "goals",
    question: "Where do you want to be in 3–5 years?",
    hint: "Be honest and ambitious — Bermi AI will help chart the path.",
  },
  {
    key: "context",
    question: "Anything else about you or your situation?",
    hint: "Family, location, constraints, dreams — anything that helps Bermi AI understand you. (Optional)",
  },
];

interface Props {
  user: User;
  onDone: (status: "completed" | "skipped") => void;
}

export default function Onboarding({ user, onDone }: Props) {
  const [step, setStep] = useState(-1); // -1 = intro, 0..n-1 = questions, n = generating/result
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function skip() {
    setBusy(true);
    try {
      await api<Profile>("/api/onboarding/skip", { method: "POST" });
    } catch {
      /* skipping should never block the user */
    }
    onDone("skipped");
  }

  function next() {
    const q = QUESTIONS[step];
    const updated = { ...answers, [q.question]: current.trim() };
    setAnswers(updated);
    setCurrent("");
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      void submit(updated);
    }
  }

  async function submit(finalAnswers: Record<string, string>) {
    setStep(QUESTIONS.length);
    setBusy(true);
    setError(null);
    try {
      const result = await api<Profile>("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({ answers: finalAnswers }),
      });
      setProfile(result);
    } catch (e: any) {
      setError(e.message || "Something went wrong building your profile");
    } finally {
      setBusy(false);
    }
  }

  // ── Intro ────────────────────────────────────────────────────────────
  if (step === -1) {
    return (
      <Shell>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent font-serif text-4xl font-bold text-white">
            B
          </div>
          <h1 className="font-serif text-2xl font-semibold">
            Karibu, {user.name.split(" ")[0]} — let&apos;s find your niche
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Answer a few short questions about what you do, study, and want to achieve.
            Bermi AI will write a personal profile, identify where your strengths meet a
            real opportunity, and use it to personalise every answer it gives you.
          </p>
          <div className="mx-auto mt-8 flex max-w-xs flex-col gap-2">
            <button type="button" className="btn-accent w-full" onClick={() => setStep(0)}>
              Start — about 3 minutes
            </button>
            <button type="button" className="btn-ghost w-full" onClick={() => void skip()} disabled={busy}>
              Skip for now
            </button>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            You can redo this anytime from “My niche” in the sidebar.
          </p>
        </div>
      </Shell>
    );
  }

  // ── Result / generating ──────────────────────────────────────────────
  if (step >= QUESTIONS.length) {
    return (
      <Shell wide>
        {busy && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-accent font-serif text-3xl font-bold text-white">
              B
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Bermi AI is studying your answers and writing your niche profile…
            </p>
          </div>
        )}
        {error && (
          <div className="text-center">
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
            <button type="button" className="btn-accent" onClick={() => void submit(answers)}>
              Try again
            </button>
            <button type="button" className="btn-ghost ml-2" onClick={() => void skip()}>
              Skip for now
            </button>
          </div>
        )}
        {profile && (
          <div>
            <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-surface-paneldark">
              <Markdown content={profile.profile_markdown || ""} />
            </div>
            {profile.niche_summary && (
              <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-stone-800 dark:bg-accent-softdark dark:text-stone-100">
                🎯 {profile.niche_summary}
              </p>
            )}
            <button
              type="button"
              className="btn-accent mt-5 w-full"
              onClick={() => onDone("completed")}
            >
              Continue to Bermi AI
            </button>
          </div>
        )}
      </Shell>
    );
  }

  // ── Question steps ───────────────────────────────────────────────────
  const q = QUESTIONS[step];
  const optional = step === QUESTIONS.length - 1;
  return (
    <Shell>
      <div className="mb-6 flex justify-center gap-1.5">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-8 rounded-full ${
              i <= step ? "bg-accent" : "bg-stone-200 dark:bg-stone-700"
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h2 className="mt-1 font-serif text-xl font-semibold">{q.question}</h2>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{q.hint}</p>
      <textarea
        autoFocus
        rows={4}
        className="input-base mt-4 resize-none"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && (current.trim() || optional)) next();
        }}
        placeholder="Type your answer…"
      />
      <div className="mt-4 flex items-center justify-between">
        <button type="button" className="btn-ghost" onClick={() => void skip()}>
          Skip onboarding
        </button>
        <button
          type="button"
          className="btn-accent"
          disabled={!current.trim() && !optional}
          onClick={next}
        >
          {step + 1 === QUESTIONS.length ? "Build my profile" : "Next"}
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"}`}>{children}</div>
    </main>
  );
}
