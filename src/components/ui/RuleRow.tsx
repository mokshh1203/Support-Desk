import type { ReactNode } from "react";

/** The label / description / right-aligned value row used across every view. */
export function RuleRow({
  label,
  description,
  value,
}: {
  label: string;
  description: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="rule-row">
      <span className="rule-row__label">{label}</span>
      <span className="rule-row__value">{value}</span>
      <div className="rule-row__description">{description}</div>
    </div>
  );
}