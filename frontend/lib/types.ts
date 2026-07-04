export interface Organization {
  id: string;
  name: string;
  vertical: string;
  join_code?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "org_admin" | "super_admin";
  org_id: string;
  organization?: Organization | null;
  onboarding_status: "pending" | "completed" | "skipped";
}

export interface Profile {
  status: "pending" | "completed" | "skipped";
  profile_markdown?: string | null;
  niche_summary?: string | null;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  available: boolean;
  connected: boolean;
  note?: string | null;
}

export interface Conversation {
  id: string;
  title: string;
  mode: string;
  created_at: string;
  updated_at: string;
}

export interface Source {
  index: number;
  document_id: string;
  document_name: string;
  chunk_id: string;
  page?: number | null;
  section?: string | null;
  snippet: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[] | null;
  artifact_id?: string | null;
  created_at: string;
}

export interface Doc {
  id: string;
  filename: string;
  content_type: string;
  status: "processing" | "ready" | "failed";
  scope: "org" | "system";
  error?: string | null;
  page_count: number;
  chunk_count: number;
  created_at: string;
}

export interface Chunk {
  id: string;
  document_id: string;
  chunk_index: number;
  text: string;
  page?: number | null;
  section?: string | null;
}

export interface Artifact {
  id: string;
  title: string;
  kind: string;
  content_markdown: string;
  has_docx: boolean;
  created_at: string;
}
