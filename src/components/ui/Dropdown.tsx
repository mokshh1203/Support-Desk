import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** Disclosure-style popover. Closes on Escape and on outside click. */
export function Dropdown({
  label,
  trigger,
  children,
}: {
  label: string;
  trigger: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={root} style={{ position: "relative" }}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="btn"
        style={{ minHeight: 32, padding: "0 12px" }}
      >
        {trigger}
      </button>
      {open && (
        <div id={panelId} className="desk-popover">
          {children}
        </div>
      )}
    </div>
  );
}