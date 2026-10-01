import React from "react";

export interface NavItem {
  to: string;
  label: string;
  end: boolean;
  icon: (props?: { className?: string }) => React.ReactElement;
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Overview",
    end: true,
    icon: ({ className = "size-4.5" }: { className?: string } = {}) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    label: "Operations",
    end: true,
    icon: ({ className = "size-4.5" }: { className?: string } = {}) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    to: "/tickets",
    label: "Queue",
    end: false,
    icon: ({ className = "size-4.5" }: { className?: string } = {}) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Overview";
  if (pathname === "/dashboard") return "Operations";
  if (pathname === "/tickets") return "Queue";
  if (pathname === "/tickets/new") return "New ticket";
  if (pathname.startsWith("/tickets/")) return "Ticket";
  return "Page not found";
}
