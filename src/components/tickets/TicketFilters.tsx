import {
  CATEGORY_OPTIONS,
  DEFAULT_FILTERS,
  PRIORITY_OPTIONS,
  SLA_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
} from "../../features/tickets/ticket.constants";
import type { TicketFilterState } from "../../features/tickets/ticket.types";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

interface Props {
  value: TicketFilterState;
  onChange: (next: TicketFilterState) => void;
  totalFiltered: number;
  totalCount: number;
}

export function TicketFilters({ value, onChange, totalFiltered, totalCount }: Props) {
  const set = <K extends keyof TicketFilterState>(key: K, v: string) => {
    onChange({ ...value, [key]: v } as TicketFilterState);
  };

  const isFiltered =
    value.query !== DEFAULT_FILTERS.query ||
    value.status !== DEFAULT_FILTERS.status ||
    value.priority !== DEFAULT_FILTERS.priority ||
    value.category !== DEFAULT_FILTERS.category ||
    value.sort !== DEFAULT_FILTERS.sort ||
    (value.sla !== undefined && value.sla !== "all");

  const handleReset = () => {
    onChange(DEFAULT_FILTERS);
  };

  return (
    <div className="flex flex-col gap-4 rounded-[2px] border border-black/10 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Select
          label="Status"
          value={value.status}
          onChange={(e) => set("status", e.target.value)}
          options={[{ value: "all", label: "ALL STATUSES" }, ...STATUS_OPTIONS]}
        />
        <Select
          label="Priority"
          value={value.priority}
          onChange={(e) => set("priority", e.target.value)}
          options={[{ value: "all", label: "ALL PRIORITIES" }, ...PRIORITY_OPTIONS]}
        />
        <Select
          label="Category"
          value={value.category}
          onChange={(e) => set("category", e.target.value)}
          options={[{ value: "all", label: "ALL CATEGORIES" }, ...CATEGORY_OPTIONS]}
        />
        <Select
          label="SLA Tracking"
          value={value.sla ?? "all"}
          onChange={(e) => set("sla", e.target.value)}
          options={SLA_OPTIONS}
        />
        <Select
          label="Sort by"
          value={value.sort}
          onChange={(e) => set("sort", e.target.value)}
          options={SORT_OPTIONS}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/10 text-xs font-mono">
        <div className="flex items-center gap-2 text-black">
          <span className="font-bold tracking-wider uppercase">
            REGISTRY MATCH: <span className="font-bold">{totalFiltered}</span> / {totalCount} RECORDS
          </span>
          {isFiltered && (
            <span className="rounded-[2px] border border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-widest">
              FILTER ACTIVE
            </span>
          )}
        </div>

        {isFiltered && (
          <Button variant="secondary" className="min-h-8 px-3 text-xs" onClick={handleReset}>
            RESET FILTERS ✕
          </Button>
        )}
      </div>
    </div>
  );
}
