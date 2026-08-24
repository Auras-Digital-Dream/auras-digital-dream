import React from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App.jsx";
import "./styles.css";
import "./home.css";

/* Cookieless, and served from this origin — so it needs nothing added to the
   Content-Security-Policy, and nothing asked of the visitor. */
inject();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
