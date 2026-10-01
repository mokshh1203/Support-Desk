import { Link } from "react-router-dom";
import { DashboardOverview } from "../components/dashboard/DashboardOverview";
import { TicketList } from "../components/tickets/TicketList";
import { Button, buttonClasses } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { useTickets } from "../features/tickets/ticket.hooks";
import { sortNewest } from "../features/tickets/ticket.utils";

export function DashboardPage() {
  const { tickets, status, stats, reload, resetToSampleData } = useTickets();

  const urgentCount = tickets.filter((t) => t.priority === "urgent").length;
  const highCount = tickets.filter((t) => t.priority === "high").length;
  const mediumCount = tickets.filter((t) => t.priority === "medium").length;
  const lowCount = tickets.filter((t) => t.priority === "low").length;
  const total = tickets.length || 1;

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-black/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            TELEMETRY // OPERATIONS CONSOLE
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-1">
            OPERATIONS DESK
          </h1>
          <p className="font-mono text-xs text-[#525252] uppercase mt-1">
            {stats.open > 0 ? (
              <span>
                <strong className="text-black font-bold">{stats.open}</strong> CLIENT REQUESTS AWAITING RESPONSE
              </span>
            ) : (
              <span className="text-black font-bold">ALL TICKETS TRIAGED</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/tickets/new" className={buttonClasses("primary", "h-11 px-6")}>
            + CREATE TICKET
          </Link>
        </div>
      </header>

      {status === "loading" && <LoadingState rows={4} />}

      {status === "error" && <ErrorState onRetry={reload} />}

      {status === "ready" && (
        <>
          {/* Main KPI Stat Cards */}
          <DashboardOverview stats={stats} />

          {/* Visual Priority Distribution Bar */}
          {tickets.length > 0 && (
            <Card className="flex flex-col gap-4 p-6 border border-black/10 bg-white">
              <div className="flex items-center justify-between border-b border-black/10 pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-black font-bold">
                  URGENCY DISTRIBUTION RATIO
                </span>
                <span className="font-mono text-xs text-[#525252] uppercase">{tickets.length} RECORDS</span>
              </div>

              {/* Multi-segment progress bar with sharp boundaries */}
              <div className="flex h-4 w-full border border-black/10 bg-neutral-100 overflow-hidden rounded-[2px]">
                {urgentCount > 0 && (
                  <div
                    style={{ width: `${(urgentCount / total) * 100}%` }}
                    className="bg-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    title={`Urgent: ${urgentCount} (${Math.round((urgentCount / total) * 100)}%)`}
                  />
                )}
                {highCount > 0 && (
                  <div
                    style={{ width: `${(highCount / total) * 100}%` }}
                    className="bg-neutral-700 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    title={`High: ${highCount} (${Math.round((highCount / total) * 100)}%)`}
                  />
                )}
                {mediumCount > 0 && (
                  <div
                    style={{ width: `${(mediumCount / total) * 100}%` }}
                    className="bg-neutral-400 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    title={`Medium: ${mediumCount} (${Math.round((mediumCount / total) * 100)}%)`}
                  />
                )}
                {lowCount > 0 && (
                  <div
                    style={{ width: `${(lowCount / total) * 100}%` }}
                    className="bg-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    title={`Low: ${lowCount} (${Math.round((lowCount / total) * 100)}%)`}
                  />
                )}
              </div>

              {/* Monospace Legend with Direct Filter Shortcuts */}
              <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs uppercase">
                <Link to="/tickets?priority=urgent" className="flex items-center gap-2 text-black hover:text-[#525252] transition-colors">
                  <span className="size-3 bg-black rounded-[2px] border border-black/10" />
                  <span>⚡ URGENT:</span>
                  <span className="font-bold">{urgentCount}</span>
                </Link>
                <Link to="/tickets?priority=high" className="flex items-center gap-2 text-black hover:text-[#525252] transition-colors">
                  <span className="size-3 bg-neutral-700 rounded-[2px] border border-black/10" />
                  <span>▲ HIGH:</span>
                  <span className="font-bold">{highCount}</span>
                </Link>
                <Link to="/tickets?priority=medium" className="flex items-center gap-2 text-black hover:text-[#525252] transition-colors">
                  <span className="size-3 bg-neutral-400 rounded-[2px] border border-black/10" />
                  <span>■ MEDIUM:</span>
                  <span className="font-bold">{mediumCount}</span>
                </Link>
                <Link to="/tickets?priority=low" className="flex items-center gap-2 text-black hover:text-[#525252] transition-colors">
                  <span className="size-3 bg-neutral-200 rounded-[2px] border border-black/10" />
                  <span>▼ LOW:</span>
                  <span className="font-bold">{lowCount}</span>
                </Link>
              </div>
            </Card>
          )}

          {/* Recent Tickets Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-black">RECENT DISPATCH LOG</h2>
                <p className="font-mono text-xs text-[#525252] uppercase">Latest 5 enterprise requests</p>
              </div>
              <Link to="/tickets" className="font-mono text-xs uppercase tracking-widest text-black hover:text-[#525252] flex items-center gap-1 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                FULL QUEUE ({tickets.length}) →
              </Link>
            </div>

            {tickets.length ? (
              <TicketList tickets={sortNewest(tickets).slice(0, 5)} />
            ) : (
              <EmptyState
                title="NO ACTIVE RECORDS"
                description="The support registry is currently empty. Initialize a new ticket or restore sample records."
                action={
                  <div className="flex gap-3">
                    <Link to="/tickets/new" className={buttonClasses("primary")}>
                      CREATE TICKET
                    </Link>
                    <Button variant="secondary" onClick={() => void resetToSampleData()}>
                      RESTORE SAMPLE TICKETS
                    </Button>
                  </div>
                }
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
