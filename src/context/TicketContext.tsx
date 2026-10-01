import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import { ticketService } from "../features/tickets/ticket.service";
import { getTicketStats } from "../features/tickets/ticket.utils";
import { PRIORITY_LABEL, STATUS_LABEL } from "../features/tickets/ticket.constants";
import type {
  LoadStatus,
  NewTicketInput,
  Ticket,
  TicketPriority,
  TicketStats,
  TicketStatus,
} from "../features/tickets/ticket.types";
import { Toast, type ToastItem, type ToastTone } from "../components/ui/Toast";

interface TicketContextValue {
  tickets: Ticket[];
  status: LoadStatus;
  stats: TicketStats;
  reload: () => Promise<void>;
  createTicket: (input: NewTicketInput) => Promise<Ticket>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<Ticket | undefined>;
  updateStatus: (id: string, status: TicketStatus) => Promise<Ticket | undefined>;
  updatePriority: (id: string, priority: TicketPriority) => Promise<Ticket | undefined>;
  deleteTicket: (id: string) => Promise<boolean>;
  resetToSampleData: () => Promise<void>;
  getTicket: (id: string) => Ticket | undefined;
  showToast: (message: string, tone?: ToastTone) => void;
  dismissToast: () => void;
}

const TicketContext = createContext<TicketContextValue | null>(null);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [toast, setToast] = useState<ToastItem | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = "info") => {
    setToast({ id: String(Date.now()), message, tone });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await ticketService.getAll();
      setTickets(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => getTicketStats(tickets), [tickets]);

  const createTicket = useCallback(async (input: NewTicketInput) => {
    const created = await ticketService.create(input);
    setTickets((prev) => [created, ...prev]);
    showToast(`Ticket ${created.id} created successfully.`, "success");
    return created;
  }, [showToast]);

  const updateTicket = useCallback(async (id: string, updates: Partial<Ticket>) => {
    const updated = await ticketService.update(id, updates);
    if (updated) {
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(`Ticket ${id} updated.`, "success");
    }
    return updated;
  }, [showToast]);

  const updateStatus = useCallback(async (id: string, newStatus: TicketStatus) => {
    const updated = await ticketService.update(id, { status: newStatus });
    if (updated) {
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(`Status updated to "${STATUS_LABEL[newStatus]}".`, "info");
    }
    return updated;
  }, [showToast]);

  const updatePriority = useCallback(async (id: string, newPriority: TicketPriority) => {
    const updated = await ticketService.update(id, { priority: newPriority });
    if (updated) {
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(`Priority updated to "${PRIORITY_LABEL[newPriority]}".`, "info");
    }
    return updated;
  }, [showToast]);

  const deleteTicket = useCallback(async (id: string) => {
    const success = await ticketService.delete(id);
    if (success) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      showToast(`Ticket ${id} permanently deleted.`, "danger");
      return true;
    }
    return false;
  }, [showToast]);

  const resetToSampleData = useCallback(async () => {
    const defaultData = await ticketService.reset();
    setTickets(defaultData);
    showToast("Reset tickets to original sample data.", "info");
  }, [showToast]);

  const getTicket = useCallback((id: string) => {
    return tickets.find((t) => t.id === id);
  }, [tickets]);

  const value = useMemo(
    () => ({
      tickets,
      status,
      stats,
      reload: load,
      createTicket,
      updateTicket,
      updateStatus,
      updatePriority,
      deleteTicket,
      resetToSampleData,
      getTicket,
      showToast,
      dismissToast,
    }),
    [
      tickets,
      status,
      stats,
      load,
      createTicket,
      updateTicket,
      updateStatus,
      updatePriority,
      deleteTicket,
      resetToSampleData,
      getTicket,
      showToast,
      dismissToast,
    ]
  );

  return (
    <TicketContext.Provider value={value}>
      {children}
      <Toast toast={toast} onDismiss={dismissToast} />
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  const ctx = useContext(TicketContext);
  if (!ctx) {
    throw new Error("useTicketContext must be used within a TicketProvider");
  }
  return ctx;
}
