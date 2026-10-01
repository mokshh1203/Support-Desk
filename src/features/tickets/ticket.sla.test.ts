import { describe, expect, it } from "vitest";
import {
  formatSlaDuration,
  getTicketSla,
  SLA_TARGETS,
} from "./ticket.sla";
import { filterAndSortTickets, getTicketStats } from "./ticket.utils";
import type { Ticket } from "./ticket.types";

describe("SLA Target Definitions", () => {
  it("defines standard SLA resolution deadlines based on priority", () => {
    expect(SLA_TARGETS.urgent.hours).toBe(4);
    expect(SLA_TARGETS.high.hours).toBe(8);
    expect(SLA_TARGETS.medium.hours).toBe(24);
    expect(SLA_TARGETS.low.hours).toBe(72);
  });
});

describe("formatSlaDuration", () => {
  it("formats minutes accurately", () => {
    expect(formatSlaDuration(42 * 60 * 1000)).toBe("42 minutes");
    expect(formatSlaDuration(27 * 60 * 1000)).toBe("27 minutes");
    expect(formatSlaDuration(1 * 60 * 1000)).toBe("1 minute");
    expect(formatSlaDuration(30 * 1000)).toBe("< 1 minute");
  });

  it("formats hours and days accurately", () => {
    expect(formatSlaDuration(2 * 3600 * 1000)).toBe("2 hours");
    expect(formatSlaDuration(2 * 3600 * 1000 + 15 * 60 * 1000)).toBe("2h 15m");
    expect(formatSlaDuration(24 * 3600 * 1000)).toBe("1 day");
    expect(formatSlaDuration(50 * 3600 * 1000)).toBe("2d 2h");
  });
});

describe("SLA Telemetry Calculation (getTicketSla)", () => {
  const baseNow = new Date("2026-10-01T12:00:00Z");

  it("calculates 🟠 At Risk status when High Priority ticket has 42 minutes remaining", () => {
    // High Priority SLA = 8 hours. If created 7h 18m ago, 42m remain.
    const created = new Date(baseNow.getTime() - (7 * 3600 * 1000 + 18 * 60 * 1000));
    const ticket: Ticket = {
      id: "TCK-TEST-01",
      title: "Test High Priority Ticket",
      client: "Acme",
      priority: "high",
      status: "open",
      created_date: "2026-10-01",
      created_at: created.toISOString(),
    };

    const sla = getTicketSla(ticket, baseNow);
    expect(sla.status).toBe("at_risk");
    expect(sla.targetHours).toBe(8);
    expect(sla.targetLabel).toBe("8 hours");
    expect(sla.timeRemainingLabel).toBe("42 minutes remaining");
    expect(sla.isResolved).toBe(false);
    expect(sla.tone).toBe("warning");
  });

  it("calculates 🔴 OVERDUE status when ticket is overdue by 27 minutes", () => {
    // Urgent Priority SLA = 4 hours. If created 4h 27m ago, it is overdue by 27m.
    const created = new Date(baseNow.getTime() - (4 * 3600 * 1000 + 27 * 60 * 1000));
    const ticket: Ticket = {
      id: "TCK-TEST-02",
      title: "Test Overdue Ticket",
      client: "Globex",
      priority: "urgent",
      status: "open",
      created_date: "2026-10-01",
      created_at: created.toISOString(),
    };

    const sla = getTicketSla(ticket, baseNow);
    expect(sla.status).toBe("overdue");
    expect(sla.isResolved).toBe(false);
    expect(sla.overdueLabel).toBe("Overdue by 27 minutes");
    expect(sla.tone).toBe("danger");
  });

  it("calculates 🟢 On Track status when plenty of time remains", () => {
    const created = new Date(baseNow.getTime() - 1 * 3600 * 1000);
    const ticket: Ticket = {
      id: "TCK-TEST-03",
      title: "Test On Track Ticket",
      client: "Initech",
      priority: "high", // 8h SLA
      status: "open",
      created_date: "2026-10-01",
      created_at: created.toISOString(),
    };

    const sla = getTicketSla(ticket, baseNow);
    expect(sla.status).toBe("on_track");
    expect(sla.timeRemainingLabel).toBe("7 hours remaining");
    expect(sla.tone).toBe("success");
  });

  it("calculates ⚪ SLA Met when resolved within deadline", () => {
    const created = new Date(baseNow.getTime() - 10 * 3600 * 1000);
    const resolved = new Date(baseNow.getTime() - 6 * 3600 * 1000); // 4h after creation, within 8h SLA
    const ticket: Ticket = {
      id: "TCK-TEST-04",
      title: "Test Met Ticket",
      client: "Northwind",
      priority: "high",
      status: "resolved",
      created_date: "2026-10-01",
      created_at: created.toISOString(),
      resolved_at: resolved.toISOString(),
    };

    const sla = getTicketSla(ticket, baseNow);
    expect(sla.status).toBe("met");
    expect(sla.isResolved).toBe(true);
    expect(sla.badgeLabel).toBe("SLA MET");
    expect(sla.tone).toBe("success");
  });

  it("calculates 🔴 SLA Breached when resolved past deadline", () => {
    const created = new Date(baseNow.getTime() - 20 * 3600 * 1000);
    const resolved = new Date(baseNow.getTime() - 5 * 3600 * 1000); // 15h after creation, past 8h SLA
    const ticket: Ticket = {
      id: "TCK-TEST-05",
      title: "Test Breached Ticket",
      client: "Stark",
      priority: "high",
      status: "resolved",
      created_date: "2026-10-01",
      created_at: created.toISOString(),
      resolved_at: resolved.toISOString(),
    };

    const sla = getTicketSla(ticket, baseNow);
    expect(sla.status).toBe("breached");
    expect(sla.isResolved).toBe(true);
    expect(sla.badgeLabel).toBe("SLA BREACHED");
    expect(sla.tone).toBe("danger");
  });
});

