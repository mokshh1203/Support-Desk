import { DEFAULT_FILTERS, PRIORITY_WEIGHT } from "./ticket.constants";
import { getTicketSla } from "./ticket.sla";
import type {
  NewTicketInput,
  SlaFilterOption,
  Ticket,
  TicketCategory,
  TicketFilterState,
  TicketFormErrors,
  TicketPriority,
  TicketSort,
  TicketStats,
  TicketStatus,
} from "./ticket.types";

export const sortNewest = (tickets: Ticket[]): Ticket[] =>
  [...tickets].sort((a, b) => b.created_date.localeCompare(a.created_date) || b.id.localeCompare(a.id));

export function getTicketStats(tickets: Ticket[], now: Date = new Date()): TicketStats {
  const count = (s: Ticket["status"]) => tickets.filter((t) => t.status === s).length;
  const total = tickets.length;
  const open = count("open");
  const inProgress = count("in_progress");
  const resolved = count("resolved");
  const closed = count("closed");
  const urgentOrHigh = tickets.filter((t) => t.priority === "urgent" || t.priority === "high").length;
  const resolutionRate = total === 0 ? 0 : Math.round(((resolved + closed) / total) * 100);

  // SLA Telemetry
  let slaOverdue = 0;
  let slaAtRisk = 0;
  let slaOnTrack = 0;
  let compliantCount = 0;

  for (const t of tickets) {
    const sla = getTicketSla(t, now);
    if (!sla.isResolved) {
      if (sla.status === "overdue") slaOverdue++;
      else if (sla.status === "at_risk") slaAtRisk++;
      else if (sla.status === "on_track") {
        slaOnTrack++;
        compliantCount++;
      }
    } else {
      if (sla.status === "met") compliantCount++;
    }
  }

  const slaComplianceRate = total === 0 ? 100 : Math.round((compliantCount / total) * 100);

  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    urgentOrHigh,
    resolutionRate,
    slaOverdue,
    slaAtRisk,
    slaOnTrack,
    slaComplianceRate,
  };
}

export function generateTicketId(existing: Ticket[]): string {
  const max = existing.reduce((m, t) => {
    const num = Number(t.id.replace(/\D/g, ""));
    return Math.max(m, isNaN(num) ? 0 : num);
  }, 0);
  return `TCK-${String(max + 1).padStart(3, "0")}`;
}

export function validateTicketDraft(draft: NewTicketInput): TicketFormErrors {
  const errors: TicketFormErrors = {};

  const trimmedTitle = draft.title.trim();
  if (!trimmedTitle) {
    errors.title = "Ticket title is required.";
  } else if (trimmedTitle.length < 3) {
    errors.title = "Title must be at least 3 characters.";
  } else if (trimmedTitle.length > 120) {
    errors.title = "Title cannot exceed 120 characters.";
  }

  const trimmedClient = draft.client.trim();
  if (!trimmedClient) {
    errors.client = "Client name is required.";
  } else if (trimmedClient.length < 2) {
    errors.client = "Client name must be at least 2 characters.";
  } else if (trimmedClient.length > 80) {
    errors.client = "Client name cannot exceed 80 characters.";
  }

  if (!draft.created_date) {
    errors.created_date = "Created date is required.";
  } else if (isNaN(Date.parse(draft.created_date))) {
    errors.created_date = "Please enter a valid date (YYYY-MM-DD).";
  }

  const validPriorities = ["low", "medium", "high", "urgent"];
  if (!draft.priority || !validPriorities.includes(draft.priority)) {
    errors.priority = "Please choose a valid priority level.";
  }

  const validStatuses = ["open", "in_progress", "resolved", "closed"];
  if (!draft.status || !validStatuses.includes(draft.status)) {
    errors.status = "Please choose a valid ticket status.";
  }

  return errors;
}

const STATUS_VALUES = new Set(["open", "in_progress", "resolved", "closed"]);
const PRIORITY_VALUES = new Set(["low", "medium", "high", "urgent"]);
const CATEGORY_VALUES = new Set(["Technical", "Billing", "Account", "Bug", "Feature", "General"]);
const SORT_VALUES = new Set(["newest", "oldest", "priority", "client", "sla_deadline"]);
const SLA_VALUES = new Set(["all", "overdue", "at_risk", "on_track", "met"]);

