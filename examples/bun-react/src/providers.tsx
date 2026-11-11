import type { ReactNode } from "react";

// Shared wrapper for the app and the catalog. In a real app, theme, locale, and router
// providers go here. Wrapping the catalog with the same component keeps fixtures
// looking the same as in the app.
export function AppProviders({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 15 }}>{children}</div>;
}
