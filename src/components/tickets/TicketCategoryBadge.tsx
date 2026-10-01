import type { TicketCategory } from "../../features/tickets/ticket.types";
import { Badge, type Tone } from "../ui/Badge";

const tones: Record<TicketCategory, Tone> = {
  Bug: "danger",
  Technical: "info",
  Billing: "warning",
  Account: "neutral",
  Feature: "neutral",
  General: "muted",
};

/** Renders nothing when a ticket has no category, so older records stay clean. */
export function TicketCategoryBadge({ category }: { category?: TicketCategory }) {
  if (!category) return null;
  return <Badge tone={tones[category] ?? "muted"}>{category}</Badge>;
}