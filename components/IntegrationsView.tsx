"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Integration } from "@/lib/types";

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Integration[]>("/api/integrations").then(setIntegrations).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-semibold">Integrations</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Bermi AI is growing beyond chat — connect the tools you already use.
      </p>
      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <ul className="mt-6 space-y-3">
        {integrations.map((it) => (
          <li
            key={it.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-surface-paneldark"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{it.name}</p>
                <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{it.description}</p>
              </div>
              <button
                type="button"
                className="btn-accent shrink-0 !px-3 !py-1.5 text-xs"
                disabled={!it.available || it.connected}
              >
                {it.connected ? "Connected" : it.available ? "Connect" : "Coming soon"}
              </button>
            </div>
            {it.note && (
              <p className="mt-3 rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                {it.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
