import { RouterProvider } from "react-router-dom";
import { TicketProvider } from "../context/TicketContext";
import { router } from "./router";

export function App() {
  return (
    <TicketProvider>
      <RouterProvider router={router} />
    </TicketProvider>
  );
}
