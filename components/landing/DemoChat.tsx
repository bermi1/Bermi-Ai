"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDemoStatus, streamDemoChat } from "@/lib/api";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Draft a partnership proposal for a Dar es Salaam school",
  "Andika barua rasmi ya kuomba kazi",
  "Explain compound interest with a simple example",
];

export default function DemoChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [draft, setDraft] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitHit, setLimitHit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getDemoStatus()
      .then((s) => {
        setRemaining(s.remaining);
        if (s.remaining <= 0) setLimitHit(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, draft]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming || limitHit) return;
    setError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", content }]);
    setStreaming(true);
    setDraft("");

    let acc = "";
    await streamDemoChat(content, {
      onMeta: ({ remaining }) => setRemaining(remaining),
      onDelta: (t) => {
        acc += t;
        setDraft(acc);
      },
      onDone: ({ remaining }) => {
        setMessages((m) => [...m, { role: "assistant", content: acc }]);
        setDraft("");
        setRemaining(remaining);
        if (remaining <= 0) setLimitHit(true);
      },
      onLimit: (data) => {
        setDraft("");
        setLimitHit(true);
        setRemaining(0);
      },
      onError: (msg) => {
        setDraft("");
        setError(msg);
      },
    });
    setStreaming(false);
    inputRef.current?.focus();
  }

  const empty = messages.length === 0 && !draft;

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#161512]/80 shadow-2xl shadow-black/40 backdrop-blur">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent font-serif text-sm font-bold text-white">
          B
        </div>
        <span className="text-sm font-medium text-stone-200">Bermi AI</span>
        <span className="ml-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-stone-400">
          live demo
        </span>
        {remaining !== null && !limitHit && (
          <span className="ml-auto text-[11px] text-stone-500">
            {remaining} free {remaining === 1 ? "message" : "messages"} left
          </span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-[300px] overflow-y-auto px-4 py-4 sm:h-[340px]">
        {empty && !limitHit && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="mb-4 text-sm text-stone-400">
              Ask Bermi AI anything — in English or Swahili.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-[13px] text-stone-300 transition-colors hover:border-accent/50 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}
          {draft && <Bubble role="assistant" content={draft} streaming />}
        </div>

        {error && <p className="mt-3 text-center text-xs text-red-400">{error}</p>}
      </div>

      {/* Limit CTA or input */}
      {limitHit ? (
        <div className="border-t border-white/10 bg-accent/[0.06] px-4 py-4 text-center">
          <p className="text-sm text-stone-200">
            You&apos;ve used your free demo messages 🎉
          </p>
          <p className="mt-0.5 text-xs text-stone-400">
            Create a free account to keep chatting — no organisation required.
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <Link
              href="/register"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Sign up free
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-stone-200 transition-colors hover:bg-white/5"
            >
              Log in
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2 border-t border-white/10 p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Bermi AI…"
            disabled={streaming}
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-stone-100 outline-none placeholder:text-stone-500"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
            aria-label="Send"
          >
            ↑
          </button>
        </form>
      )}
    </div>
  );
}

function Bubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent/90 px-3.5 py-2 text-sm text-white">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[90%] rounded-2xl rounded-bl-sm bg-white/[0.05] px-3.5 py-2 text-stone-200 ${
          streaming ? "bermi-caret" : ""
        }`}
      >
        <div className="prose-demo">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
