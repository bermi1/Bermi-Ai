"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, setToken } from "@/lib/api";

type Mode = "create" | "join";

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body: Record<string, string> = { name, email, password };
      if (mode === "create") body.organization_name = orgName;
      else body.join_code = joinCode;
      const { access_token } = await api<{ access_token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setToken(access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  const tabClass = (active: boolean) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-stone-100"
        : "text-stone-500 hover:text-stone-700 dark:text-stone-400"
    }`;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent font-serif text-3xl font-bold text-white">
            B
          </div>
          <h1 className="font-serif text-2xl font-semibold">Create your Bermi AI account</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Set up your organisation, or join one with a code
          </p>
        </div>

        <div className="mb-4 flex gap-1 rounded-xl bg-stone-200/70 p-1 dark:bg-stone-800">
          <button type="button" className={tabClass(mode === "create")} onClick={() => setMode("create")}>
            New organisation
          </button>
          <button type="button" className={tabClass(mode === "join")} onClick={() => setMode("join")}>
            Join with code
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            required
            placeholder="Full name"
            className="input-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Email address"
            className="input-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password (min 8 characters)"
            className="input-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === "create" ? (
            <input
              required
              placeholder="Organisation name (school, firm, company…)"
              className="input-base"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          ) : (
            <input
              required
              placeholder="Organisation join code"
              className="input-base uppercase"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          )}
          {mode === "join" && (
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Joining with a code creates a member (student) account. An administrator can
              change your role afterwards.
            </p>
          )}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="btn-accent w-full">
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
