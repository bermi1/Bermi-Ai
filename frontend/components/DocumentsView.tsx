"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Doc, User } from "@/lib/types";

const STATUS_BADGES: Record<Doc["status"], string> = {
  ready: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  processing: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export default function DocumentsView({ user }: { user: User }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canUpload = user.role !== "student";

  const refresh = useCallback(() => {
    api<Doc[]>("/api/documents").then(setDocs).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll while any document is still processing.
  useEffect(() => {
    if (!docs.some((d) => d.status === "processing")) return;
    const timer = setInterval(refresh, 2500);
    return () => clearInterval(timer);
  }, [docs, refresh]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        await api<Doc>("/api/documents", { method: "POST", body: form });
      }
      refresh();
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(doc: Doc) {
    if (!confirm(`Delete "${doc.filename}" from the knowledge base?`)) return;
    try {
      await api(`/api/documents/${doc.id}`, { method: "DELETE" });
      setDocs((d) => d.filter((x) => x.id !== doc.id));
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-semibold">Knowledge base</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Documents uploaded here ground Bermi AI&apos;s answers for everyone in{" "}
        <span className="font-medium">{user.organization?.name}</span>. Answers drawn from
        them include precise citations.
      </p>

      {canUpload ? (
        <label
          className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 px-6 py-8 text-center transition-colors hover:border-accent dark:border-stone-600 ${
            uploading ? "opacity-60" : ""
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
            disabled={uploading}
            onChange={(e) => void upload(e.target.files)}
          />
          <span className="text-3xl">📄</span>
          <span className="mt-2 text-sm font-medium">
            {uploading ? "Uploading…" : "Click to upload documents"}
          </span>
          <span className="mt-1 text-xs text-stone-400">PDF, DOCX, TXT or MD — up to 25 MB</span>
        </label>
      ) : (
        <p className="mt-5 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600 dark:bg-stone-800 dark:text-stone-300">
          Your teachers and administrators manage these materials. Ask Bermi AI anything about
          them from the chat.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <ul className="mt-6 space-y-2">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 dark:border-stone-700 dark:bg-surface-paneldark"
          >
            <span className="text-xl">📄</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{doc.filename}</p>
              <p className="text-xs text-stone-400">
                {doc.status === "ready"
                  ? `${doc.chunk_count} passages${doc.page_count ? ` · ${doc.page_count} pages` : ""}`
                  : doc.status === "failed"
                    ? doc.error || "Processing failed"
                    : "Processing — extracting and indexing…"}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGES[doc.status]}`}
            >
              {doc.status}
            </span>
            {canUpload && (
              <button
                type="button"
                onClick={() => void remove(doc)}
                className="btn-ghost !px-2 text-xs"
                title="Delete document"
              >
                ✕
              </button>
            )}
          </li>
        ))}
        {docs.length === 0 && (
          <li className="rounded-xl border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-400 dark:border-stone-600">
            No documents yet
          </li>
        )}
      </ul>
    </div>
  );
}
