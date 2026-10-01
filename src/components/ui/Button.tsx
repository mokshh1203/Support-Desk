import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] px-6 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-40 select-none active:translate-y-[1px]";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white border border-black hover:bg-neutral-800 hover:text-white",
  secondary:
    "border border-black/10 bg-white text-black hover:bg-black hover:text-white hover:border-black",
  danger:
    "bg-black text-white border border-black hover:bg-neutral-800",
  ghost:
    "text-black border border-transparent hover:border-black/10 hover:bg-neutral-100",
};

/** Also use on router <Link>s so links and buttons look identical. */
export const buttonClasses = (variant: ButtonVariant = "primary", extra?: string) =>
  cn(base, variants[variant], extra);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

export function Button({ variant = "primary", className, type = "button", ...rest }: Props) {
  return <button type={type} className={buttonClasses(variant, className)} {...rest} />;
}
