import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../lib/navigation";
import { cn } from "../../lib/cn";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 self-start border-r border-black/10 bg-white md:sticky md:top-16 md:block md:h-[calc(100dvh-4rem)]">
      <div className="border-b border-black/10 p-3 bg-neutral-50">
        <span className="font-mono text-[10px] text-black font-bold uppercase tracking-widest">
          REGISTRY DIRECTORY
        </span>
      </div>
      <nav aria-label="Main Navigation" className="flex h-full flex-col gap-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-[2px] px-3.5 py-3 font-mono text-xs uppercase tracking-wider border transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive
                    ? "bg-black text-white border-black"
                    : "border-transparent text-black hover:border-black/10 hover:bg-neutral-50"
                )
              }
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
