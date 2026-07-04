// In production the backend is served from the same origin (/api/* routes to
// the FastAPI function). In local dev the backend runs on :8000.
// NEXT_PUBLIC_API_URL overrides both when set to a non-default value.
const LOCAL_API_URL = "http://localhost:8000";

function resolveApiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured && configured !== LOCAL_API_URL) return configured;
  if (
    typeof window !== "undefined" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) {
    return ""; // same origin
  }
  return LOCAL_API_URL;
}

export const API_URL = resolveApiUrl();

const TOKEN_KEY = "bermi_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData) && options.body) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (resp.status === 204) return undefined as T;
  if (!resp.ok) {
    let detail = resp.statusText;
    try {
      const body = await resp.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* keep statusText */
    }
    throw new ApiError(resp.status, detail);
  }
  return resp.json();
}

export interface StreamCallbacks {
  onMeta?: (data: { conversation_id: string; user_message_id: string }) => void;
  onSources?: (sources: unknown[]) => void;
  onDelta?: (text: string) => void;
  onDone?: (data: { message_id: string; sources: unknown[] }) => void;
  onError?: (message: string) => void;
  onWarning?: (message: string) => void;
}

/** POST to the streaming chat endpoint and dispatch SSE events. */
export async function streamChat(
  body: { conversation_id?: string | null; content: string; mode?: string },
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const token = getToken();
  const resp = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });
  if (!resp.ok || !resp.body) {
    let detail = resp.statusText;
    try {
      const data = await resp.json();
      detail = typeof data.detail === "string" ? data.detail : detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(resp.status, detail);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const dispatch = (block: string) => {
    let event = "message";
    let data = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data) return;
    let parsed: any;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }
    switch (event) {
      case "meta":
        callbacks.onMeta?.(parsed);
        break;
      case "sources":
        callbacks.onSources?.(parsed);
        break;
      case "delta":
        callbacks.onDelta?.(parsed.text ?? "");
        break;
      case "done":
        callbacks.onDone?.(parsed);
        break;
      case "warning":
        callbacks.onWarning?.(parsed.message ?? "");
        break;
      case "error":
        callbacks.onError?.(parsed.message ?? "Unknown error");
        break;
    }
  };

  // SSE blocks are separated by a blank line.
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      if (block.trim()) dispatch(block);
    }
  }
  if (buffer.trim()) dispatch(buffer);
}
