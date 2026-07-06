export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-ink-900/15 border-t-gold-500" />
        <span className="text-sm text-ink-500">Loading…</span>
      </div>
    </div>
  );
}
