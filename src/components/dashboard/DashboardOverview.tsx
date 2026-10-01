import { useState } from "react";
import { Link } from "react-router-dom";
import type { TicketStats } from "../../features/tickets/ticket.types";
import { StatCard } from "./StatCard";
import { SystemGuideModal } from "../ui/SystemGuideModal";

interface Props {
  stats: TicketStats;
}

export function DashboardOverview({ stats }: Props) {
  const [guideOpen, setGuideOpen] = useState(false);
  const resolvedOrClosed = stats.resolved + stats.closed;
  const hasSlaIssues = (stats.slaOverdue ?? 0) > 0 || (stats.slaAtRisk ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Real-time SLA Alert Banner when tickets require escalation */}
      {hasSlaIssues && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-red-500/40 bg-red-50 text-red-900 rounded-[2px]">
          <div className="flex items-center gap-3">
            <span className="size-3 rounded-full bg-red-600 animate-pulse shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-red-800">
                SLA BREACH ALERT & ESCALATION WARNING
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                {(stats.slaOverdue ?? 0) > 0 && (
                  <strong className="font-bold underline mr-2">
                    {stats.slaOverdue} {(stats.slaOverdue ?? 0) === 1 ? "ticket is" : "tickets are"} OVERDUE past resolution deadline.
                  </strong>
                )}
                {(stats.slaAtRisk ?? 0) > 0 && (
                  <span>
                    {stats.slaAtRisk} {(stats.slaAtRisk ?? 0) === 1 ? "ticket is" : "tickets are"} AT RISK (&lt; 1 hour remaining).
                  </span>
                )}
              </p>
            </div>
          </div>
          <Link
            to="/tickets?sla=overdue"
            className="shrink-0 px-3 py-1.5 bg-red-600 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-red-700 transition-colors"
          >
            TRIAGE OVERDUE ({stats.slaOverdue}) →
          </Link>
        </div>
      )}

      {/* Primary KPI Row */}
      <section aria-label="Ticket statistics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Tickets"
          value={stats.total}
          to="/tickets"
          subtitle="All active & archived tickets"
        />
        <StatCard
          label="Open Tickets"
          value={stats.open}
          to="/tickets?status=open"
          subtitle="Awaiting support response"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          to="/tickets?status=in_progress"
          subtitle="Currently being handled"
        />
        <StatCard
          label="Resolved / Closed"
          value={resolvedOrClosed}
          to="/tickets?status=resolved"
          subtitle={`${stats.resolved} resolved · ${stats.closed} closed`}
        />
      </section>

      {/* SLA & Health Telemetry Grid */}
      <section aria-label="SLA and operational health" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="🔴 SLA Overdue"
          value={stats.slaOverdue ?? 0}
          to="/tickets?sla=overdue"
          subtitle="Tickets past guaranteed resolution SLA"
        />
        <StatCard
          label="🟠 SLA At Risk"
          value={stats.slaAtRisk ?? 0}
          to="/tickets?sla=at_risk"
          subtitle="Active tickets expiring in less than 1 hour"
        />
        <StatCard
          label="SLA Compliance Rate"
          value={`${stats.slaComplianceRate ?? 100}%`}
          subtitle="Tickets resolved within target or on track"
        />
      </section>

      {/* Layman's Terms Quick Help Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-black/10 bg-neutral-50 rounded-[2px] text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base">💡</span>
          <span className="text-[#525252]">
            <strong className="text-black">SLA in Plain English:</strong> Urgent (4h) · High (8h) · Medium (24h) · Low (72h). 
            Badges show 🟢 On Track, 🟠 At Risk (&lt;1h), or 🔴 Overdue.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-black font-bold hover:underline"
        >
          HOW IT WORKS (GUIDE) ↗
        </button>
      </div>

      {/* Interactive Plain-English Feature & SLA Guide */}
      <SystemGuideModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        defaultTab="sla"
      />
    </div>
  );
}

