import { Badge, type Tone } from "../ui/Badge";
import { STATUS_LABEL } from "../../features/tickets/ticket.constants";
import type { TicketStatus } from "../../features/tickets/ticket.types";

const TONE: Record<TicketStatus, Tone> = {
  open: "orange",
  in_progress: "info",
  resolved: "neutral",
  closed: "muted",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge tone={TONE[status]}>
      <span
        className={`mr-1.5 inline-block size-1.5 rounded-none ${
          status === "open"
            ? "bg-white"
            : status === "in_progress"
            ? "bg-swiss-accent"
            : status === "resolved"
            ? "bg-black"
            : "bg-muted"
        }`}
        aria-hidden="true"
      />
      <span>{STATUS_LABEL[status]}</span>
    </Badge>
  );
}
