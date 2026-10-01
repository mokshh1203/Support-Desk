import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS } from "./ticket.constants";
import { parseUrlFilters, serialiseUrlFilters } from "./ticket.utils";
import type { TicketFilterState } from "./ticket.types";

describe("parseUrlFilters", () => {
  it("returns the defaults for an empty query string", () => {
    expect(parseUrlFilters(new URLSearchParams())).toEqual(DEFAULT_FILTERS);
  });

  it("reads every axis out of the query string", () => {
    const params = new URLSearchParams({
      query: "sso",
      status: "in_progress",
      priority: "urgent",
      category: "Technical",
      sort: "priority",
    });

    expect(parseUrlFilters(params)).toEqual({
      query: "sso",
      status: "in_progress",
      priority: "urgent",
      category: "Technical",
      sort: "priority",
    });
  });

  it("falls back to the default for values outside the domain", () => {
    const params = new URLSearchParams({
      status: "purged",
      priority: "immediately",
      category: "Vibes",
      sort: "chaos",
    });

    expect(parseUrlFilters(params)).toEqual(DEFAULT_FILTERS);
  });

  it("keeps valid axes while discarding only the invalid ones", () => {
    const params = new URLSearchParams({ status: "open", priority: "whenever" });
    const filters = parseUrlFilters(params);

    expect(filters.status).toBe("open");
    expect(filters.priority).toBe("all");
  });
});

describe("serialiseUrlFilters", () => {
  it("omits anything left at its default", () => {
    expect(serialiseUrlFilters(DEFAULT_FILTERS).toString()).toBe("");
  });

  it("writes only the axes that differ from the defaults", () => {
    const filters: TicketFilterState = { ...DEFAULT_FILTERS, status: "open", priority: "urgent" };
    expect(serialiseUrlFilters(filters).toString()).toBe("status=open&priority=urgent");
  });

  it("drops a whitespace-only query", () => {
    expect(serialiseUrlFilters({ ...DEFAULT_FILTERS, query: "   " }).toString()).toBe("");
  });

  it("round-trips a narrowed queue", () => {
    const filters: TicketFilterState = {
      query: "billing",
      status: "closed",
      priority: "low",
      category: "Billing",
      sort: "oldest",
    };

    expect(parseUrlFilters(serialiseUrlFilters(filters))).toEqual(filters);
  });
});
