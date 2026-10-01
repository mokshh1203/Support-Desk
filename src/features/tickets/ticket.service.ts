import { SLA_TARGETS } from "./ticket.sla";
import { ticketStorage } from "./ticket.storage";
import { generateTicketId } from "./ticket.utils";
import type { NewTicketInput, Ticket } from "./ticket.types";

/**
 * Service providing ticket CRUD operations with async signatures.
 * Persists data via ticketStorage and manages SLA target lifecycles.
 */
export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    return ticketStorage.read();
  },

  async getById(id: string): Promise<Ticket | undefined> {
    return ticketStorage.read().find((t) => t.id === id);
  },

  async create(input: NewTicketInput): Promise<Ticket> {
    const all = ticketStorage.read();
    const now = new Date();
    const targetHours = SLA_TARGETS[input.priority]?.hours ?? 24;
    const slaDueDate = new Date(now.getTime() + targetHours * 3600 * 1000);

    const ticket: Ticket = {
      ...input,
      id: generateTicketId(all),
      created_at: now.toISOString(),
      sla_due_date: slaDueDate.toISOString(),
      updated_at: now.toISOString(),
    };
    ticketStorage.write([ticket, ...all]);
    return ticket;
  },

  async update(id: string, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    const all = ticketStorage.read();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) return undefined;

    const existing = all[index];
    const now = new Date();

    const updated: Ticket = {
      ...existing,
      ...updates,
      id, // Immutable ID
      updated_at: now.toISOString(),
    };

    // If status transitioned to resolved or closed, record resolution timestamp for SLA auditing
    if (updates.status && (updates.status === "resolved" || updates.status === "closed")) {
      if (!existing.resolved_at) {
        updated.resolved_at = now.toISOString();
      }
    } else if (updates.status && (updates.status === "open" || updates.status === "in_progress")) {
      // Reopening ticket resets resolved_at
      delete updated.resolved_at;
    }

    // If priority changed, recalculate SLA deadline
    if (updates.priority && updates.priority !== existing.priority) {
      const createdDate = updated.created_at
        ? new Date(updated.created_at)
        : new Date(updated.created_date);
      const targetHours = SLA_TARGETS[updates.priority]?.hours ?? 24;
      updated.sla_due_date = new Date(createdDate.getTime() + targetHours * 3600 * 1000).toISOString();
    }

    const next = [...all];
    next[index] = updated;
    ticketStorage.write(next);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const all = ticketStorage.read();
    const filtered = all.filter((t) => t.id !== id);
    if (filtered.length === all.length) return false;
    ticketStorage.write(filtered);
    return true;
  },

  async reset(): Promise<Ticket[]> {
    return ticketStorage.reset();
  },
};
