export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column" }}>
      <span className="sr-only">Loading records</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="desk-skeleton" />
      ))}
    </div>
  );
}