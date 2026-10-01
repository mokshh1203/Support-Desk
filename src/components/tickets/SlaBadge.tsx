import { getTicketSla, type SlaInfo } from "../../features/tickets/ticket.sla";
import type { Ticket } from "../../features/tickets/ticket.types";

interface SlaBadgeProps {
  ticket: Ticket;
  now?: Date;
  compact?: boolean;
}

export function SlaBadge({ ticket, now, compact = false }: SlaBadgeProps) {
  const sla: SlaInfo = getTicketSla(ticket, now);

  // Status-specific styling
  let containerStyles = "border border-neutral-300 bg-neutral-50 text-neutral-800";
  let dotStyles = "bg-neutral-500";
  let text = sla.badgeLabel;

  if (sla.status === "overdue") {
    containerStyles = "border border-red-500/40 bg-red-50 text-red-700 font-bold";
    dotStyles = "bg-red-600 animate-pulse";
    text = sla.overdueLabel ? `🔴 ${sla.overdueLabel.toUpperCase()}` : "🔴 OVERDUE";
  } else if (sla.status === "at_risk") {
    containerStyles = "border border-amber-500/40 bg-amber-50 text-amber-800 font-bold";
    dotStyles = "bg-amber-500 animate-pulse";
    text = `🟠 AT RISK (${sla.badgeLabel})`;
  } else if (sla.status === "on_track") {
    containerStyles = "border border-emerald-500/30 bg-emerald-50 text-emerald-800";
    dotStyles = "bg-emerald-600";
    text = `🟢 ${sla.badgeLabel}`;
  } else if (sla.status === "met") {
    containerStyles = "border border-neutral-300 bg-neutral-100 text-neutral-600";
    dotStyles = "bg-neutral-400";
    text = "⚪ SLA MET";
  } else if (sla.status === "breached") {
    containerStyles = "border border-red-400/40 bg-red-50 text-red-700";
    dotStyles = "bg-red-500";
    text = "🔴 SLA BREACHED";
  }

  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5"
        title={`Target: ${sla.targetLabel} | Due: ${sla.dueDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`}
      >
        <span
          className={`inline-flex items-center gap-1.5 rounded-[2px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${containerStyles}`}
        >
          <span className={`size-1.5 rounded-full inline-block ${dotStyles}`} aria-hidden="true" />
          <span>{text}</span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-col gap-1 rounded-[2px] p-2.5 font-mono text-xs ${containerStyles}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <span className={`size-2 rounded-full inline-block ${dotStyles}`} />
          {sla.status === "overdue" && "OVERDUE"}
          {sla.status === "at_risk" && "AT RISK"}
          {sla.status === "on_track" && "ON TRACK"}
          {sla.status === "met" && "SLA MET"}
          {sla.status === "breached" && "SLA BREACHED"}
        </span>
        <span className="text-[11px] text-neutral-500 uppercase tracking-widest">
          SLA: {sla.targetLabel}
        </span>
      </div>

      <div className="text-[11px] text-neutral-700 mt-0.5">
        {sla.status === "overdue" && sla.overdueLabel}
        {sla.status === "at_risk" && sla.timeRemainingLabel}
        {sla.status === "on_track" && sla.timeRemainingLabel}
        {sla.isResolved && sla.timeRemainingLabel}
      </div>

      {/* SLA Progress Bar for active tickets */}
      {!sla.isResolved && (
        <div className="mt-1 h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              sla.status === "overdue"
                ? "bg-red-600 w-full"
                : sla.status === "at_risk"
                ? "bg-amber-500"
                : "bg-emerald-600"
            }`}
            style={{ width: `${Math.min(100, sla.percentElapsed)}%` }}
          />
        </div>
      )}
    </div>
  );
}
