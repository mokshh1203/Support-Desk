import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-start gap-3 rounded-[2px] border border-black/10 bg-white p-8 md:p-12 text-left">
      <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">00 // REGISTRY EMPTY</span>
      <h2 className="text-2xl font-bold tracking-tight text-black">{title}</h2>
      {description && <p className="text-sm max-w-md text-[#525252] font-normal leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
