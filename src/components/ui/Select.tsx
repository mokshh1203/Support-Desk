import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Field, controlClasses } from "./Field";

export interface SelectOption {
  value: string;
  label: string;
}

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  hideLabel?: boolean;
  error?: string;
  hint?: string;
};

export function Select({ label, options, hideLabel, error, hint, className, ...rest }: Props) {
  const id = useId();
  return (
    <Field id={id} label={label} hideLabel={hideLabel} error={error} hint={hint}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(controlClasses, error && "border-black bg-neutral-50", className)}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
