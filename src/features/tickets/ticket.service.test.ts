import { describe, it, expect, beforeEach } from "vitest";
import { ticketService } from "./ticket.service";
import { storage } from "../../lib/storage";
import { sampleTickets } from "../../data/sampleTickets";

// Mock localStorage in memory for Node environment
const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    for (const key in mockStorage) {
      delete mockStorage[key];
    }
  },
  get length() {
    return Object.keys(mockStorage).length;
  },
  key: (i: number) => Object.keys(mockStorage)[i] ?? null,
};

describe("Ticket Service & LocalStorage Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seeds sample tickets on initial read when storage is empty", async () => {
    const tickets = await ticketService.getAll();
    expect(tickets.length).toBe(10);
    expect(tickets[0].id).toBe(sampleTickets[0].id);
  });

  it("persists a newly created ticket and increments ID", async () => {
    // Seed first
    await ticketService.getAll();

    const created = await ticketService.create({
      title: "New Server Provisioning",
      client: "Soylent Corp",
      category: "Technical",
      priority: "high",
      status: "open",
      created_date: "2026-09-30",
    });

    expect(created.id).toBe("TCK-011");
    expect(created.title).toBe("New Server Provisioning");

    // Verify it is persisted in storage
    const all = await ticketService.getAll();
    expect(all.length).toBe(11);
    expect(all[0].id).toBe("TCK-011");
  });

  it("updates ticket status, priority, and updates timestamp", async () => {
    await ticketService.getAll();

    const updated = await ticketService.update("TCK-001", {
      status: "resolved",
      priority: "low",
    });

    expect(updated).toBeDefined();
    expect(updated?.status).toBe("resolved");
    expect(updated?.priority).toBe("low");
    expect(updated?.id).toBe("TCK-001"); // Immutable ID
    expect(updated?.updated_at).toBeDefined();

    // Verify persistence
    const reloaded = await ticketService.getById("TCK-001");
    expect(reloaded?.status).toBe("resolved");
    expect(reloaded?.priority).toBe("low");
  });

  it("deletes a ticket and persists deletion", async () => {
    await ticketService.getAll();

    const success = await ticketService.delete("TCK-001");
    expect(success).toBe(true);

    const reloaded = await ticketService.getById("TCK-001");
    expect(reloaded).toBeUndefined();

    const all = await ticketService.getAll();
    expect(all.length).toBe(9);
  });

  it("resets to initial sample data upon request", async () => {
    await ticketService.getAll();
    await ticketService.delete("TCK-001");
    await ticketService.delete("TCK-002");

    let all = await ticketService.getAll();
    expect(all.length).toBe(8);

    const resetTickets = await ticketService.reset();
    expect(resetTickets.length).toBe(10);

    all = await ticketService.getAll();
    expect(all.length).toBe(10);
    expect(all.some((t) => t.id === "TCK-001")).toBe(true);
  });

  it("handles storage failures gracefully", () => {
    // Test storage wrapper soft fail
    expect(storage.get("nonexistent_key_xyz")).toBeNull();
  });
});
