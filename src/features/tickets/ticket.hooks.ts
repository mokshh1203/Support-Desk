import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTicketContext } from "../../context/TicketContext";
import { filterAndSortTickets, parseUrlFilters, serialiseUrlFilters } from "./ticket.utils";
import type { TicketFilterState } from "./ticket.types";

/**
 * Access centralized ticket state, CRUD actions, and reload triggers.
 */
export function useTickets() {
  const ctx = useTicketContext();
  return {
    tickets: ctx.tickets,
    status: ctx.status,
    stats: ctx.stats,
    reload: ctx.reload,
    create: ctx.createTicket,
    update: ctx.updateTicket,
    updateStatus: ctx.updateStatus,
    updatePriority: ctx.updatePriority,
    remove: ctx.deleteTicket,
    resetToSampleData: ctx.resetToSampleData,
    showToast: ctx.showToast,
  };
}

/**
 * Access a single ticket reactively from the central store.
 */
export function useTicket(id: string | undefined) {
  const { tickets, status, update, updateStatus, updatePriority, remove } = useTickets();

  const ticket = useMemo(() => {
    if (!id) return undefined;
    return tickets.find((t) => t.id === id);
  }, [tickets, id]);

  return {
    ticket,
    status,
    update: (updates: Parameters<typeof update>[1]) => (id ? update(id, updates) : Promise.resolve(undefined)),
    updateStatus: (newStatus: Parameters<typeof updateStatus>[1]) => (id ? updateStatus(id, newStatus) : Promise.resolve(undefined)),
    updatePriority: (newPriority: Parameters<typeof updatePriority>[1]) => (id ? updatePriority(id, newPriority) : Promise.resolve(undefined)),
    remove: () => (id ? remove(id) : Promise.resolve(false)),
  };
}

/**
 * Hook to filter and sort tickets based on search query, status, priority, category, and sort order.
 */
export function useFilteredTickets(filters: TicketFilterState) {
  const { tickets } = useTickets();
  return useMemo(() => filterAndSortTickets(tickets, filters), [tickets, filters]);
}

/**
 * Filter state held in the URL, so a narrowed queue is bookmarkable and the
 * dashboard can deep link into it.
 */
export function useUrlFilters(): [TicketFilterState, (next: TicketFilterState) => void] {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => parseUrlFilters(params), [params]);

  const setFilters = (next: TicketFilterState) => {
    // replace, not push: typing in the search box should not fill the back stack.
    setParams(serialiseUrlFilters(next), { replace: true });
  };

  return [filters, setFilters];
}
