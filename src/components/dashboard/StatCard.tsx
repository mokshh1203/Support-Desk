import { Link } from "react-router-dom";
import { Card } from "../ui/Card";

interface StatCardProps {
  label: string;
  value: number | string;
  to?: string;
  tone?: "primary" | "warning" | "success" | "danger" | "neutral";
  subtitle?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, to, subtitle, icon }: StatCardProps) {
  const content = (
    <Card
      className={`relative p-6 border border-black/10 bg-white text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        to ? "hover:border-black cursor-pointer group" : ""
      }`}
    >
      <div className="flex items-start justify-between border-b border-black/10 pb-2">
        <p className="font-mono text-xs text-[#525252] font-bold tracking-widest uppercase">{label}</p>
        {icon && <div className="text-black">{icon}</div>}
      </div>

      <p className="mt-4 text-4xl md:text-5xl font-bold tabular-nums tracking-tighter text-black">
        {value}
      </p>

      {subtitle && (
        <p className="mt-2 text-xs font-mono text-[#525252] uppercase tracking-wider">{subtitle}</p>
      )}

      {to && (
        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-2 text-[11px] font-mono font-bold uppercase tracking-wider text-black group-hover:text-neutral-500 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <span>INSPECT QUEUE</span>
          <span>→</span>
        </div>
      )}
    </Card>
  );

  if (to) {
    return <Link to={to} className="block">{content}</Link>;
  }

  return content;
}
