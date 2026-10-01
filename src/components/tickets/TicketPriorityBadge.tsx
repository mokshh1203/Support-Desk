import { Badge, type Tone } from "../ui/Badge";
import { PRIORITY_LABEL } from "../../features/tickets/ticket.constants";
import type { TicketPriority } from "../../features/tickets/ticket.types";

const TONE: Record<TicketPriority, Tone> = {
  low: "neutral",
  medium: "warning",
  high: "info",
  urgent: "danger",
};

const SYMBOLS: Record<TicketPriority, string> = {
  urgent: "⚡",
  high: "▲",
  medium: "■",
  low: "▼",
};

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <Badge tone={TONE[priority]}>
      <span className="mr-1 text-[10px]" aria-hidden="true">
        {SYMBOLS[priority]}
      </span>
      <span>{PRIORITY_LABEL[priority]}</span>
    </Badge>
  );
}
