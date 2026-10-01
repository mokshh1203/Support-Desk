import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Field, controlClasses } from "./Field";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hideLabel?: boolean;
  error?: string;
  hint?: string;
};

export function Input({ label, hideLabel, error, hint, className, ...rest }: Props) {
  const id = useId();
  return (
    <Field id={id} label={label} hideLabel={hideLabel} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(controlClasses, error && "border-black bg-neutral-50", className)}
        {...rest}
      />
    </Field>
  );
}
