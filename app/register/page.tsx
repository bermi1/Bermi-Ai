"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell, { authButton, authInput } from "@/components/landing/AuthShell";
import { ApiError, api, setToken } from "@/lib/api";

type TeamMode = "none" | "create" | "join";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamMode, setTeamMode] = useState<TeamMode>("none");
  const [orgName, setOrgName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showTeam, setShowTeam] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const body: Record<string, string> = { name, email, password };
      // Organisation is entirely optional — only sent if the user opted in.
      if (showTeam && teamMode === "create" && orgName.trim()) body.organization_name = orgName;
      if (showTeam && teamMode === "join" && joinCode.trim()) body.join_code = joinCode;

      const resp = await api<{ access_token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setToken(resp.access_token);
      router.push("/app");
    } catch (err) {
      if (err instanceof ApiError && err.status === 202) {
        // Email verification required before login.
        setNotice(err.message);
        setBusy(false);
        return;
      }
      const msg =
        err instanceof ApiError ? err.message : "We couldn't reach the server. Please try again.";
      setError(msg);
      setBusy(false);
    }
  }

  const teamTab = (mode: TeamMode, label: string) => (
    <button
      type="button"
      onClick={() => setTeamMode(mode)}
      className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
        teamMode === mode ? "bg-accent text-white" : "text-stone-400 hover:text-stone-200"
      }`}
    >
      {label}
    </button>
  );

  if (notice) {
    return (
      <AuthShell title="Almost there" subtitle="One quick step to activate your account">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-2xl">
            ✉️
          </div>
          <p className="text-sm text-stone-300">{notice}</p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-stone-100 transition-colors hover:bg-white/5"
          >
            Go to log in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start free as an individual — no organisation needed"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          autoComplete="name"
          placeholder="Full name"
          className={authInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          className={authInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Password (min 8 characters)"
          className={authInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Organisation is an optional upgrade, hidden by default */}
        {!showTeam ? (
          <button
            type="button"
            onClick={() => {
              setShowTeam(true);
              setTeamMode("create");
            }}
            className="w-full text-left text-xs text-stone-500 transition-colors hover:text-stone-300"
          >
            + Setting up for a team or school? <span className="text-accent">Add organisation</span>
          </button>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-stone-300">Organisation (optional)</span>
              <button
                type="button"
                onClick={() => {
                  setShowTeam(false);
                  setTeamMode("none");
                }}
                className="text-xs text-stone-500 hover:text-stone-300"
              >
                Remove
              </button>
            </div>
            <div className="mb-2 flex gap-1 rounded-md bg-black/30 p-0.5">
              {teamTab("create", "Create new")}
              {teamTab("join", "Join with code")}
            </div>
            {teamMode === "create" ? (
              <input
                placeholder="Organisation name"
                className={authInput}
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            ) : (
              <input
                placeholder="Invite code"
                className={`${authInput} uppercase`}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
            )}
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={authButton}>
          {busy ? "Creating account…" : "Create free account"}
        </button>
      </form>
    </AuthShell>
  );
}
