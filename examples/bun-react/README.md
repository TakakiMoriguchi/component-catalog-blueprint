# Example: Bun + React

Reference implementation of [SPEC.md](../../SPEC.md) with Bun and React. It runs on its own and has no catalog dependencies.

> **Frozen.** This example is a reference, not a maintained project. Dependencies are pinned to exact versions and are not updated to follow new releases. It was last verified with Bun 1.4.4. When the example and [SPEC.md](../../SPEC.md) disagree, SPEC.md wins.

## Run

```shell
bun install

bun run catalog    # app + catalog -> http://localhost:4000/catalog.html
bun run dev        # app only
bun run test       # unit tests
bun run typecheck  # tsc --noEmit
bun run build      # production build (./dist), without the catalog
```

Set `PORT` to change the port:

```shell
PORT=4321 bun run catalog
```

## Layout

```
examples/bun-react/
├── happydom.ts                  # DOM setup for bun test (loaded with --preload)
├── testing-library.d.ts         # jest-dom matcher types for bun:test
└── src/
    ├── index.ts                 # Bun.serve() entry. Registers catalog.html only with the flag
    ├── index.html, app.tsx      # The app
    ├── providers.tsx            # Wrapper shared by the app and the catalog
    ├── catalog.html             # Catalog entry
    ├── catalog/
    │   ├── registry.ts          # level -> component -> fixtures
    │   ├── Catalog.tsx          # Index (search, level groups) and single fixture view
    │   ├── Catalog.test.tsx     # Smoke test for every fixture, index behavior
    │   └── main.tsx             # Mounts the catalog inside AppProviders
    └── components/
        ├── atoms/               # Button, TextInput
        ├── molecules/           # FormField
        ├── organisms/           # LoginForm
        ├── templates/           # CenteredLayout
        └── pages/               # LoginPage
```

Each component has `<Name>.fixture.tsx` next to it, and a `<Name>.test.tsx` where it has behavior worth testing.

## Add a component

1. Create `src/components/<level>/<Name>.tsx`. Pick the level with [SPEC.md section 3](../../SPEC.md#3-atomic-levels).
2. Create `<Name>.fixture.tsx` next to it.
3. Add one line to `src/catalog/registry.ts`. Bun has no `import.meta.glob`, so fixtures are registered by hand.
4. Run `bun run test`. The smoke test renders the new fixtures.

## Bun-specific decisions

### The catalog is a separate HTML entry behind a flag

```ts
const useCatalog = process.env.BUN_PUBLIC_USE_CATALOG === "true";
const catalogRoutes = useCatalog ? { "/catalog.html": catalog } : {};
```

The production build names its entry (`bun build ./src/index.html`), so code reachable only from `catalog.html` is not bundled.

### Fixtures use the react-cosmos format

`*.fixture.tsx` default-exports plain React elements. If you adopt react-cosmos later, the fixture files work unchanged. Only `registry.ts` goes away.

Storybook and Ladle use CSF (`export const Loading = { args: { ... } }`), which describes props as data for the Controls panel. Without that panel, plain JSX is simpler and easier to reuse in tests.

### No UI library

Components use plain DOM elements and inline styles, so the example does not depend on any UI library. In a real app, wrap the catalog with the same providers as the app (`src/providers.tsx` here), or fixtures will not look like production.

## Gotchas

- **`bun test` has no global `afterEach`.** `@testing-library/react` cannot clean up automatically, so each test file calls `afterEach(cleanup)`.
- **Disabled buttons have `pointer-events` disabled.** Pass `{ pointerEventsCheck: 0 }` to `userEvent.click` to test that a click does nothing.
- **Load `@testing-library/jest-dom` after `GlobalRegistrator.register()`.** `@testing-library/dom` reads `document` when the module is evaluated. A static import runs before `register()` and fails with `a global document has to be available`.
- **Do not put `happydom.ts` in `bunfig.toml` `[test] preload`.** It would also apply to Playwright E2E tests (`bun test tests/e2e`) and clash with the real browser globals.
- **`happydom.ts` is excluded from typecheck.** The types entry of `@testing-library/jest-dom` is not a module, so `tsc` cannot resolve it. The file runs only at test time.
- **A conditional spread in `Bun.serve` `routes` does not type-check.** The current Bun types reject the union with optional keys, so it is suppressed with `@ts-expect-error`. It works at runtime.
