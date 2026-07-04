"use client";

import { useEffect, useState } from "react";
import { API_URL, api, getToken } from "@/lib/api";
import type { Artifact, Chunk, Source } from "@/lib/types";
import Markdown from "./Markdown";

export type PanelContent =
  | { type: "artifact"; artifact: Artifact }
  | { type: "citation"; source: Source };

interface Props {
  content: PanelContent;
  onClose: () => void;
}

export default function ArtifactPanel({ content, onClose }: Props) {
  return (
    <section className="fixed inset-0 z-40 flex flex-col bg-surface-panel dark:bg-surface-paneldark md:static md:z-auto md:w-[44%] md:min-w-[380px] md:max-w-2xl md:border-l md:border-stone-200 md:dark:border-stone-700/60">
      {content.type === "artifact" ? (
        <ArtifactView artifact={content.artifact} onClose={onClose} />
      ) : (
        <CitationView source={content.source} onClose={onClose} />
      )}
    </section>
  );
}

function PanelHeader({
  title,
  subtitle,
  onClose,
  action,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-stone-200 px-4 py-3 dark:border-stone-700/60">
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-serif text-base font-semibold">{title}</h2>
        {subtitle && (
          <p className="truncate text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>
        )}
      </div>
      {action}
      <button type="button" onClick={onClose} className="btn-ghost" aria-label="Close panel">
        ✕
      </button>
    </header>
  );
}

function ArtifactView({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);

  async function download() {
    setDownloading(true);
    try {
      const resp = await fetch(`${API_URL}/api/artifacts/${artifact.id}/download`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!resp.ok) throw new Error("Download failed");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${artifact.title}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <PanelHeader
        title={artifact.title}
        subtitle={`Generated ${artifact.kind}`}
        onClose={onClose}
        action={
          artifact.has_docx ? (
            <button
              type="button"
              onClick={() => void download()}
              disabled={downloading}
              className="btn-accent !px-3 !py-1.5 text-xs"
            >
              {downloading ? "Preparing…" : "⬇ Word (.docx)"}
            </button>
          ) : undefined
        }
      />
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <Markdown content={artifact.content_markdown} />
      </div>
    </>
  );
}

function CitationView({ source, onClose }: { source: Source; onClose: () => void }) {
  const [chunk, setChunk] = useState<Chunk | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setChunk(null);
    setError(null);
    api<Chunk>(`/api/documents/chunks/${source.chunk_id}`)
      .then(setChunk)
      .catch((e) => setError(e.message));
  }, [source.chunk_id]);

  const location = [source.section, source.page ? `page ${source.page}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PanelHeader
        title={source.document_name}
        subtitle={location ? `Cited passage — ${location}` : "Cited passage"}
        onClose={onClose}
      />
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="mb-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent dark:bg-accent-softdark">
          Source [{source.index}]
        </p>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {!chunk && !error && <p className="animate-pulse text-sm text-stone-400">Loading passage…</p>}
        {chunk && (
          <blockquote className="whitespace-pre-wrap rounded-xl border border-stone-200 bg-stone-50 p-4 text-[15px] leading-relaxed dark:border-stone-700 dark:bg-stone-800/50">
            {chunk.text}
          </blockquote>
        )}
      </div>
    </>
  );
}
