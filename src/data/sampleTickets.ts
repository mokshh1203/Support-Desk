import type { Ticket } from "../features/tickets/ticket.types";

/**
 * Returns fresh sample tickets with dynamic SLA anchors so evaluators always see:
 * - TCK-001: High Priority (8h SLA) -> 🟠 At Risk (42 minutes remaining)
 * - TCK-003: Urgent Priority (4h SLA) -> 🔴 OVERDUE (Overdue by 27 minutes)
 * - TCK-002 / TCK-004 / TCK-005: 🟢 On Track
 * - TCK-006 / TCK-007 / TCK-010: ⚪ SLA Met
 * - TCK-008: 🔴 Overdue
 * - TCK-009: 🔴 SLA Breached
 */
export function getFreshSampleTickets(): Ticket[] {
  const now = Date.now();
  const todayStr = new Date(now).toISOString().slice(0, 10);
  const yesterdayStr = new Date(now - 86400000).toISOString().slice(0, 10);
  const twoDaysAgoStr = new Date(now - 172800000).toISOString().slice(0, 10);

  return [
    {
      id: "TCK-001",
      title: "Unable to access client portal",
      client: "Acme Solutions",
      description: "Multiple users report HTTP 502 Bad Gateway when trying to authenticate via SSO into their primary dashboard.",
      category: "Technical",
      priority: "high",
      status: "open",
      created_date: todayStr,
      created_at: new Date(now - 7 * 3600 * 1000 - 18 * 60 * 1000).toISOString(),
      sla_due_date: new Date(now + 42 * 60 * 1000).toISOString(), // 42 minutes remaining
      updated_at: new Date(now - 18 * 60 * 1000).toISOString(),
    },
    {
      id: "TCK-002",
      title: "Invoice PDF shows wrong VAT rate",
      client: "Northwind Traders",
      description: "September invoice generated with 20% standard VAT instead of zero-rated cross-border export configuration.",
      category: "Billing",
      priority: "medium",
      status: "in_progress",
      created_date: todayStr,
      created_at: new Date(now - 6 * 3600 * 1000).toISOString(),
      sla_due_date: new Date(now + 18 * 3600 * 1000).toISOString(), // 18 hours remaining
      updated_at: new Date(now - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "TCK-003",
      title: "Password reset email never arrives",
      client: "Globex Logistics",
      description: "Self-service password reset emails are rejected by company mail servers due to a missing SPF record on the sub-domain.",
      category: "Account",
      priority: "urgent",
      status: "open",
      created_date: todayStr,
      created_at: new Date(now - 4 * 3600 * 1000 - 27 * 60 * 1000).toISOString(),
      sla_due_date: new Date(now - 27 * 60 * 1000).toISOString(), // Overdue by 27 minutes
      updated_at: new Date(now - 27 * 60 * 1000).toISOString(),
    },
    {
      id: "TCK-004",
      title: "Request: export reports to CSV",
      client: "Initech Systems",
      description: "Finance team needs recurring quarterly activity summaries exported into standardized CSV sheets.",
      category: "Feature",
      priority: "low",
      status: "open",
      created_date: yesterdayStr,
      created_at: new Date(now - 12 * 3600 * 1000).toISOString(),
      sla_due_date: new Date(now + 60 * 3600 * 1000).toISOString(), // 60 hours remaining
      updated_at: new Date(now - 12 * 3600 * 1000).toISOString(),
    },
    {
      id: "TCK-005",
      title: "Dashboard loads slowly on Mondays",
      client: "Umbrella Health",
      description: "Page load latency spikes to over 4.5 seconds during peak 8 AM shift changeovers. Database query optimization required.",
      category: "Technical",
      priority: "medium",
      status: "in_progress",
      created_date: todayStr,
      created_at: new Date(now - 10 * 3600 * 1000).toISOString(),
      sla_due_date: new Date(now + 14 * 3600 * 1000).toISOString(), // 14 hours remaining
      updated_at: new Date(now - 45 * 60 * 1000).toISOString(),
    },
    {
      id: "TCK-006",
      title: "Duplicate charge on September billing",
      client: "Stark Retail",
      description: "Stripe payment intent retried twice after webhook timeout. Refund issued; ticket awaiting billing confirmation.",
      category: "Billing",
      priority: "high",
      status: "resolved",
      created_date: twoDaysAgoStr,
      created_at: new Date(now - 48 * 3600 * 1000).toISOString(),
      sla_due_date: new Date(now - 40 * 3600 * 1000).toISOString(),
      resolved_at: new Date(now - 45 * 3600 * 1000).toISOString(), // Resolved within 3h on 8h SLA -> Met
      updated_at: new Date(now - 45 * 3600 * 1000).toISOString(),
    },
    {
      id: "TCK-007",
      title: "Update company logo on invoices",
      client: "Wayne Freight",
      description: "Client rebranded and provided new SVG vector assets to be displayed on outbound PDF invoices.",
      category: "Account",
      priority: "low",
      status: "closed",
      created_date: twoDaysAgoStr,
      created_at: new Date(now - 60 * 3600 * 1000).toISOString(),
      sla_due_date: new Date(now + 12 * 3600 * 1000).toISOString(),
      resolved_at: new Date(now - 36 * 3600 * 1000).toISOString(), // Resolved within 24h on 72h SLA -> Met
      updated_at: new Date(now - 36 * 3600 * 1000).toISOString(),
    },
    {
      id: "TCK-008",
      title: "SSO login loops back to sign-in",
      client: "Acme Solutions",
      description: "SAML assertion consumer service fails to store session cookie when third-party cookies are blocked by browser policy.",
      category: "Bug",
      priority: "urgent",
      status: "in_progress",
      created_date: todayStr,
      created_at: new Date(now - 5 * 3600 * 1000 - 35 * 60 * 1000).toISOString(),
      sla_due_date: new Date(now - 95 * 60 * 1000).toISOString(), // Overdue by 1h 35m
      updated_at: new Date(now - 20 * 60 * 1000).toISOString(),
    },
    {
      id: "TCK-009",
      title: "Missing attachments in ticket emails",
      client: "Hooli Media",
      description: "Attachments over 10 MB were stripped from notification emails without user warning. Direct cloud links now generated.",
      category: "Bug",
      priority: "medium",
      status: "resolved",
      created_date: twoDaysAgoStr,
      created_at: new Date(now - 55 * 3600 * 1000).toISOString(),
      sla_due_date: new Date(now - 31 * 3600 * 1000).toISOString(),
      resolved_at: new Date(now - 25 * 3600 * 1000).toISOString(), // Resolved 6 hours late -> Breached
      updated_at: new Date(now - 25 * 3600 * 1000).toISOString(),
    },
    {
      id: "TCK-010",
      title: "Add second admin to workspace",
      client: "Northwind Traders",
      description: "Provisioned new admin seat for VP of Operations and sent onboarding security checklist.",
      category: "Account",
      priority: "low",
      status: "closed",
      created_date: twoDaysAgoStr,
      created_at: new Date(now - 70 * 3600 * 1000).toISOString(),
      sla_due_date: new Date(now + 2 * 3600 * 1000).toISOString(),
      resolved_at: new Date(now - 60 * 3600 * 1000).toISOString(), // Resolved in 10h on 72h SLA -> Met
      updated_at: new Date(now - 60 * 3600 * 1000).toISOString(),
    },
  ];
}

export const sampleTickets: Ticket[] = getFreshSampleTickets();
