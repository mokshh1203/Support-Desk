import type { ReactNode } from "react";

export type Tone = "neutral" | "info" | "warning" | "orange" | "success" | "danger" | "muted";

const tones: Record<Tone, string> = {
  neutral: "bg-white text-black border border-black/10",
  info: "bg-neutral-100 text-black border border-black/10",
  warning: "bg-neutral-100 text-black border border-black/10",
  orange: "bg-black text-white border border-black",
  success: "bg-neutral-50 text-black border border-black/10",
  danger: "bg-black text-white border border-black",
  muted: "bg-neutral-50 text-[#525252] border border-black/10",
};

/** Strictly rectangular badge with 1px border and monochrome contrast. */
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
