import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../lib/navigation";
import { cn } from "../../lib/cn";

export function MobileNavigation() {
  return (
    <nav aria-label="Sections" className="desk-mobile-nav">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => cn("desk-mobile-nav__link", isActive && "is-active")}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}