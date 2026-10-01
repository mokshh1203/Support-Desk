import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "../../features/tickets/ticket.constants";
import { SLA_TARGETS } from "../../features/tickets/ticket.sla";
import type {
  NewTicketInput,
  TicketCategory,
  TicketFormErrors,
  TicketPriority,
  TicketStatus,
} from "../../features/tickets/ticket.types";
import { validateTicketDraft } from "../../features/tickets/ticket.utils";
import { todayISO } from "../../lib/format";
import { Button, buttonClasses } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

interface TicketFormProps {
  initialValues?: Partial<NewTicketInput>;
  onSubmit: (values: NewTicketInput) => Promise<void> | void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function TicketForm({
  initialValues,
  onSubmit,
  submitLabel = "COMMIT TICKET ENTRY",
  isSubmitting = false,
}: TicketFormProps) {
  const [draft, setDraft] = useState<NewTicketInput>({
    title: initialValues?.title ?? "",
    client: initialValues?.client ?? "",
    description: initialValues?.description ?? "",
    category: initialValues?.category ?? "General",
    priority: initialValues?.priority ?? "medium",
    status: initialValues?.status ?? "open",
    created_date: initialValues?.created_date ?? todayISO(),
  });

  const [errors, setErrors] = useState<TicketFormErrors>({});

  const setField = <K extends keyof NewTicketInput>(key: K, value: NewTicketInput[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTicketDraft(draft);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(draft);
    }
  };

  const slaTarget = SLA_TARGETS[draft.priority] ?? SLA_TARGETS.medium;

  return (
    <Card className="max-w-3xl p-8 rounded-[2px] border border-black/10 bg-white">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <div className="border-b border-black/10 pb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            FORM // TICKET ENTRY & SLA COMMITMENT
          </span>
          <p className="text-xs font-mono uppercase text-[#525252] mt-0.5">
            ALL FIELDS VALIDATED AGAINST STRICT ENTERPRISE SCHEMA
          </p>
        </div>

        <Input
          label="TICKET TITLE"
          value={draft.title}
          error={errors.title}
          hint="Summarize the operational issue clearly (minimum 3 characters)"
          onChange={(e) => setField("title", e.target.value)}
          placeholder="e.g. SSO SAML authentication failure on EU gateway"
          required
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="CLIENT ENTITY NAME"
            value={draft.client}
            error={errors.client}
            hint="Organization or enterprise account handle"
            onChange={(e) => setField("client", e.target.value)}
            placeholder="e.g. Acme Corp"
            required
          />

          <Select
            label="CLASSIFICATION CATEGORY"
            value={draft.category}
            options={CATEGORY_OPTIONS}
            onChange={(e) => setField("category", e.target.value as TicketCategory)}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Select
            label="URGENCY PRIORITY"
            value={draft.priority}
            error={errors.priority}
            options={PRIORITY_OPTIONS}
            onChange={(e) => setField("priority", e.target.value as TicketPriority)}
          />

          <Select
            label="INITIAL STATUS"
            value={draft.status}
            error={errors.status}
            options={STATUS_OPTIONS}
            onChange={(e) => setField("status", e.target.value as TicketStatus)}
          />

          <Input
            type="date"
            label="CREATION TIMESTAMP"
            value={draft.created_date}
            error={errors.created_date}
            onChange={(e) => setField("created_date", e.target.value)}
            required
          />
        </div>

        {/* Dynamic SLA Guarantee Banner based on Priority selection */}
        <div className="p-3 border border-black/10 bg-neutral-50 rounded-[2px] font-mono text-xs text-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase text-black">SLA COMMITMENT:</span>
            <span>
              Priority <strong className="uppercase text-black">{draft.priority}</strong> carries an SLA resolution deadline of{" "}
              <strong className="text-black">{slaTarget.label}</strong>.
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest hidden sm:inline">
            AUTO-ASSIGNED ON CREATION
          </span>
        </div>

        <Textarea
          label="DESCRIPTION & CONTEXT (OPTIONAL)"
          value={draft.description ?? ""}
          hint="Include specific reproduction steps, system telemetry, or error logs"
          placeholder="Detailed operational breakdown..."
          rows={4}
          onChange={(e) => setField("description", e.target.value)}
        />

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-black/10">
          <Link to="/tickets" className={buttonClasses("secondary")}>
            CANCEL
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "PERSISTING..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
