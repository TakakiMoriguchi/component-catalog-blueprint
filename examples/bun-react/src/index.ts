import { serve } from "bun";
import catalog from "./catalog.html";
import index from "./index.html";

// The component catalog is never served in production builds or production runs.
// It is registered only when `BUN_PUBLIC_USE_CATALOG=true`.
const useCatalog = process.env.BUN_PUBLIC_USE_CATALOG === "true";

const catalogRoutes = useCatalog ? { "/catalog.html": catalog } : {};

const server = serve({
  port: Number(process.env.PORT ?? 4000),
  // @ts-expect-error: Bun's `routes` type rejects the union with optional keys that the
  // conditional spread produces (a known limit of the current Bun types).
  // Bun handles the optional key correctly at runtime.
  routes: {
    ...catalogRoutes,
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production" && { hmr: true, console: true },
});

console.log(`Server running at ${server.url}`);
if (useCatalog) console.log(`Catalog at ${server.url}catalog.html`);