describe("SLA Filtering and Sorting in Queue", () => {
  const baseNow = new Date("2026-10-01T12:00:00Z");

  const overdueTicket: Ticket = {
    id: "TCK-001",
    title: "Overdue Item",
    client: "Client A",
    priority: "urgent",
    status: "open",
    created_date: "2026-10-01",
    sla_due_date: new Date(baseNow.getTime() - 30 * 60 * 1000).toISOString(),
  };

  const atRiskTicket: Ticket = {
    id: "TCK-002",
    title: "At Risk Item",
    client: "Client B",
    priority: "high",
    status: "in_progress",
    created_date: "2026-10-01",
    sla_due_date: new Date(baseNow.getTime() + 40 * 60 * 1000).toISOString(),
  };

  const onTrackTicket: Ticket = {
    id: "TCK-003",
    title: "On Track Item",
    client: "Client C",
    priority: "low",
    status: "open",
    created_date: "2026-10-01",
    sla_due_date: new Date(baseNow.getTime() + 48 * 3600 * 1000).toISOString(),
  };

  const tickets = [onTrackTicket, overdueTicket, atRiskTicket];

  it("filters accurately by SLA status", () => {
    const overdueOnly = filterAndSortTickets(
      tickets,
      { query: "", status: "all", priority: "all", category: "all", sort: "newest", sla: "overdue" },
      baseNow
    );
    expect(overdueOnly).toHaveLength(1);
    expect(overdueOnly[0].id).toBe("TCK-001");

    const atRiskOnly = filterAndSortTickets(
      tickets,
      { query: "", status: "all", priority: "all", category: "all", sort: "newest", sla: "at_risk" },
      baseNow
    );
    expect(atRiskOnly).toHaveLength(1);
    expect(atRiskOnly[0].id).toBe("TCK-002");
  });

  it("sorts by SLA deadline with most urgent/breached tickets first", () => {
    const sorted = filterAndSortTickets(
      tickets,
      { query: "", status: "all", priority: "all", category: "all", sort: "sla_deadline" },
      baseNow
    );

    // Overdue ticket should be first, followed by At Risk, followed by On Track
    expect(sorted[0].id).toBe("TCK-001");
    expect(sorted[1].id).toBe("TCK-002");
    expect(sorted[2].id).toBe("TCK-003");
  });
});

describe("Dashboard SLA Statistics (getTicketStats)", () => {
  const baseNow = new Date("2026-10-01T12:00:00Z");

  const tickets: Ticket[] = [
    {
      id: "TCK-01",
      title: "Ticket 1",
      client: "A",
      priority: "urgent",
      status: "open",
      created_date: "2026-10-01",
      sla_due_date: new Date(baseNow.getTime() - 20 * 60 * 1000).toISOString(), // Overdue
    },
    {
      id: "TCK-02",
      title: "Ticket 2",
      client: "B",
      priority: "high",
      status: "in_progress",
      created_date: "2026-10-01",
      sla_due_date: new Date(baseNow.getTime() + 35 * 60 * 1000).toISOString(), // At risk
    },
    {
      id: "TCK-03",
      title: "Ticket 3",
      client: "C",
      priority: "medium",
      status: "open",
      created_date: "2026-10-01",
      sla_due_date: new Date(baseNow.getTime() + 10 * 3600 * 1000).toISOString(), // On track
    },
    {
      id: "TCK-04",
      title: "Ticket 4",
      client: "D",
      priority: "low",
      status: "resolved",
      created_date: "2026-10-01",
      sla_due_date: new Date(baseNow.getTime() + 20 * 3600 * 1000).toISOString(),
      resolved_at: new Date(baseNow.getTime() - 5 * 3600 * 1000).toISOString(), // Met
    },
  ];

  it("calculates SLA overdue, at risk, on track, and compliance metrics", () => {
    const stats = getTicketStats(tickets, baseNow);
    expect(stats.slaOverdue).toBe(1);
    expect(stats.slaAtRisk).toBe(1);
    expect(stats.slaOnTrack).toBe(1);
    // Compliant: Ticket 3 (on track) + Ticket 4 (met) = 2 out of 4 = 50%
    expect(stats.slaComplianceRate).toBe(50);
  });
});
