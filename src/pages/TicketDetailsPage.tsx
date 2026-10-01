import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SlaBadge } from "../components/tickets/SlaBadge";
import { TicketPriorityBadge } from "../components/tickets/TicketPriorityBadge";
import { TicketStatusBadge } from "../components/tickets/TicketStatusBadge";
import { Button, buttonClasses } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "../features/tickets/ticket.constants";
import { useTicket } from "../features/tickets/ticket.hooks";
import { getTicketSla } from "../features/tickets/ticket.sla";
import { formatDate } from "../lib/format";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../features/tickets/ticket.types";

export function TicketDetailsPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { ticket, status, update, updateStatus, updatePriority, remove } = useTicket(ticketId);
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editClient, setEditClient] = useState("");
  const [editCategory, setEditCategory] = useState<TicketCategory>("General");
  const [editDescription, setEditDescription] = useState("");

  const handleStartEdit = () => {
    if (!ticket) return;
    setEditTitle(ticket.title);
    setEditClient(ticket.client);
    setEditCategory(ticket.category ?? "General");
    setEditDescription(ticket.description ?? "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!ticket) return;
    if (!editTitle.trim() || !editClient.trim()) return;

    await update({
      title: editTitle.trim(),
      client: editClient.trim(),
      category: editCategory,
      description: editDescription.trim(),
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!ticket) return;
    setIsDeleting(true);
    try {
      await remove();
      navigate("/tickets");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const sla = ticket ? getTicketSla(ticket) : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Top back navigation */}
      <div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-black hover:text-[#525252] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          ← BACK TO QUEUE
        </Link>
      </div>

      {status === "loading" && <LoadingState rows={4} />}
      {status === "error" && <ErrorState />}

      {status === "ready" && !ticket && (
        <EmptyState
          title="TICKET NOT LOCATED"
          description={`No record found matching identifier "${ticketId}". The item may have been permanently purged.`}
          action={
            <Link to="/tickets" className={buttonClasses("primary")}>
              RETURN TO QUEUE
            </Link>
          }
        />
      )}

      {status === "ready" && ticket && sla && (
        <>
          {/* Header Card */}
          <Card className="p-6 md:p-8 rounded-[2px] border border-black/10 bg-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white bg-black px-2 py-0.5 border border-black">
                    {ticket.id}
                  </span>
                  <span className="font-mono text-xs uppercase text-black border border-black/10 px-2 py-0.5 bg-neutral-50">
                    {ticket.category || "General"}
                  </span>
                  <TicketStatusBadge status={ticket.status} />
                  <TicketPriorityBadge priority={ticket.priority} />
                  <SlaBadge ticket={ticket} compact />
                </div>

                {isEditing ? (
                  <div className="mt-4 flex flex-col gap-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-xl sm:text-2xl font-bold uppercase rounded-[2px] border border-black/20 bg-white px-3.5 py-2 text-black focus:border-black focus:outline-none"
                      placeholder="Ticket title"
                      required
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={editClient}
                        onChange={(e) => setEditClient(e.target.value)}
                        className="rounded-[2px] border border-black/20 bg-white px-3.5 py-2 font-mono text-xs uppercase font-bold text-black focus:border-black focus:outline-none"
                        placeholder="Client name"
                        required
                      />
                      <Select
                        label="Category"
                        hideLabel
                        value={editCategory}
                        options={CATEGORY_OPTIONS}
                        onChange={(e) => setEditCategory(e.target.value as TicketCategory)}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-black mt-3 break-words">
                      {ticket.title}
                    </h1>
                    <p className="font-mono text-xs uppercase text-[#525252] mt-2">
                      CLIENT ENTITY: <strong className="text-black font-semibold">{ticket.client}</strong>
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {isEditing ? (
                  <>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      CANCEL
                    </Button>
                    <Button onClick={handleSaveEdit}>SAVE CHANGES</Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={handleStartEdit}>
                      EDIT DETAILS
                    </Button>
                    <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                      PURGE RECORD
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Status, Priority & SLA Telemetry Controller Card */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-6 md:col-span-1">
              <Card className="p-6 flex flex-col gap-4 rounded-[2px] border border-black/10 bg-white">
                <span className="font-mono text-xs uppercase tracking-widest text-black font-bold border-b border-black/10 pb-2">
                  DISPATCH CONTROLS
                </span>
                <div className="flex flex-col gap-4 mt-1">
                  <Select
                    label="DISPATCH STATUS"
                    value={ticket.status}
                    options={STATUS_OPTIONS}
                    onChange={(e) => void updateStatus(e.target.value as TicketStatus)}
                    hint="COMMITS SYNCHRONOUSLY TO STORAGE"
                  />
                  <Select
                    label="URGENCY TIER"
                    value={ticket.priority}
                    options={PRIORITY_OPTIONS}
                    onChange={(e) => void updatePriority(e.target.value as TicketPriority)}
                    hint={`SLA GUARANTEE: ${sla.targetLabel.toUpperCase()}`}
                  />
                </div>
              </Card>

              {/* Dedicated SLA Telemetry Card */}
              <Card className="p-6 flex flex-col gap-4 rounded-[2px] border border-black/10 bg-white">
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-black font-bold">
                    SLA DEADLINE TELEMETRY
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500 uppercase">
                    TARGET: {sla.targetLabel}
                  </span>
                </div>

                <SlaBadge ticket={ticket} />

                <div className="border border-black/10 bg-neutral-50 p-3 rounded-[2px] text-xs font-mono flex flex-col gap-1.5">
                  <div className="flex justify-between text-neutral-600">
                    <span>GUARANTEE WINDOW:</span>
                    <strong className="text-black">{sla.targetLabel}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>RESOLUTION DEADLINE:</span>
                    <strong className="text-black">
                      {formatDate(sla.dueDate.toISOString().slice(0, 10))}
                    </strong>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>EXACT TARGET TIME:</span>
                    <strong className="text-black">
                      {sla.dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </strong>
                  </div>
                </div>

                <p
                  className={`text-xs font-mono p-2.5 rounded-[2px] ${
                    sla.status === "overdue"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : sla.status === "at_risk"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : "bg-neutral-50 text-neutral-600 border border-black/10"
                  }`}
                >
                  {sla.advisoryText}
                </p>
              </Card>
            </div>

            {/* Ticket Information & Description */}
            <Card className="p-6 md:col-span-2 flex flex-col gap-4 rounded-[2px] border border-black/10 bg-white">
              <span className="font-mono text-xs uppercase tracking-widest text-black font-bold border-b border-black/10 pb-2">
                TELEMETRY & LOG
              </span>

              <dl className="grid grid-cols-2 gap-4 border-b border-black/10 pb-4 text-xs font-mono sm:grid-cols-4 uppercase">
                <div>
                  <dt className="text-[#525252]">STATUS</dt>
                  <dd className="mt-1">
                    <TicketStatusBadge status={ticket.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[#525252]">PRIORITY</dt>
                  <dd className="mt-1">
                    <TicketPriorityBadge priority={ticket.priority} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[#525252]">SLA STATUS</dt>
                  <dd className="mt-1">
                    <SlaBadge ticket={ticket} compact />
                  </dd>
                </div>
                <div>
                  <dt className="text-[#525252]">CREATED DATE</dt>
                  <dd className="mt-1 font-bold text-black">{formatDate(ticket.created_date)}</dd>
                </div>
              </dl>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-black font-bold">
                  DESCRIPTION & CONTEXT
                </h3>
                {isEditing ? (
                  <div className="mt-2">
                    <Textarea
                      label="Description"
                      hideLabel
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Ticket details, steps to reproduce, or client correspondence..."
                      rows={5}
                    />
                  </div>
                ) : (
                  <div className="mt-3 rounded-[2px] border border-black/10 bg-neutral-50 p-5 text-black font-mono text-xs whitespace-pre-wrap break-words leading-relaxed">
                    {ticket.description?.trim() ? (
                      ticket.description
                    ) : (
                      <span className="text-[#525252]">NO OPERATIONAL CONTEXT PROVIDED FOR THIS RECORD.</span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Delete Confirmation Modal */}
          <Modal
            open={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            title="PURGE TICKET RECORD?"
          >
            <div className="flex flex-col gap-4 text-left">
              <p className="text-sm font-semibold text-black">
                Confirm permanent destruction of ticket{" "}
                <span className="bg-black text-white px-1.5 py-0.5 font-mono">{ticket.id}</span> (
                {ticket.title}).
              </p>
              <p className="text-xs font-mono uppercase tracking-wider text-[#525252]">
                CRITICAL: THIS RECORD PURGE CANNOT BE REVERSED.
              </p>
              <div className="mt-4 flex items-center justify-end gap-3 border-t border-black/10 pt-4">
                <Button
                  variant="secondary"
                  disabled={isDeleting}
                  onClick={() => setConfirmDelete(false)}
                >
                  CANCEL
                </Button>
                <Button
                  variant="danger"
                  disabled={isDeleting}
                  onClick={() => void handleDelete()}
                >
                  {isDeleting ? "PURGING..." : "CONFIRM PURGE ✕"}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
