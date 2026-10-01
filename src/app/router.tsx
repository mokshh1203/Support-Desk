import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { LandingPage } from "../pages/LandingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TicketsPage } from "../pages/TicketsPage";
import { NewTicketPage } from "../pages/NewTicketPage";
import { TicketDetailsPage } from "../pages/TicketDetailsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "tickets", element: <TicketsPage /> },
      { path: "tickets/new", element: <NewTicketPage /> },
      { path: "tickets/:ticketId", element: <TicketDetailsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);