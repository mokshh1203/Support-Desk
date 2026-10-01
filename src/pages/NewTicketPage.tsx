import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TicketForm } from "../components/tickets/TicketForm";
import { useTickets } from "../features/tickets/ticket.hooks";
import type { NewTicketInput } from "../features/tickets/ticket.types";

export function NewTicketPage() {
  const { create } = useTickets();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: NewTicketInput) => {
    try {
      setIsSubmitting(true);
      const created = await create(values);
      navigate(`/tickets/${created.id}`);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top back navigation */}
      <div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-black hover:text-[#525252] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          ← BACK TO DISPATCH QUEUE
        </Link>
      </div>

      <div className="border-b border-black/10 pb-6">
        <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
          NEW DISPATCH ENTRY
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-1">
          INITIALIZE SUPPORT TICKET
        </h1>
        <p className="font-mono text-xs text-[#525252] uppercase mt-1">
          RECORD COMMITS DIRECTLY TO DETERMINISTIC LOCAL PERSISTENCE
        </p>
      </div>

      <TicketForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
