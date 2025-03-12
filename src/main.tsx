import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
import { MockAuthProvider } from "./context/MockAuthContext";
import { Toaster } from "./components/ui/toaster";
import { TempoDevtools } from "tempo-devtools";
import App from "./App";
import "./index.css";
import "./styles/responsive-fixes.css";
import "./styles/mobile-optimizations.css";

// Initialize Tempo Devtools if in Tempo environment
if (import.meta.env.VITE_TEMPO === "true") {
  TempoDevtools.init();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MockAuthProvider>
        <App />
        <Toaster />
      </MockAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
