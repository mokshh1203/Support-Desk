import { useState, useId, useEffect, useRef } from "react";

interface SystemGuideModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "sla" | "dashboard" | "queue" | "intake" | "storage";
}

export function SystemGuideModal({
  open,
  onClose,
  defaultTab = "sla",
}: SystemGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"sla" | "dashboard" | "queue" | "intake" | "storage">(
    defaultTab
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-[2px] border border-black/10 bg-white p-6 sm:p-8 text-black shadow-2xl backdrop:bg-black/60 overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-black/10 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block">
            HOW IT WORKS // PLAIN ENGLISH GUIDE
          </span>
          <h2 id={titleId} className="text-xl sm:text-2xl font-bold tracking-tight text-black mt-0.5">
            System Guide & Features in Layman’s Terms
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close guide"
          className="size-9 flex items-center justify-center border border-black/10 font-mono text-xs hover:bg-black hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          ✕
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-1 border-b border-black/10 py-3 font-mono text-xs uppercase tracking-wider overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("sla")}
          className={`px-3 py-1.5 transition-colors duration-300 ${
            activeTab === "sla"
              ? "bg-black text-white"
              : "bg-neutral-100 text-black hover:bg-neutral-200"
          }`}
        >
          ⏱️ SLA Delivery Promise
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dashboard")}
          className={`px-3 py-1.5 transition-colors duration-300 ${
            activeTab === "dashboard"
              ? "bg-black text-white"
              : "bg-neutral-100 text-black hover:bg-neutral-200"
          }`}
        >
          📊 Dashboard
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`px-3 py-1.5 transition-colors duration-300 ${
            activeTab === "queue"
              ? "bg-black text-white"
              : "bg-neutral-100 text-black hover:bg-neutral-200"
          }`}
        >
          🔍 Queue & Search
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("intake")}
          className={`px-3 py-1.5 transition-colors duration-300 ${
            activeTab === "intake"
              ? "bg-black text-white"
              : "bg-neutral-100 text-black hover:bg-neutral-200"
          }`}
        >
          ✍️ Intake & Edit
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("storage")}
          className={`px-3 py-1.5 transition-colors duration-300 ${
            activeTab === "storage"
              ? "bg-black text-white"
              : "bg-neutral-100 text-black hover:bg-neutral-200"
          }`}
        >
          💾 Memory & Reset
        </button>
      </div>

      {/* Tab contents */}
      <div className="py-6 max-h-[60vh] overflow-y-auto pr-1 space-y-6 text-left">
        {activeTab === "sla" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-neutral-50 p-4 border border-black/10">
              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <span>⏱️ The Core Idea: A Delivery Promise</span>
              </h3>
              <p className="text-sm text-[#525252] mt-1.5 leading-relaxed">
                Think of an SLA (Service Level Agreement) like an Amazon express delivery promise. 
                When a customer files a ticket, the clock starts ticking based on how critical the issue is. 
                Our team promises to resolve it before the countdown timer hits zero.
              </p>
            </div>

            {/* Target windows */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#525252] mb-2">
                THE 4 PROMISE WINDOWS
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 border border-black/10 bg-white">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>⚡ Urgent Priority</span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-black text-white">4 HOURS</span>
                  </div>
                  <p className="text-xs text-[#525252] mt-1">
                    Complete outages & payment failures. All hands on deck.
                  </p>
                </div>
                <div className="p-3 border border-black/10 bg-white">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>▲ High Priority</span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-black text-white">8 HOURS</span>
                  </div>
                  <p className="text-xs text-[#525252] mt-1">
                    Major features broken, reporting tools down, severe client friction.
                  </p>
                </div>
                <div className="p-3 border border-black/10 bg-white">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>■ Medium Priority</span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-neutral-200 text-black">24 HOURS</span>
                  </div>
                  <p className="text-xs text-[#525252] mt-1">
                    Standard bugs and requests with acceptable workarounds.
                  </p>
                </div>
                <div className="p-3 border border-black/10 bg-white">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>▼ Low Priority</span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-neutral-200 text-black">72 HOURS (3 DAYS)</span>
                  </div>
                  <p className="text-xs text-[#525252] mt-1">
                    Minor visual polishes, copy typos, and general questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Traffic Lights */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#525252] mb-2">
                THE 4 TRAFFIC-LIGHT STATUSES
              </p>
              <div className="space-y-2">
                <div className="p-3 border border-emerald-500/20 bg-emerald-50/50 flex items-start gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-[2px] shrink-0">
                    🟢 ON TRACK
                  </span>
                  <div className="text-xs text-[#525252]">
                    <strong className="text-black">Plenty of time left.</strong> Example: <em>&ldquo;7 hours remaining&rdquo;</em>. Support engineers can work through their standard queue without panic.
                  </div>
                </div>

                <div className="p-3 border border-amber-500/20 bg-amber-50/50 flex items-start gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-[2px] shrink-0">
                    🟠 AT RISK
                  </span>
                  <div className="text-xs text-[#525252]">
                    <strong className="text-black">Clock running out fast!</strong> Triggered when less than 1 hour remains. Example: <em>&ldquo;42 minutes remaining&rdquo;</em>. Jump on this ticket immediately.
                  </div>
                </div>

                <div className="p-3 border border-red-500/30 bg-red-50/60 flex items-start gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 rounded-[2px] shrink-0">
                    🔴 OVERDUE
                  </span>
                  <div className="text-xs text-[#525252]">
                    <strong className="text-black">Missed our promise.</strong> The deadline has passed and the client is still waiting. Example: <em>&ldquo;Overdue by 27 minutes&rdquo;</em>. Triggers red alert banners on the dashboard.
                  </div>
                </div>

                <div className="p-3 border border-neutral-300 bg-neutral-50 flex items-start gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-[2px] shrink-0">
                    ⚪ SLA MET / BREACHED
                  </span>
                  <div className="text-xs text-[#525252]">
                    <strong className="text-black">The final report card.</strong> Once a ticket is resolved, the system permanently records whether we solved it before or after the deadline.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-neutral-50 p-4 border border-black/10">
              <h3 className="text-base font-bold text-black">
                📊 The Dashboard: Mission Control
              </h3>
              <p className="text-sm text-[#525252] mt-1.5 leading-relaxed">
                Just like a car dashboard tells you your speed and fuel level, our dashboard shows the health of your customer support team at a single glance.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#525252]">
              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">🚨 Red-Alert Escalation Banner</strong>
                If any ticket becomes overdue, a pulsing red banner appears at the very top of the dashboard so managers and staff immediately see it and can triage it with one click.
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">📈 4 Core Workload Numbers</strong>
                See Total Tickets, tickets still Open (waiting for someone to pick up), In Progress (actively being investigated), and Resolved / Closed.
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">🎯 SLA Compliance Score (%)</strong>
                Calculates your team&apos;s batting average: what percentage of tickets were solved on time without breaking promises.
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">📊 Urgency Distribution Bar</strong>
                A visual progress bar dividing your workload into Urgent (red), High (black), Medium (gray), and Low (light gray).
              </div>
            </div>
          </div>
        )}

        {activeTab === "queue" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-neutral-50 p-4 border border-black/10">
              <h3 className="text-base font-bold text-black">
                🔍 Ticket Queue: The Smart Digital Inbox
              </h3>
              <p className="text-sm text-[#525252] mt-1.5 leading-relaxed">
                A unified list of every customer complaint or question. Designed to be fast, clear, and easy to navigate whether you are on a computer or your phone.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#525252]">
              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">🔎 Instant Search (Keyboard shortcut: &lsquo;/&rsquo;)</strong>
                Type any client name, ticket title, ID (like &ldquo;TCK-001&rdquo;), or description keyword to filter results in milliseconds.
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">🛍️ Shopping-Style Multi Filters</strong>
                Mix and match filters just like shopping on Amazon:
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>Filter by <strong>Status</strong> (Open, In Progress, Resolved, Closed)</li>
                  <li>Filter by <strong>Priority</strong> (Urgent, High, Medium, Low)</li>
                  <li>Filter by <strong>Category</strong> (Technical, Billing, Account, Bug, etc.)</li>
                  <li>Filter by <strong>SLA</strong> (Overdue, At Risk, On Track)</li>
                </ul>
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">🔗 Shareable URLs</strong>
                Whenever you search or filter, the web address updates (e.g. <code>?priority=urgent&amp;sla=overdue</code>). You can copy and send that link to a teammate, and they will see the exact same filtered view.
              </div>
            </div>
          </div>
        )}

        {activeTab === "intake" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-neutral-50 p-4 border border-black/10">
              <h3 className="text-base font-bold text-black">
                ✍️ Intake & Lifecycle: Creating & Resolving Tickets
              </h3>
              <p className="text-sm text-[#525252] mt-1.5 leading-relaxed">
                From the moment a customer calls or emails, to the minute their problem is solved, every step is protected and simple.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#525252]">
              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">➕ Creating a Ticket (`/tickets/new`)</strong>
                Support staff fill out a simple form. The system automatically assigns the next sequential ticket number (like TCK-011) and provides a live preview of the guaranteed SLA deadline as you pick priority.
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">⚡ 1-Click Status & Priority Updates</strong>
                On any ticket page (`/tickets/:id`), change status from Open to In Progress or Resolved with a single click. Upgrading priority to Urgent automatically tightens the deadline.
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">🛡️ Accidental Delete Protection</strong>
                You can delete tickets when needed, but the app always asks for confirmation first so no critical customer history is ever lost by an accidental click.
              </div>
            </div>
          </div>
        )}

        {activeTab === "storage" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-neutral-50 p-4 border border-black/10">
              <h3 className="text-base font-bold text-black">
                💾 Browser Memory: Never Lose Your Work
              </h3>
              <p className="text-sm text-[#525252] mt-1.5 leading-relaxed">
                Everything you do is saved locally inside your web browser. No accidental data loss, no complex server setup needed to try the app.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#525252]">
              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">🔄 Works Across Page Refreshes</strong>
                If your computer restarts or you reload the tab, all created tickets, updated statuses, and edits are still right where you left them.
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">↩️ 1-Click Demo Reset</strong>
                Want a fresh start? Click &ldquo;Reset sample data&rdquo; in the top-right menu or landing page. It immediately restores the 10 standard test tickets with active SLA timers.
              </div>

              <div className="p-3 border border-black/10">
                <strong className="text-black text-sm block mb-1">🔔 Friendly Toast Confirmations</strong>
                Every time you save, update, or delete a ticket, a clean notification slides into the corner of your screen confirming that your change was saved.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-black/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <span className="text-[#525252]">
          TIP: Press <kbd className="border border-black/10 bg-neutral-50 px-1">Esc</kbd> anytime to close this guide.
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-2 bg-black text-white uppercase tracking-wider hover:bg-neutral-800 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          GOT IT, CLOSE GUIDE →
        </button>
      </div>
    </dialog>
  );
}
