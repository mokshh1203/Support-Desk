import { storage } from "../../lib/storage";
import { getFreshSampleTickets } from "../../data/sampleTickets";
import type { Ticket } from "./ticket.types";

const KEY = "tickets";

/** Adapter between the ticket domain and persistent storage. Seeds fresh sample data on first read. */
export const ticketStorage = {
  read(): Ticket[] {
    const saved = storage.get<Ticket[]>(KEY);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    // If not seeded yet, seed default sample data
    const fresh = getFreshSampleTickets();
    storage.set(KEY, fresh);
    return fresh;
  },
  write(tickets: Ticket[]): void {
    storage.set(KEY, tickets);
  },
  reset(): Ticket[] {
    const fresh = getFreshSampleTickets();
    storage.set(KEY, fresh);
    return fresh;
  },
};
