import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTickets } from "../../features/tickets/ticket.hooks";
import { NAV_ITEMS } from "../../lib/navigation";
import { Dropdown } from "../ui/Dropdown";
import { cn } from "../../lib/cn";
import { buttonClasses } from "../ui/Button";
import { SystemGuideModal } from "../ui/SystemGuideModal";

export function Header() {
  const { pathname } = useLocation();
  const { resetToSampleData } = useTickets();
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/10 bg-white px-4 md:px-8">
        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex size-8 items-center justify-center rounded-[2px] bg-black text-white font-bold text-sm tracking-tighter lowercase transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-neutral-800">
              sd
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm tracking-tight text-black leading-none">
                mini support desk
              </span>
              <span className="font-mono text-[9px] mt-0.5 tracking-widest text-[#525252] uppercase">
                STUDIO DISPATCH SYSTEM
              </span>
            </div>
          </Link>

          {/* Minimal Navigation Bar (Desktop) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 border-l border-black/10 pl-6">
            {NAV_ITEMS.map((item) => {
              const isActive = item.end ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive
                      ? "text-white bg-black"
                      : "text-black hover:text-white hover:bg-black"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Utility Cluster: Status indicator, Guide, CTA, and Evaluator Menu */}
        <div className="flex items-center gap-2.5">
          {/* Plain-English System Guide Button */}
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 border border-black/10 bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            title="Open plain-English feature & SLA guide"
          >
            <span>📖</span>
            <span>HOW IT WORKS</span>
          </button>

          {/* Context-aware CTA button */}
          {pathname === "/" ? (
            <Link
              to="/dashboard"
              className={buttonClasses("primary", "hidden sm:inline-flex min-h-9 px-4 text-xs")}
            >
              DISPATCH DESK →
            </Link>
          ) : (
            <Link
              to="/tickets/new"
              className={buttonClasses("primary", "hidden sm:inline-flex min-h-9 px-4 text-xs")}
            >
              + NEW TICKET
            </Link>
          )}

          {/* Evaluator Quick Action & Account Menu */}
          <Dropdown
            label="Account & Evaluator Tools"
            trigger={
              <span
                className="flex size-9 items-center justify-center border border-black/10 bg-white text-xs font-mono font-bold text-black hover:bg-black hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                title="Support Staff / Evaluator Settings"
              >
                SD
              </span>
            }
          >
            <div className="flex flex-col gap-3 text-left">
              <div>
                <p className="font-bold text-xs uppercase text-black">LEAD DISPATCHER</p>
                <p className="font-mono text-[11px] text-[#525252]">ID: AGENT-01 // ROOT</p>
              </div>

              <div className="border-t border-black/10 pt-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="w-full text-left py-1 text-black font-bold uppercase hover:underline flex items-center justify-between"
                >
                  <span>📖 HOW IT WORKS GUIDE</span>
                  <span className="text-[10px] text-[#525252]">PLAIN ENGLISH ↗</span>
                </button>
              </div>

              <div className="border-t border-black/10 pt-2 text-xs font-mono">
                <p className="text-[10px] uppercase font-bold tracking-widest mb-1.5 text-black">
                  KEYBOARD SHORTCUTS
                </p>
                <div className="flex justify-between py-0.5 text-black">
                  <span>FOCUS SEARCH</span>
                  <kbd className="border border-black/10 bg-neutral-50 px-1 text-[10px] font-mono">
                    /
                  </kbd>
                </div>
                <div className="flex justify-between py-0.5 text-black">
                  <span>CLOSE DIALOGS</span>
                  <kbd className="border border-black/10 bg-neutral-50 px-1 text-[10px] font-mono">
                    Esc
                  </kbd>
                </div>
              </div>

              <div className="border-t border-black/10 pt-2">
                <button
                  type="button"
                  onClick={() => void resetToSampleData()}
                  className="w-full border border-black/10 px-2.5 py-2 text-left font-mono font-bold text-xs uppercase text-black hover:bg-black hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  RESET SAMPLE DATA ✕
                </button>
              </div>
            </div>
          </Dropdown>
        </div>
      </header>

      {/* Interactive Plain-English Feature & SLA Guide */}
      <SystemGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}

