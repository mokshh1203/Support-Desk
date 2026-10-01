import { describe, it, expect } from "vitest";
import { sampleTickets } from "../../data/sampleTickets";
import {
  generateTicketId,
  getTicketStats,
  validateTicketDraft,
  filterAndSortTickets,
  sortNewest,
} from "./ticket.utils";
import type { NewTicketInput, Ticket, TicketFilterState } from "./ticket.types";

describe("Sample Tickets Data", () => {
  it("contains 8-10 sample tickets with all mandatory fields", () => {
    expect(sampleTickets.length).toBeGreaterThanOrEqual(8);
    expect(sampleTickets.length).toBeLessThanOrEqual(10);

    const validPriorities = ["low", "medium", "high", "urgent"];
    const validStatuses = ["open", "in_progress", "resolved", "closed"];

    sampleTickets.forEach((ticket) => {
      expect(ticket.id).toMatch(/^TCK-\d{3,}$/);
      expect(ticket.title.trim().length).toBeGreaterThanOrEqual(3);
      expect(ticket.client.trim().length).toBeGreaterThanOrEqual(2);
      expect(validPriorities).toContain(ticket.priority);
      expect(validStatuses).toContain(ticket.status);
      expect(ticket.created_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(ticket.description).toBeDefined();
      expect(ticket.category).toBeDefined();
    });
  });
});

describe("Dashboard Statistics (getTicketStats)", () => {
  it("calculates accurate total, status counts, urgent counts, and resolution rate", () => {
    const stats = getTicketStats(sampleTickets);
    expect(stats.total).toBe(10);
    expect(stats.open).toBe(sampleTickets.filter((t) => t.status === "open").length);
    expect(stats.inProgress).toBe(sampleTickets.filter((t) => t.status === "in_progress").length);
    expect(stats.resolved).toBe(sampleTickets.filter((t) => t.status === "resolved").length);
    expect(stats.closed).toBe(sampleTickets.filter((t) => t.status === "closed").length);
    expect(stats.urgentOrHigh).toBe(
      sampleTickets.filter((t) => t.priority === "urgent" || t.priority === "high").length
    );

    const resolvedAndClosed = stats.resolved + stats.closed;
    const expectedRate = Math.round((resolvedAndClosed / 10) * 100);
    expect(stats.resolutionRate).toBe(expectedRate);
  });

  it("handles empty ticket queues gracefully without NaN or division by zero", () => {
    const emptyStats = getTicketStats([]);
    expect(emptyStats.total).toBe(0);
    expect(emptyStats.open).toBe(0);
    expect(emptyStats.inProgress).toBe(0);
    expect(emptyStats.resolved).toBe(0);
    expect(emptyStats.closed).toBe(0);
    expect(emptyStats.urgentOrHigh).toBe(0);
    expect(emptyStats.resolutionRate).toBe(0);
  });
});

describe("Ticket ID Generation (generateTicketId)", () => {
  it("increments sequential IDs accurately", () => {
    const nextId = generateTicketId(sampleTickets);
    expect(nextId).toBe("TCK-011");
  });

  it("starts at TCK-001 when queue is empty", () => {
    expect(generateTicketId([])).toBe("TCK-001");
  });

  it("handles non-consecutive or out-of-order IDs by finding highest number", () => {
    const gapped: Ticket[] = [
      { id: "TCK-002", title: "A", client: "B", priority: "low", status: "open", created_date: "2026-09-01" },
      { id: "TCK-099", title: "C", client: "D", priority: "low", status: "open", created_date: "2026-09-01" },
    ];
    expect(generateTicketId(gapped)).toBe("TCK-100");
  });
});

describe("Validation (validateTicketDraft)", () => {
  it("rejects empty fields and invalid inputs", () => {
    const errors = validateTicketDraft({
      title: "   ",
      client: " ",
      priority: "" as any,
      status: "" as any,
      created_date: "",
    });

    expect(errors.title).toBe("Ticket title is required.");
    expect(errors.client).toBe("Client name is required.");
    expect(errors.priority).toBe("Please choose a valid priority level.");
    expect(errors.status).toBe("Please choose a valid ticket status.");
    expect(errors.created_date).toBe("Created date is required.");
  });

  it("enforces minimum length constraints", () => {
    const shortErrors = validateTicketDraft({
      title: "Ab",
      client: "X",
      priority: "medium",
      status: "open",
      created_date: "2026-09-30",
    });
    expect(shortErrors.title).toBe("Title must be at least 3 characters.");
    expect(shortErrors.client).toBe("Client name must be at least 2 characters.");
  });

  it("approves valid ticket inputs with zero errors", () => {
    const valid: NewTicketInput = {
      title: "DNS resolution failure in EU cluster",
      client: "Globex Logistics",
      category: "Technical",
      priority: "urgent",
      status: "open",
      created_date: "2026-09-30",
      description: "Core DNS servers returning SERVFAIL on internal lookups.",
    };
    const errors = validateTicketDraft(valid);
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("Search & Filtering (filterAndSortTickets)", () => {
  const baseFilter: TicketFilterState = {
    query: "",
    status: "all",
    priority: "all",
    category: "all",
    sort: "newest",
  };

  it("searches dynamically and case-insensitively across client, title, ID, category, and description", () => {
    // Client search
    const byClient = filterAndSortTickets(sampleTickets, { ...baseFilter, query: "acme" });
    expect(byClient.length).toBe(2);
    expect(byClient.every((t) => t.client === "Acme Solutions")).toBe(true);

    // ID search
    const byId = filterAndSortTickets(sampleTickets, { ...baseFilter, query: "TCK-003" });
    expect(byId.length).toBe(1);
    expect(byId[0].id).toBe("TCK-003");

    // Title search
    const byTitle = filterAndSortTickets(sampleTickets, { ...baseFilter, query: "vat" });
    expect(byTitle.length).toBe(1);
    expect(byTitle[0].id).toBe("TCK-002");

    // Description search
    const byDesc = filterAndSortTickets(sampleTickets, { ...baseFilter, query: "stripe" });
    expect(byDesc.length).toBe(1);
    expect(byDesc[0].id).toBe("TCK-006");

    // Empty search match
    const emptyMatch = filterAndSortTickets(sampleTickets, { ...baseFilter, query: "nonexistent query" });
    expect(emptyMatch.length).toBe(0);
  });

  it("filters correctly by status, priority, and category", () => {
    // Status filter
    const open = filterAndSortTickets(sampleTickets, { ...baseFilter, status: "open" });
    expect(open.length).toBeGreaterThan(0);
    expect(open.every((t) => t.status === "open")).toBe(true);

    // Priority filter
    const urgent = filterAndSortTickets(sampleTickets, { ...baseFilter, priority: "urgent" });
    expect(urgent.length).toBeGreaterThan(0);
    expect(urgent.every((t) => t.priority === "urgent")).toBe(true);

    // Category filter
    const billing = filterAndSortTickets(sampleTickets, { ...baseFilter, category: "Billing" });
    expect(billing.length).toBeGreaterThan(0);
    expect(billing.every((t) => t.category === "Billing")).toBe(true);
  });

  it("combines search, status, and priority filters simultaneously (intersection)", () => {
    const combined = filterAndSortTickets(sampleTickets, {
      query: "Acme",
      status: "open",
      priority: "high",
      category: "all",
      sort: "newest",
    });
    expect(combined.length).toBe(1);
    expect(combined[0].id).toBe("TCK-001");
    expect(combined[0].client).toBe("Acme Solutions");
    expect(combined[0].status).toBe("open");
    expect(combined[0].priority).toBe("high");
  });

  it("sorts by newest, oldest, priority, and client", () => {
    // Newest
    const newest = filterAndSortTickets(sampleTickets, { ...baseFilter, sort: "newest" });
    for (let i = 0; i < newest.length - 1; i++) {
      expect(newest[i].created_date >= newest[i + 1].created_date).toBe(true);
    }

    // Oldest
    const oldest = filterAndSortTickets(sampleTickets, { ...baseFilter, sort: "oldest" });
    for (let i = 0; i < oldest.length - 1; i++) {
      expect(oldest[i].created_date <= oldest[i + 1].created_date).toBe(true);
    }

    // Priority
    const priorityWeight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
    const byPriority = filterAndSortTickets(sampleTickets, { ...baseFilter, sort: "priority" });
    for (let i = 0; i < byPriority.length - 1; i++) {
      expect(priorityWeight[byPriority[i].priority]).toBeGreaterThanOrEqual(
        priorityWeight[byPriority[i + 1].priority]
      );
    }

    // Client
    const byClient = filterAndSortTickets(sampleTickets, { ...baseFilter, sort: "client" });
    for (let i = 0; i < byClient.length - 1; i++) {
      expect(byClient[i].client.localeCompare(byClient[i + 1].client)).toBeLessThanOrEqual(0);
    }
  });
});

describe("sortNewest utility", () => {
  it("sorts array in descending order by created_date", () => {
    const res = sortNewest(sampleTickets);
    expect(res.length).toBe(sampleTickets.length);
    expect(res[0].created_date >= res[res.length - 1].created_date).toBe(true);
  });
});
