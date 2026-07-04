"use client";

import type { Conversation, User } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

interface Props {
  user: User;
  conversations: Conversation[];
  activeId: string | null;
  view: "chat" | "documents";
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenDocuments: () => void;
  onLogout: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  org_admin: "Admin",
  super_admin: "Super admin",
};

export default function Sidebar({
  user,
  conversations,
  activeId,
  view,
  open,
  onClose,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onOpenDocuments,
  onLogout,
}: Props) {
  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-stone-200 bg-stone-100/95 transition-transform dark:border-stone-700/60 dark:bg-[#1A1915] md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-4 pb-2 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-serif text-lg font-bold text-white">
            B
          </div>
          <span className="font-serif text-lg font-semibold">Bermi AI</span>
        </div>

        <div className="px-3 pt-2">
          <button type="button" onClick={onNewChat} className="btn-accent w-full text-left">
            + New chat
          </button>
        </div>

        <nav className="mt-3 px-3">
          <button
            type="button"
            onClick={onOpenDocuments}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              view === "documents"
                ? "bg-stone-200/80 font-medium dark:bg-stone-700/60"
                : "text-stone-600 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-700/40"
            }`}
          >
            📚 Knowledge base
          </button>
        </nav>

        <div className="mt-4 flex-1 overflow-y-auto px-3 pb-2">
          <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-stone-400">
            Conversations
          </p>
          {conversations.length === 0 && (
            <p className="px-3 py-2 text-sm text-stone-400">No conversations yet</p>
          )}
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelectConversation(c.id)}
                  className={`w-full truncate rounded-lg px-3 py-2 pr-8 text-left text-sm transition-colors ${
                    view === "chat" && c.id === activeId
                      ? "bg-stone-200/80 font-medium dark:bg-stone-700/60"
                      : "text-stone-600 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-700/40"
                  }`}
                  title={c.title}
                >
                  {c.title}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteConversation(c.id)}
                  className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 rounded p-1 text-xs text-stone-400 hover:text-red-500 group-hover:block"
                  title="Delete conversation"
                  aria-label="Delete conversation"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-stone-200 p-3 dark:border-stone-700/60">
          {user.organization?.join_code && (
            <p className="mb-2 rounded-lg bg-accent-soft px-3 py-2 text-xs text-stone-700 dark:bg-accent-softdark dark:text-stone-300">
              Invite code: <span className="font-mono font-semibold">{user.organization.join_code}</span>
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                {ROLE_LABELS[user.role] ?? user.role} · {user.organization?.name}
              </p>
            </div>
            <div className="flex shrink-0 items-center">
              <ThemeToggle />
              <button type="button" onClick={onLogout} className="btn-ghost" title="Sign out">
                ⎋
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