/**
 * Reads filter state out of a query string, so a narrowed queue is bookmarkable
 * and the dashboard can deep link into it.
 */
export function parseUrlFilters(params: URLSearchParams): TicketFilterState {
  const status = params.get("status");
  const priority = params.get("priority");
  const category = params.get("category");
  const sort = params.get("sort");
  const sla = params.get("sla");

  const state: TicketFilterState = {
    query: params.get("query") ?? DEFAULT_FILTERS.query,
    status: (status && STATUS_VALUES.has(status) ? status : "all") as TicketStatus | "all",
    priority: (priority && PRIORITY_VALUES.has(priority) ? priority : "all") as TicketPriority | "all",
    category: (category && CATEGORY_VALUES.has(category) ? category : "all") as TicketCategory | "all",
    sort: (sort && SORT_VALUES.has(sort) ? sort : DEFAULT_FILTERS.sort) as TicketSort,
  };

  if (sla && SLA_VALUES.has(sla) && sla !== "all") {
    state.sla = sla as SlaFilterOption;
  }

  return state;
}

/** Serialises filter state back to a query string, omitting anything default. */
export function serialiseUrlFilters(filters: TicketFilterState): URLSearchParams {
  const search = new URLSearchParams();

  if (filters.query.trim()) search.set("query", filters.query);
  if (filters.status !== "all") search.set("status", filters.status);
  if (filters.priority !== "all") search.set("priority", filters.priority);
  if (filters.category !== "all") search.set("category", filters.category);
  if (filters.sort !== DEFAULT_FILTERS.sort) search.set("sort", filters.sort);
  if (filters.sla && filters.sla !== "all") search.set("sla", filters.sla);

  return search;
}

export function filterAndSortTickets(
  tickets: Ticket[],
  filters: TicketFilterState,
  now: Date = new Date()
): Ticket[] {
  const q = filters.query.trim().toLowerCase();

  const filtered = tickets.filter((ticket) => {
    // Search match: Title, Client, ID, Category, Description
    if (q) {
      const matchTitle = ticket.title.toLowerCase().includes(q);
      const matchClient = ticket.client.toLowerCase().includes(q);
      const matchId = ticket.id.toLowerCase().includes(q);
      const matchCategory = ticket.category?.toLowerCase().includes(q) ?? false;
      const matchDesc = ticket.description?.toLowerCase().includes(q) ?? false;

      if (!matchTitle && !matchClient && !matchId && !matchCategory && !matchDesc) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== "all" && ticket.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== "all" && ticket.priority !== filters.priority) {
      return false;
    }

    // Category filter
    if (filters.category !== "all" && ticket.category !== filters.category) {
      return false;
    }

    // SLA filter
    if (filters.sla && filters.sla !== "all") {
      const sla = getTicketSla(ticket, now);
      if (filters.sla === "overdue" && sla.status !== "overdue") return false;
      if (filters.sla === "at_risk" && sla.status !== "at_risk") return false;
      if (filters.sla === "on_track" && sla.status !== "on_track") return false;
      if (filters.sla === "met" && sla.status !== "met") return false;
    }

    return true;
  });

  // Sort
  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return b.created_date.localeCompare(a.created_date) || b.id.localeCompare(a.id);
      case "oldest":
        return a.created_date.localeCompare(b.created_date) || a.id.localeCompare(b.id);
      case "priority": {
        const diff = (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
        return diff !== 0 ? diff : b.created_date.localeCompare(a.created_date);
      }
      case "client":
        return a.client.localeCompare(b.client, undefined, { sensitivity: "base" });
      case "sla_deadline": {
        const slaA = getTicketSla(a, now);
        const slaB = getTicketSla(b, now);

        // Active tickets take precedence over resolved
        if (slaA.isResolved && !slaB.isResolved) return 1;
        if (!slaA.isResolved && slaB.isResolved) return -1;

        // Sort by least remaining time (most urgent deadline first)
        return slaA.remainingMs - slaB.remainingMs;
      }
      default:
        return 0;
    }
  });
}
