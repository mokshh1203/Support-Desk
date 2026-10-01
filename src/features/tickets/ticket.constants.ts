import type {
  SlaFilterOption,
  TicketCategory,
  TicketFilterState,
  TicketPriority,
  TicketSort,
  TicketStatus,
} from "./ticket.types";

export const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const CATEGORY_OPTIONS: { value: TicketCategory; label: string }[] = [
  { value: "Technical", label: "Technical" },
  { value: "Billing", label: "Billing" },
  { value: "Account", label: "Account" },
  { value: "Bug", label: "Bug" },
  { value: "Feature", label: "Feature" },
  { value: "General", label: "General" },
];

export const SORT_OPTIONS: { value: TicketSort; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priority", label: "Highest Priority First" },
  { value: "sla_deadline", label: "SLA Deadline (Urgent First)" },
  { value: "client", label: "Client Name (A–Z)" },
];

export const SLA_OPTIONS: { value: SlaFilterOption; label: string }[] = [
  { value: "all", label: "ALL SLA STATUSES" },
  { value: "overdue", label: "🔴 OVERDUE" },
  { value: "at_risk", label: "🟠 AT RISK (< 1h)" },
  { value: "on_track", label: "🟢 ON TRACK" },
  { value: "met", label: "⚪ RESOLVED (MET SLA)" },
];

export const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label])) as Record<TicketStatus, string>;
export const PRIORITY_LABEL = Object.fromEntries(PRIORITY_OPTIONS.map((o) => [o.value, o.label])) as Record<TicketPriority, string>;

export const PRIORITY_WEIGHT: Record<TicketPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const DEFAULT_FILTERS: TicketFilterState = {
  query: "",
  status: "all",
  priority: "all",
  category: "all",
  sort: "newest",
};
