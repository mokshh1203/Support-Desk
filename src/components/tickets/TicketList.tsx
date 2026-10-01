import type { Ticket } from "../../features/tickets/ticket.types";
import { TicketCard } from "./TicketCard";
import { TicketTable } from "./TicketTable";

/** Responsive: table from md up, cards below. */
export function TicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <>
      <div className="hidden md:block"><TicketTable tickets={tickets} /></div>
      <ul className="flex flex-col gap-3 md:hidden">
        {tickets.map((t) => <li key={t.id}><TicketCard ticket={t} /></li>)}
      </ul>
    </>
  );
}
