import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// Defensive client bootstrap: attempt to lazy-load the full router, but fall back to
// a minimal UI if anything fails during module evaluation. This ensures the page
// becomes interactive even when a route import or plugin throws during dev.
console.log("client: bootstrap starting");

function renderFallback(message: string) {
  const root = document.getElementById("root");
  if (!root) return;
  createRoot(root).render(
    <React.StrictMode>
      <div style={{ padding: 24, fontFamily: 'Cairo, system-ui, sans-serif' }}>
        <h2>App failed to boot the full client</h2>
        <pre style={{ whiteSpace: "pre-wrap", color: "#b43c3c" }}>{message}</pre>
        <p>If you are developing, check the terminal or open the browser console for the full error.</p>
      </div>
    </React.StrictMode>,
  );
}

(async function init() {
  try {
    // Delay importing the router to avoid fatal module-evaluation errors preventing
    // the client from ever logging to the console. This makes debugging easier.
    const mod = await import("./router");
    const { RouterProvider } = await import("@tanstack/react-router");
    const router = mod.getRouter();

    console.log("client: router loaded, hydrating...");

    const root = document.getElementById("root");
    if (!root) throw new Error("#root element not found");

    createRoot(root).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    );
  } catch (err: any) {
    console.error("client bootstrap error:", err);
    renderFallback(String(err?.stack ?? err));
  }
})();
