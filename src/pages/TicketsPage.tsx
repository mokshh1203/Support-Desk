import { useState } from "react";
import { Link } from "react-router-dom";
import { TicketFilters } from "../components/tickets/TicketFilters";
import { TicketList } from "../components/tickets/TicketList";
import { TicketSearch } from "../components/tickets/TicketSearch";
import { buttonClasses } from "../components/ui/Button";
import { PlusIcon } from "../components/ui/icons";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { DEFAULT_FILTERS } from "../features/tickets/ticket.constants";
import { useFilteredTickets, useTickets } from "../features/tickets/ticket.hooks";
import type { TicketFilterState } from "../features/tickets/ticket.types";

export function TicketsPage() {
  const { tickets, status, reload } = useTickets();
  const [filters, setFilters] = useState<TicketFilterState>(DEFAULT_FILTERS);
  const visible = useFilteredTickets(filters);

  const filtersActive =
    filters.query.trim() !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "all";

  const empty = filtersActive ? (
    <EmptyState
      title="NO MATCHING RECORDS"
      description="Zero tickets match the active query or filter criteria. Widen parameters to inspect queue."
    />
  ) : (
    <EmptyState
      title="REGISTRY EMPTY"
      description="No client support tickets are currently active in this environment."
      action={
        <Link to="/tickets/new" className={buttonClasses("primary")}>
          <PlusIcon />NEW TICKET
        </Link>
      }
    />
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            DISPATCH // REGISTRY
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-1">
            TICKET QUEUE
          </h1>
          <p className="font-mono text-xs text-[#525252] uppercase mt-1">
            ALL TICKETS PERSISTED · {tickets.length} TOTAL IN LOCAL REPOSITORY
          </p>
        </div>
        <Link to="/tickets/new" className={buttonClasses("primary", "h-11 px-6")}>
          <PlusIcon />+ NEW TICKET
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4">
        <TicketSearch
          value={filters.query}
          onChange={(query) => setFilters({ ...filters, query })}
        />
        <TicketFilters
          value={filters}
          onChange={setFilters}
          totalFiltered={visible.length}
          totalCount={tickets.length}
        />
      </div>

      {status === "loading" && <LoadingState />}
      {status === "error" && <ErrorState onRetry={reload} />}
      {status === "ready" && (visible.length ? <TicketList tickets={visible} /> : empty)}
    </div>
  );
}
