// DOM setup for bun test. Loaded by the `test` script via `--preload ./happydom.ts`.
//
// Do not put this in bunfig.toml `[test] preload`. That would also apply happy-dom to
// Playwright E2E tests (`bun test tests/e2e`), where it clashes with the real browser globals.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register({ url: "http://localhost/catalog.html" });

// Load jest-dom matchers after register(). @testing-library/dom reads `document` when the
// module is evaluated, so a static import would run before register() and fail.
await import("@testing-library/jest-dom");
