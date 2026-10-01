import { Button } from "./Button";

interface Props {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "The queue could not be read",
  description = "Tickets are held in this browser's local storage. It may be blocked, full, or holding something unreadable.",
  onRetry,
}: Props) {
  return (
    <div role="alert" className="desk-empty">
      <p className="type-kicker" style={{ margin: 0, color: "var(--color-accent)" }}>
        Error
      </p>
      <h2 className="type-page-title" style={{ margin: "12px 0 0" }}>
        {title}
      </h2>
      <p className="section__lede" style={{ marginTop: 16 }}>
        {description}
      </p>
      {onRetry && (
        <div style={{ marginTop: 24 }}>
          <Button onClick={onRetry}>Try again</Button>
        </div>
      )}
    </div>
  );
}