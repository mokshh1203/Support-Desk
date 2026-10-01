import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNavigation } from "./MobileNavigation";
import { CustomCursor } from "../ui/CustomCursor";

export function AppShell() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <div className="flex min-h-dvh flex-col bg-white text-black selection:bg-black selection:text-white">
      {/* Global Interactive Difference Cursor */}
      <CustomCursor />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-3 focus:border focus:border-black text-xs font-mono"
      >
        Skip to content
      </a>

      {!isLanding && <Header />}

      <div className="flex flex-1">
        {!isLanding && <Sidebar />}
        <main
          id="main"
          className={
            isLanding
              ? "w-full min-w-0 flex-1 p-0 m-0 overflow-x-hidden"
              : "mx-auto w-full min-w-0 max-w-6xl p-4 md:p-8 pb-24 flex-1"
          }
        >
          <Outlet />
        </main>
      </div>

      {!isLanding && <MobileNavigation />}
    </div>
  );
}
