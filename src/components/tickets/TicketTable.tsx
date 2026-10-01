import { Link } from "react-router-dom";
import type { Ticket } from "../../features/tickets/ticket.types";
import { formatDate } from "../../lib/format";
import { SlaBadge } from "./SlaBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import { TicketStatusBadge } from "./TicketStatusBadge";

interface Props {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: Props) {
  return (
    <div className="overflow-x-auto rounded-[2px] border border-black/10 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Support tickets table</caption>
        <thead className="border-b border-black/10 bg-neutral-50">
          <tr className="font-mono text-xs uppercase tracking-wider text-black">
            <th scope="col" className="px-4 py-3">TICKET / IDENTIFIER</th>
            <th scope="col" className="px-4 py-3">CLIENT ENTITY</th>
            <th scope="col" className="px-4 py-3">CATEGORY</th>
            <th scope="col" className="px-4 py-3">PRIORITY</th>
            <th scope="col" className="px-4 py-3">SLA DEADLINE</th>
            <th scope="col" className="px-4 py-3">STATUS</th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">DATE</th>
            <th scope="col" className="px-4 py-3 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {tickets.map((t) => (
            <tr key={t.id} className="transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-neutral-50">
              <td className="px-4 py-3.5 max-w-xs sm:max-w-md">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-black border border-black/10 bg-neutral-100 px-1.5 py-0.5">
                    {t.id}
                  </span>
                </div>
                <Link
                  to={`/tickets/${t.id}`}
                  className="mt-1 block font-bold text-black hover:text-neutral-600 line-clamp-1 break-words transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  title={t.title}
                >
                  {t.title}
                </Link>
                {t.description && (
                  <p className="line-clamp-1 text-xs text-[#525252] font-normal mt-0.5" title={t.description}>
                    {t.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-3.5 max-w-[160px] truncate font-semibold text-black uppercase text-xs tracking-wide" title={t.client}>
                {t.client}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-[#525252] uppercase">
                {t.category || "General"}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <TicketPriorityBadge priority={t.priority} />
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <SlaBadge ticket={t} compact />
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <TicketStatusBadge status={t.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-black">
                {formatDate(t.created_date)}
              </td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                <Link
                  to={`/tickets/${t.id}`}
                  className="inline-flex items-center gap-1 rounded-[2px] border border-black/10 bg-white px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  OPEN →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
