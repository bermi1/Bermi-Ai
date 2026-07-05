"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ArtifactPanel, { type PanelContent } from "@/components/ArtifactPanel";
import ChatView from "@/components/ChatView";
import DocumentsView from "@/components/DocumentsView";
import IntegrationsView from "@/components/IntegrationsView";
import Onboarding from "@/components/Onboarding";
import ProfileView from "@/components/ProfileView";
import Sidebar from "@/components/Sidebar";
import { api, clearToken, getToken } from "@/lib/api";
import type { Artifact, Conversation, Source, User } from "@/lib/types";

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<"chat" | "documents" | "profile" | "integrations">("chat");
  const [panel, setPanel] = useState<PanelContent | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const refreshConversations = useCallback(() => {
    api<Conversation[]>("/api/conversations").then(setConversations).catch(() => {});
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api<User>("/api/auth/me")
      .then((u) => {
        setUser(u);
        // First visit: offer the niche-profile onboarding (always skippable).
        if (u.onboarding_status === "pending" && u.role !== "student") {
          setShowOnboarding(true);
        }
        refreshConversations();
      })
      .catch(() => {
        clearToken();
        router.replace("/login");
      });
  }, [router, refreshConversations]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-accent font-serif text-3xl font-bold text-white">
          B
        </div>
      </main>
    );
  }

  if (showOnboarding) {
    return (
      <Onboarding
        user={user}
        onDone={(status) => {
          setShowOnboarding(false);
          setUser({ ...user, onboarding_status: status });
          if (status === "completed") setView("profile");
        }}
      />
    );
  }

  function logout() {
    clearToken();
    router.replace("/");
  }

  function newChat() {
    setActiveId(null);
    setView("chat");
    setPanel(null);
    setSidebarOpen(false);
  }

  function selectConversation(id: string) {
    setActiveId(id);
    setView("chat");
    setPanel(null);
    setSidebarOpen(false);
  }

  async function deleteConversation(id: string) {
    if (!confirm("Delete this conversation?")) return;
    await api(`/api/conversations/${id}`, { method: "DELETE" }).catch(() => {});
    if (id === activeId) setActiveId(null);
    refreshConversations();
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar
        user={user}
        conversations={conversations}
        activeId={activeId}
        view={view}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={newChat}
        onSelectConversation={selectConversation}
        onDeleteConversation={(id) => void deleteConversation(id)}
        onOpenView={(v) => {
          setView(v);
          setPanel(null);
          setSidebarOpen(false);
        }}
        onLogout={logout}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 border-b border-stone-200 px-3 py-2 dark:border-stone-700/60 md:hidden">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-serif font-semibold">Bermi AI</span>
        </div>

        <div className="flex min-h-0 flex-1">
          {view === "chat" && (
            <ChatView
              user={user}
              conversationId={activeId}
              onConversationCreated={(id) => {
                setActiveId(id);
                refreshConversations();
              }}
              onConversationsChanged={refreshConversations}
              onOpenCitation={(source: Source) => setPanel({ type: "citation", source })}
              onOpenArtifact={(artifact: Artifact) => setPanel({ type: "artifact", artifact })}
            />
          )}
          {view === "documents" && <DocumentsView user={user} />}
          {view === "profile" && <ProfileView onRedo={() => setShowOnboarding(true)} />}
          {view === "integrations" && <IntegrationsView />}
          {panel && <ArtifactPanel content={panel} onClose={() => setPanel(null)} />}
        </div>
      </main>
    </div>
  );
}
