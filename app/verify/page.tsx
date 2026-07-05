"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AuthShell from "@/components/landing/AuthShell";
import { ApiError, api, setToken } from "@/lib/api";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("This verification link is missing its token.");
      return;
    }
    api<{ access_token: string }>(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
      method: "POST",
    })
      .then(({ access_token }) => {
        setToken(access_token);
        setState("ok");
        setTimeout(() => router.push("/app"), 1200);
      })
      .catch((err) => {
        setState("error");
        setMessage(
          err instanceof ApiError ? err.message : "We couldn't verify this link. Please try again."
        );
      });
  }, [token, router]);

  if (state === "loading") {
    return (
      <AuthShell title="Verifying…" subtitle="Confirming your email address">
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-accent" />
        </div>
      </AuthShell>
    );
  }
  if (state === "ok") {
    return (
      <AuthShell title="Email confirmed 🎉" subtitle="Taking you into Bermi AI…">
        <p className="text-center text-sm text-stone-300">You&apos;re all set. Redirecting…</p>
      </AuthShell>
    );
  }
  return (
    <AuthShell title="Verification failed" subtitle="This link didn't work">
      <p className="text-center text-sm text-red-300">{message}</p>
      <Link
        href="/login"
        className="mt-5 block rounded-lg border border-white/15 px-4 py-2 text-center text-sm font-medium text-stone-100 transition-colors hover:bg-white/5"
      >
        Go to log in
      </Link>
    </AuthShell>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
