import { Link } from "react-router-dom";
import { buttonClasses } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";

export function NotFoundPage() {
  return (
    <EmptyState
      title="That page is not here"
      description="The address does not match anything in this desk. The queue and the dashboard are both one click away."
      action={
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/" className={buttonClasses("primary")}>
            Start here
          </Link>
          <Link to="/tickets" className={buttonClasses("secondary")}>
            Open the queue
          </Link>
        </div>
      }
    />
  );
}