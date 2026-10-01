import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export const controlClasses =
  "min-h-11 w-full rounded-[2px] border border-black/20 bg-white px-3.5 font-sans text-sm text-black placeholder:text-[#737373] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-black focus:outline-none";

interface FieldProps {
  id: string;
  label: string;
  hideLabel?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, hideLabel, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={id} className={cn("font-mono text-xs uppercase tracking-wider font-bold text-black", hideLabel && "sr-only")}>
        {label}
      </label>
      {children}
      {(error || hint) && (
        <p
          id={`${id}-msg`}
          className={cn(
            "text-xs font-mono",
            error ? "font-bold text-black uppercase tracking-wider underline" : "text-[#525252]"
          )}
          role={error ? "alert" : undefined}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
