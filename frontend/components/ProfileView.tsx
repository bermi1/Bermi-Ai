"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Profile } from "@/lib/types";
import Markdown from "./Markdown";

export default function ProfileView({ onRedo }: { onRedo: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Profile>("/api/onboarding").then(setProfile).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold">My niche</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Bermi AI uses this profile to personalise every answer it gives you.
          </p>
        </div>
        <button type="button" className="btn-accent shrink-0 !px-3 !py-1.5 text-xs" onClick={onRedo}>
          {profile?.status === "completed" ? "Redo onboarding" : "Start onboarding"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {!profile && !error && <p className="mt-6 animate-pulse text-sm text-stone-400">Loading…</p>}

      {profile?.status === "completed" && profile.profile_markdown ? (
        <>
          {profile.niche_summary && (
            <p className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-stone-800 dark:bg-accent-softdark dark:text-stone-100">
              🎯 {profile.niche_summary}
            </p>
          )}
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-surface-paneldark">
            <Markdown content={profile.profile_markdown} />
          </div>
        </>
      ) : (
        profile && (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 px-6 py-10 text-center dark:border-stone-600">
            <p className="text-3xl">🎯</p>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              You haven&apos;t built your niche profile yet. A few questions about what you
              do and want to achieve — Bermi AI does the rest.
            </p>
          </div>
        )
      )}
    </div>
  );
}
