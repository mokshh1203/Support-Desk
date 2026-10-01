export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "Technical" | "Billing" | "Account" | "Bug" | "Feature" | "General";

export interface Ticket {
  id: string;
  title: string;
  client: string;
  description?: string;
  category?: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  created_date: string; // YYYY-MM-DD
  updated_at?: string;  // ISO string
  created_at?: string;  // ISO string with exact timestamp
  sla_due_date?: string; // ISO string when SLA guarantee expires
  resolved_at?: string; // ISO string when resolution was committed
}

export type NewTicketInput = {
  title: string;
  client: string;
  description?: string;
  category?: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  created_date: string;
};

export type TicketFormErrors = Partial<Record<keyof NewTicketInput, string>>;
export type TicketSort = "newest" | "oldest" | "priority" | "client" | "sla_deadline";
export type SlaFilterOption = "all" | "overdue" | "at_risk" | "on_track" | "met";

export interface TicketFilterState {
  query: string;
  status: TicketStatus | "all";
  priority: TicketPriority | "all";
  category: TicketCategory | "all";
  sort: TicketSort;
  sla?: SlaFilterOption;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  urgentOrHigh: number;
  resolutionRate: number;
  // SLA Performance Telemetry
  slaOverdue: number;
  slaAtRisk: number;
  slaOnTrack: number;
  slaComplianceRate: number;
}

export type LoadStatus = "loading" | "ready" | "error";
