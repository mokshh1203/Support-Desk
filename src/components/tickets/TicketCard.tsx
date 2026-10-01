import { Link } from "react-router-dom";
import type { Ticket } from "../../features/tickets/ticket.types";
import { formatDate } from "../../lib/format";
import { Card } from "../ui/Card";
import { SlaBadge } from "./SlaBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import { TicketStatusBadge } from "./TicketStatusBadge";

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Card className="flex flex-col gap-3 rounded-[2px] border border-black/10 p-5 bg-white hover:bg-neutral-50 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-black border border-black/10 bg-neutral-100 px-1.5 py-0.5">
            {ticket.id}
          </span>
          <span className="font-mono text-xs text-[#525252] uppercase">
            {ticket.category || "General"}
          </span>
        </div>
        <span className="font-mono text-xs text-black">{formatDate(ticket.created_date)}</span>
      </div>

      <div>
        <Link
          to={`/tickets/${ticket.id}`}
          className="block font-bold text-base text-black hover:text-neutral-600 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] break-words"
        >
          {ticket.title}
        </Link>
        <p className="text-xs uppercase tracking-wider text-[#525252] mt-1">
          CLIENT: <span className="text-black font-semibold">{ticket.client}</span>
        </p>
      </div>

      {ticket.description && (
        <p className="line-clamp-2 text-xs text-[#525252] font-normal break-words">
          {ticket.description}
        </p>
      )}

      {/* SLA Status Row */}
      <div className="flex items-center justify-between py-1">
        <span className="font-mono text-[10px] uppercase text-[#525252] tracking-wider">
          SLA TRACKING:
        </span>
        <SlaBadge ticket={ticket} compact />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-black/10">
        <div className="flex flex-wrap items-center gap-2">
          <TicketPriorityBadge priority={ticket.priority} />
          <TicketStatusBadge status={ticket.status} />
        </div>
        <Link
          to={`/tickets/${ticket.id}`}
          className="inline-flex items-center gap-1 rounded-[2px] border border-black/10 bg-white px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          INSPECT →
        </Link>
      </div>
    </Card>
  );
}
