import { useEffect, useRef } from "react";

interface TicketSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export function TicketSearch({ value, onChange }: TicketSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.tagName !== "SELECT"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-black">
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="SEARCH TICKETS BY TITLE, CLIENT, ID... (PRESS / TO FOCUS)"
        aria-label="Search tickets"
        className="min-h-12 w-full rounded-[2px] border border-black/20 bg-white pl-10 pr-16 text-xs md:text-sm font-sans uppercase tracking-wider text-black placeholder:text-[#737373] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-black focus:outline-none"
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="flex size-7 items-center justify-center rounded-[2px] border border-black/20 bg-white text-black hover:bg-black hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            ✕
          </button>
        ) : (
          <kbd
            aria-hidden="true"
            className="hidden sm:inline-flex items-center rounded-[2px] border border-black/20 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono font-bold text-[#525252]"
          >
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
