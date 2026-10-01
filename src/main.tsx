import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { armMotion } from "./lib/motion";
import "./styles/globals.css";

// Arms every entry reveal. Must run before the first paint of the landing page,
// and it deliberately does nothing when the reader has asked for reduced motion.
armMotion();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
