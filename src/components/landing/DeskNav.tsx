import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * The 58px bar. Translucent ground, 12px backdrop blur, one hairline under it.
 * The wordmark is the serif at 19px with a trailing period in the accent; links
 * are monospaced uppercase that take the accent on hover; one square button.
 */
export function DeskNav() {
  return (
    <nav className="desk-nav" aria-label="Primary">
      <Link to="/" className="desk-nav__wordmark">
        Mini Support Desk
        <span style={{ color: "var(--color-accent)" }}>.</span>
      </Link>

      <div className="desk-nav__links">
        <Link to="/tickets" className="desk-nav__link">
          Tickets
        </Link>
        <Link to="/dashboard" className="desk-nav__link">
          Dashboard
        </Link>
        <Link to="/tickets/new" className="desk-nav__button" aria-label="Create a new ticket">
          New ticket
        </Link>
      </div>
    </nav>
  );
}

export function DeskButton({
  to,
  children,
  accent = false,
  type,
  onClick,
  disabled,
}: {
  to?: string;
  children: ReactNode;
  accent?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const className = `btn${accent ? " btn--accent" : ""}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}