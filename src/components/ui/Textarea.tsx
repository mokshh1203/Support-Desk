import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Field, controlClasses } from "./Field";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hideLabel?: boolean;
  error?: string;
  hint?: string;
};

export function Textarea({ label, hideLabel, error, hint, className, ...rest }: Props) {
  const id = useId();
  return (
    <Field id={id} label={label} hideLabel={hideLabel} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(
          controlClasses,
          "min-h-28 py-2.5 resize-y",
          error && "border-black bg-neutral-50",
          className
        )}
        {...rest}
      />
    </Field>
  );
}
