import type { Ticket, TicketPriority } from "./ticket.types";

export interface SlaTarget {
  hours: number;
  label: string;
}

/** Standard SLA Resolution Guarantees based on Priority */
export const SLA_TARGETS: Record<TicketPriority, SlaTarget> = {
  urgent: { hours: 4, label: "4 hours" },
  high: { hours: 8, label: "8 hours" },
  medium: { hours: 24, label: "24 hours" },
  low: { hours: 72, label: "72 hours" },
};

export type SlaStatus = "on_track" | "at_risk" | "overdue" | "met" | "breached";

export interface SlaInfo {
  targetHours: number;
  targetLabel: string;
  dueDate: Date;
  status: SlaStatus;
  isResolved: boolean;
  remainingMs: number;
  elapsedMs: number;
  percentElapsed: number; // 0 to 100+
  badgeLabel: string; // e.g. "42m remaining" or "Overdue by 27m"
  timeRemainingLabel: string; // e.g. "42 minutes remaining"
  overdueLabel?: string; // e.g. "Overdue by 27 minutes"
  tone: "success" | "warning" | "danger" | "muted" | "info";
  advisoryText: string;
}

/** Formats a millisecond duration into clean, human-readable SLA text */
export function formatSlaDuration(ms: number): string {
  const absMs = Math.abs(ms);
  const minutes = Math.floor(absMs / (60 * 1000));
  const hours = Math.floor(absMs / (60 * 60 * 1000));
  const days = Math.floor(absMs / (24 * 60 * 60 * 1000));

  if (minutes < 1) {
    return "< 1 minute";
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }
  if (hours < 24) {
    const remMinutes = minutes % 60;
    if (remMinutes === 0) {
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    }
    return `${hours}h ${remMinutes}m`;
  }
  const remHours = hours % 24;
  if (remHours === 0) {
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  return `${days}d ${remHours}h`;
}

/** Resolves ticket creation timestamp safely */
function getTicketCreatedAt(ticket: Ticket): Date {
  if (ticket.created_at) {
    const d = new Date(ticket.created_at);
    if (!isNaN(d.getTime())) return d;
  }
  if (ticket.created_date) {
    const d = new Date(ticket.created_date);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

/** Resolves ticket SLA deadline safely */
export function getTicketDueDate(ticket: Ticket): Date {
  if (ticket.sla_due_date) {
    const d = new Date(ticket.sla_due_date);
    if (!isNaN(d.getTime())) return d;
  }
  const created = getTicketCreatedAt(ticket);
  const target = SLA_TARGETS[ticket.priority] ?? SLA_TARGETS.medium;
  return new Date(created.getTime() + target.hours * 3600 * 1000);
}

/** Calculates complete SLA telemetry for any ticket */
export function getTicketSla(ticket: Ticket, now: Date = new Date()): SlaInfo {
  const target = SLA_TARGETS[ticket.priority] ?? SLA_TARGETS.medium;
  const created = getTicketCreatedAt(ticket);
  const dueDate = getTicketDueDate(ticket);

  const totalWindowMs = target.hours * 3600 * 1000;
  const isResolved = ticket.status === "resolved" || ticket.status === "closed";

  if (isResolved) {
    const resolvedDate = ticket.resolved_at
      ? new Date(ticket.resolved_at)
      : ticket.updated_at
      ? new Date(ticket.updated_at)
      : now;

    const met = resolvedDate.getTime() <= dueDate.getTime();
    const elapsedMs = Math.max(0, resolvedDate.getTime() - created.getTime());
    const percentElapsed = Math.min(100, Math.round((elapsedMs / totalWindowMs) * 100));

    if (met) {
      return {
        targetHours: target.hours,
        targetLabel: target.label,
        dueDate,
        status: "met",
        isResolved: true,
        remainingMs: 0,
        elapsedMs,
        percentElapsed,
        badgeLabel: "SLA MET",
        timeRemainingLabel: `Resolved in ${formatSlaDuration(elapsedMs)} (within ${target.label} SLA)`,
        tone: "success",
        advisoryText: `Resolved within the ${target.label} SLA commitment.`,
      };
    } else {
      const breachMs = resolvedDate.getTime() - dueDate.getTime();
      return {
        targetHours: target.hours,
        targetLabel: target.label,
        dueDate,
        status: "breached",
        isResolved: true,
        remainingMs: 0,
        elapsedMs,
        percentElapsed: 100,
        badgeLabel: "SLA BREACHED",
        timeRemainingLabel: `Resolved ${formatSlaDuration(breachMs)} past SLA deadline`,
        overdueLabel: `Overdue by ${formatSlaDuration(breachMs)}`,
        tone: "danger",
        advisoryText: `Resolution exceeded the guaranteed ${target.label} SLA deadline.`,
      };
    }
  }

  // Active tickets (open / in_progress)
  const remainingMs = dueDate.getTime() - now.getTime();
  const elapsedMs = Math.max(0, now.getTime() - created.getTime());
  const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalWindowMs) * 100)));

  if (remainingMs < 0) {
    const overdueMs = Math.abs(remainingMs);
    const overdueDuration = formatSlaDuration(overdueMs);
    return {
      targetHours: target.hours,
      targetLabel: target.label,
      dueDate,
      status: "overdue",
      isResolved: false,
      remainingMs,
      elapsedMs,
      percentElapsed: 100,
      badgeLabel: `Overdue by ${overdueDuration}`,
      timeRemainingLabel: `Overdue by ${overdueDuration}`,
      overdueLabel: `Overdue by ${overdueDuration}`,
      tone: "danger",
      advisoryText: `CRITICAL: SLA breach detected. Overdue by ${overdueDuration}. Immediate escalation required.`,
    };
  }

  // Threshold for "At Risk": remaining <= 1 hour (or <= 25% of SLA)
  const isAtRisk =
    remainingMs <= 60 * 60 * 1000 || // 1 hour or less remaining
    (target.hours <= 8 && remainingMs <= 90 * 60 * 1000) ||
    percentElapsed >= 85;

  const durationStr = formatSlaDuration(remainingMs);

  if (isAtRisk) {
    return {
      targetHours: target.hours,
      targetLabel: target.label,
      dueDate,
      status: "at_risk",
      isResolved: false,
      remainingMs,
      elapsedMs,
      percentElapsed,
      badgeLabel: `${durationStr} remaining`,
      timeRemainingLabel: `${durationStr} remaining`,
      tone: "warning",
      advisoryText: `WARNING: Ticket is at risk of SLA breach. Response required within ${durationStr}.`,
    };
  }

  return {
    targetHours: target.hours,
    targetLabel: target.label,
    dueDate,
    status: "on_track",
    isResolved: false,
    remainingMs,
    elapsedMs,
    percentElapsed,
    badgeLabel: `${durationStr} remaining`,
    timeRemainingLabel: `${durationStr} remaining`,
    tone: "success",
    advisoryText: `Operating within healthy SLA boundaries. ${durationStr} remaining.`,
  };
}
