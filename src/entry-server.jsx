import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import "./styles.css";
import "./home.css";

/* Rendered once per route at build time. Effects never run here, so the
 * observers, the cursor and the gold thread are all no-ops — what comes out
 * is the markup a crawler needs, and the browser takes over from there. */
export function render(path) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
