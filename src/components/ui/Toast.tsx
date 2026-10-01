import { useEffect } from "react";

export type ToastTone = "success" | "danger" | "info";

export interface ToastItem {
  id: string;
  message: string;
  tone?: ToastTone;
}

interface ToastProps {
  toast: ToastItem | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div role="status" aria-live="polite" className="desk-toast">
      <div style={{ flex: 1 }}>
        <p className="type-kicker" style={{ margin: 0, color: "var(--color-muted)" }}>
          {toast.tone === "danger" ? "Notice" : "Queue"}
        </p>
        <p className="type-body" style={{ margin: "2px 0 0" }}>
          {toast.message}
        </p>
      </div>

      <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="btn" style={{ minHeight: 30, padding: "0 10px" }}>
        ✕
      </button>
    </div>
  );
}