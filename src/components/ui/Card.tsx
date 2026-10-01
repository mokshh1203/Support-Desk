import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2px] border border-black/10 bg-white text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        className
      )}
      {...rest}
    />
  );
}
