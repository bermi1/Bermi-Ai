"use client";

import { useEffect, useRef, useState } from "react";
import { api, streamChat } from "@/lib/api";
import type { Artifact, Message, Source, User } from "@/lib/types";
import Markdown from "./Markdown";

interface Props {
  user: User;
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
  onConversationsChanged: () => void;
  onOpenCitation: (source: Source) => void;
  onOpenArtifact: (artifact: Artifact) => void;
}

interface DraftAssistant {
  content: string;
  sources: Source[];
}

const SLASH_KINDS: Record<string, string> = {
  "/proposal": "proposal",
  "/letter": "letter",
  "/report": "report",
};

export default function ChatView({
  user,
  conversationId,
  onConversationCreated,
  onConversationsChanged,
  onOpenCitation,
  onOpenArtifact,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<DraftAssistant | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const convRef = useRef<string | null>(conversationId);

  useEffect(() => {
    // When streaming creates the conversation, the parent echoes the new id
    // back down — don't reset mid-stream state in that case.
    if (conversationId && conversationId === convRef.current) return;
    convRef.current = conversationId;
    setError(null);
    setDraft(null);
    if (!conversationId) {
      setMessages([]);
      return;
    }
    api<Message[]>(`/api/conversations/${conversationId}/messages`)
      .then(setMessages)
      .catch((e) => setError(e.message));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, draft]);

  function citationHandler(sources: Source[] | null | undefined) {
    return (index: number) => {
      const source = sources?.find((s) => s.index === index);
      if (source) onOpenCitation(source);
    };
  }

  async function generateDocument(kind: string, brief: string) {
    setBusy(true);
    setError(null);
    const placeholder: Message = {
      id: `local-${Date.now()}`,
      role: "user",
      content: `/${kind} ${brief}`,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, placeholder]);
    setDraft({ content: `Drafting your ${kind}… this can take a moment.`, sources: [] });
    try {
      const artifact = await api<Artifact>("/api/generate/document", {
        method: "POST",
        body: JSON.stringify({
          kind,
          brief,
          conversation_id: convRef.current,
          use_knowledge_base: true,
        }),
      });
      setDraft(null);
      onOpenArtifact(artifact);
      if (convRef.current) {
        const fresh = await api<Message[]>(`/api/conversations/${convRef.current}/messages`);
        setMessages(fresh);
      } else {
        setMessages((m) => [
          ...m,
          {
            id: artifact.id,
            role: "assistant",
            content: `I've drafted **${artifact.title}** — it's open in the panel on the right.`,
            artifact_id: artifact.id,
            created_at: artifact.created_at,
          },
        ]);
      }
    } catch (e: any) {
      setDraft(null);
      setError(e.message || "Document generation failed");
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    const content = input.trim();
    if (!content || busy) return;
    setInput("");
    setError(null);

    // Slash commands: /proposal, /letter, /report → document generation.
    const command = Object.keys(SLASH_KINDS).find(
      (c) => content === c || content.startsWith(c + " ")
    );
    if (command) {
      const brief = content.slice(command.length).trim();
      if (!brief) {
        setError(`Add a brief after ${command}, e.g. "${command} partnership with Mwananchi Bank"`);
        return;
      }
      await generateDocument(SLASH_KINDS[command], brief);
      return;
    }

    setBusy(true);
    const userMsg: Message = {
      id: `local-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setDraft({ content: "", sources: [] });

    let streamedSources: Source[] = [];
    try {
      await streamChat(
        { conversation_id: convRef.current, content },
        {
          onMeta: ({ conversation_id }) => {
            if (!convRef.current) {
              convRef.current = conversation_id;
              onConversationCreated(conversation_id);
            }
          },
          onSources: (sources) => {
            streamedSources = sources as Source[];
            setDraft((d) => (d ? { ...d, sources: streamedSources } : d));
          },
          onDelta: (text) => {
            setDraft((d) => (d ? { ...d, content: d.content + text } : d));
          },
          onDone: ({ message_id }) => {
            setDraft((d) => {
              if (d) {
                setMessages((m) => [
                  ...m,
                  {
                    id: message_id,
                    role: "assistant",
                    content: d.content,
                    sources: streamedSources.length ? streamedSources : null,
                    created_at: new Date().toISOString(),
                  },
                ]);
              }
              return null;
            });
            onConversationsChanged();
          },
          onError: (message) => setError(message),
        }
      );
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setDraft(null);
    } finally {
      setBusy(false);
      textareaRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  const empty = messages.length === 0 && !draft;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        {empty ? (
          <EmptyState user={user} onSuggestion={(text) => setInput(text)} />
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                onCitationClick={citationHandler(m.sources)}
                onOpenArtifact={onOpenArtifact}
              />
            ))}
            {draft && (
              <div className="flex justify-start">
                <div className="max-w-full rounded-2xl px-1 py-1">
                  {draft.content ? (
                    <Markdown
                      content={draft.content}
                      hasCitations={draft.sources.length > 0}
                      onCitationClick={citationHandler(draft.sources)}
                      className="streaming-caret"
                    />
                  ) : (
                    <p className="animate-pulse text-stone-400">Thinking…</p>
                  )}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-stone-200 bg-surface-light/80 px-4 py-3 backdrop-blur dark:border-stone-700/60 dark:bg-surface-dark/80">
        <div className="mx-auto max-w-3xl">
          {error && (
            <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}
          <div className="flex items-end gap-2 rounded-2xl border border-stone-300 bg-white p-2 shadow-sm focus-within:border-accent dark:border-stone-600 dark:bg-surface-paneldark">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
              }}
              onKeyDown={onKeyDown}
              placeholder={
                user.role === "student"
                  ? "Ask about your study materials…"
                  : "Message Bermi AI — or try /proposal, /letter, /report"
              }
              className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] outline-none placeholder:text-stone-400"
              disabled={busy}
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={busy || !input.trim()}
              className="btn-accent shrink-0 !rounded-xl !px-3.5"
              aria-label="Send message"
            >
              ↑
            </button>
          </div>
          <p className="mt-1.5 text-center text-xs text-stone-400">
            Bermi AI can make mistakes. Answers grounded in your documents include citations.
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onCitationClick,
  onOpenArtifact,
}: {
  message: Message;
  onCitationClick: (index: number) => void;
  onOpenArtifact: (artifact: Artifact) => void;
}) {
  async function openArtifact() {
    if (!message.artifact_id) return;
    const artifact = await api<Artifact>(`/api/artifacts/${message.artifact_id}`);
    onOpenArtifact(artifact);
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-accent-soft px-4 py-2.5 text-[15px] text-stone-800 dark:bg-accent-softdark dark:text-stone-100">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-full">
        <Markdown
          content={message.content}
          hasCitations={!!message.sources?.length}
          onCitationClick={onCitationClick}
        />
        {message.artifact_id && (
          <button
            type="button"
            onClick={() => void openArtifact()}
            className="mt-2 flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:border-accent dark:border-stone-600 dark:bg-surface-paneldark"
          >
            📄 <span className="font-medium">Open document</span>
            <span className="text-xs text-stone-400">artifact</span>
          </button>
        )}
        {!!message.sources?.length && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.sources.map((s) => (
              <button
                key={s.chunk_id}
                type="button"
                onClick={() => onCitationClick(s.index)}
                className="rounded-full border border-stone-300 px-2.5 py-0.5 text-xs text-stone-500 transition-colors hover:border-accent hover:text-accent dark:border-stone-600 dark:text-stone-400"
                title={s.snippet}
              >
                [{s.index}] {s.document_name}
                {s.page ? ` · p.${s.page}` : ""}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ user, onSuggestion }: { user: User; onSuggestion: (text: string) => void }) {
  const suggestions =
    user.role === "student"
      ? [
          "Explain the main ideas in chapter 1 of my uploaded notes",
          "Give me practice questions on the topics in my materials",
          "Nisaidie kuelewa mada hii kwa Kiswahili",
        ]
      : [
          "/proposal a partnership proposal for a Dar es Salaam secondary school",
          "Summarise the key obligations in my uploaded contract, with citations",
          "/letter a formal introduction letter to a new client",
        ];
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent font-serif text-4xl font-bold text-white">
        B
      </div>
      <h2 className="font-serif text-2xl font-semibold">
        {`Karibu, ${user.name.split(" ")[0]}`}
      </h2>
      <p className="mt-1 max-w-md text-sm text-stone-500 dark:text-stone-400">
        Ask anything, ground answers in your organisation&apos;s documents, or generate
        ready-to-submit proposals, letters, and reports.
      </p>
      <div className="mt-6 flex w-full max-w-md flex-col gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestion(s)}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-left text-sm text-stone-600 transition-colors hover:border-accent dark:border-stone-600 dark:bg-surface-paneldark dark:text-stone-300"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
