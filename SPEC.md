# Component Catalog Specification

This document defines what a component catalog is and how it behaves, independent of framework or language. It applies to JavaScript UI frameworks (React, Vue, Svelte, Angular, and others) and to server-side templates (Rails, Laravel, Django, Jinja, Go templates, Phoenix, and others).

The key words MUST, MUST NOT, SHOULD, and MAY are used as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

A working reference implementation for Bun + React is in [`examples/bun-react`](examples/bun-react).

## 1. Terms

- **Component**: a reusable piece of UI. In a JS framework, a component. In a server app, a partial, include, macro, or view component.
- **Fixture**: one named example state of one component, with all inputs fixed. For example, `Button / Loading`.
- **Catalog**: a development-only page that lists all fixtures and renders any one of them by URL.
- **Level**: the atomic design level of a component. One of `atoms`, `molecules`, `organisms`, `templates`, `pages`.

## 2. Principles

1. **No new dependencies for the catalog.** The catalog is a small page that you write in the app. Do not install a catalog tool for it. Test libraries are a separate concern.
2. **Fixtures are the single source of example states.** The catalog renders them, and tests import them. Do not write the same example twice.
3. **Same environment as the app.** The catalog renders fixtures inside the same providers, layout, and stylesheets as the app. Otherwise the catalog shows something different from production.
4. **Development only.** The catalog MUST NOT be reachable in production, and its code SHOULD NOT be in the production build output.
5. **Every component has exactly one level.** The level decides where the component lives and where it appears in the catalog index.
6. **Copy, do not install.** This repository is a blueprint. Each app writes its own catalog by following this specification.

## 3. Atomic levels

Every catalog uses the same five levels, with the same names, in the same order. This keeps catalogs consistent between apps and between the people or AI agents who add components.

| Level | What it is | May import | Examples |
| --- | --- | --- | --- |
| `atoms` | The smallest UI unit. Usually wraps one native element. Has no meaning on its own. | No other project components | Button, TextInput, Icon, Badge, Spinner |
| `molecules` | A few atoms combined for one purpose. Holds only UI state (open, focused). | atoms | FormField, SearchBox, Pagination, MenuItem |
| `organisms` | A distinct section of a screen. May know domain field names, but receives all data through props. Does not fetch data. | atoms, molecules | LoginForm, Header, ProductCard, CommentList |
| `templates` | A page layout with slots. Contains no real content. | atoms, molecules, organisms | CenteredLayout, TwoColumnLayout, DashboardShell |
| `pages` | A template filled with representative content. Receives data through props. Data fetching, routing, and session handling stay outside, in the route or controller. | all lower levels | LoginPage, ProductDetailPage |

Rules:

- A component MUST import only components from lower levels. If it imports a component from the same or a higher level, move it up.
- When unsure, classify by imports first, then by role. Pick the lower level if both still fit.
- Level names MUST be exactly the lowercase plural English words above, in every language and framework.
- Components SHOULD live in one directory per level: `components/atoms/`, `components/molecules/`, and so on. If the app cannot move existing files, record the level in the fixture registry instead (section 6).
- Component names MUST be unique across all levels, because the catalog URL uses the name alone.

## 4. Fixtures

- Each component that appears in the catalog MUST have a fixture file next to it, named `<Component>.fixture.<ext>` (or the closest convention of the stack, such as `button.fixtures.php`).
- A fixture file defines an ordered map of **fixture name → example**. The example uses the native form of the stack (section 9).
- The first fixture is the most common state. Following fixtures cover variants and edge states: disabled, loading, error, empty, long text.
- Fixture names describe the state, not the data: `Loading`, `With error`, `Empty`. Use short English words in Title case.
- Fixtures MUST be static. No network, no timers, no randomness, no current time. Callbacks are no-ops.
- `templates` fixtures fill slots with visible placeholders. `pages` fixtures use realistic but fake data.

## 5. The catalog page

### 5.1 URLs

| URL | Shows |
| --- | --- |
| `<catalog>` | The index |
| `<catalog>?q=<query>` | The index, filtered by the query |
| `<catalog>?c=<Component>&f=<Fixture>` | One fixture |

`<catalog>` is `/catalog.html` for static front-ends, and `/catalog` for apps with a router or server. If `c` and `f` do not match a fixture, show the index.

### 5.2 Single fixture view

- MUST render only the fixture, inside the app's providers and stylesheets. No catalog chrome around it. This makes the URL useful for screenshots and visual regression tests.

### 5.3 Index

The index MUST have:

- **A search input at the top**, focused on load. Its accessible name is `Search fixtures`.
- **Filtering** that is case-insensitive and matches each whitespace-separated term as a substring of `"<level> <Component> <Fixture>"`. All terms must match. For example, `button load` finds `Button / Loading`, and `organisms` finds every organism.
- **Grouping by level**, in the order `atoms`, `molecules`, `organisms`, `templates`, `pages`, with the level name as a heading. Hide empty groups.
- **Ordering** inside a group: components alphabetically, fixtures in the order of the fixture file.
- **Links** as plain anchors to the single fixture URL, with the text `<Component> / <Fixture>`.

The index SHOULD have:

- The query kept in the `q` URL parameter, so reload and shared links keep the filter. Client-side pages update it with `history.replaceState`.
- A `/` keyboard shortcut that focuses the search input.
- A visible count of matching fixtures, announced with `aria-live="polite"`.

For server-rendered apps, the search input MAY be a plain `<form method="get">` with an input named `q`, filtered on the server. This works without JavaScript and uses the same URL.

## 6. Registration

- If the build tool can collect files by pattern, collect `**/*.fixture.*` automatically. Examples: `import.meta.glob` in Vite, a directory glob in a server app. Derive the level from the directory.
- If not, keep one registry file that maps **level → component → fixtures**. Adding a fixture file then means adding one line there. A test (section 8) catches a mismatch between the registry and the files.

## 7. Development-only gating

- Register the catalog route or entry only when development mode or an explicit flag (such as `USE_CATALOG=true`) is on.
- Prefer a mechanism that keeps the catalog out of the production build, not one that only hides it at runtime. Section 9 lists one per stack.
- Verify by building for production and searching the output for a fixture name. It MUST NOT be found.

## 8. Tests

- A smoke test MUST render every registered fixture, inside the app's providers, and fail if any throws.
- A test SHOULD check that component names are unique across levels.
- Behavior tests SHOULD import fixtures instead of rebuilding the same props.
- The index behavior in section 5.3 SHOULD be tested: grouping order, filtering, and the single fixture view.

## 9. Stack guide

The rules above do not change between stacks. This section shows how to express them in each one. Use the closest entry when your stack is not listed.

### JavaScript UI frameworks

**React (Bun, Vite, Create React App, and others)**
- Fixture: `Button.fixture.tsx` default-exports `{ "Primary": <Button>Save</Button>, ... }`. This is the react-cosmos format, so the files stay usable if you adopt react-cosmos later.
- Catalog: a separate `catalog.html` entry. See [`examples/bun-react`](examples/bun-react).
- Collection: `import.meta.glob("./components/**/*.fixture.tsx", { eager: true })` in Vite. Manual registry in Bun.
- Gating: Vite builds only the entries in `build.rollupOptions.input` (default `index.html`), so leave `catalog.html` out. Bun: register the route only when a flag is set and build only `index.html`.

**Next.js**
- Fixture: same as React.
- Catalog: a route such as `app/catalog/page.tsx`, rendered as a client component.
- Gating: name the catalog file with a dev-only extension (for example `page.dev.tsx`) and add that extension to `pageExtensions` only in development. As a second guard, call `notFound()` when not in development.

**Vue (Vite, Nuxt)**
- Fixture: `Button.fixture.ts` default-exports `{ "Primary": () => h(Button, { variant: "primary" }, () => "Save"), ... }`.
- Catalog: a separate `catalog.html` entry that mounts a small Vue app. In Nuxt, a dev-only page.
- Collection: `import.meta.glob`.
- Gating: same as React with Vite. In Nuxt, add the page only in development (for example with the `pages:extend` hook).

**Svelte (Vite, SvelteKit)**
- Fixture: `Button.fixture.ts` default-exports `{ "Primary": { component: Button, props: { variant: "primary" } }, ... }`. For slot or snippet content, add a small wrapper component next to the fixture file.
- Catalog: render with `<svelte:component>` or the dynamic component syntax of your Svelte version.
- Collection: `import.meta.glob`.
- Gating: same as React with Vite. In SvelteKit, a route that returns 404 unless `dev` from `$app/environment` is true.

**Angular**
- Fixture: `button.fixture.ts` exports `{ "Primary": { component: ButtonComponent, inputs: { variant: "primary" } }, ... }`.
- Catalog: a component that uses `ViewContainerRef.createComponent()` and `setInput()`.
- Gating: put the catalog route in a routes file that is swapped in only for the development configuration (`fileReplacements` in `angular.json`).

**Web Components and plain JS**
- Fixture: `button.fixture.js` exports `{ "Primary": () => html-string-or-element, ... }`.
- Catalog: a separate HTML entry, same as React.

### Server-side templates

The pattern is the same in every server stack:

- **Component**: a partial, include, macro, or view component, in a directory per level, such as `views/components/atoms/`.
- **Fixture**: a data file next to the template that maps fixture names to the template's context (locals, props, slot content).
- **Catalog**: a controller or handler at `/catalog`, registered only in development. The index is server-rendered with a `GET` search form (section 5.3). The single fixture view renders the template with the fixture's context inside the app's base layout, so the app's CSS applies.
- **Tests**: render each template with each fixture's context to a string and assert that it does not raise. Behavior tests parse the HTML.

**Rails**
- Partials: `app/views/components/atoms/_button.html.erb` with `button.fixtures.rb` (or `.yml`) beside it, mapping names to locals.
- ViewComponent: if the app already uses it, its previews are the fixtures (one preview method per fixture). Group previews by level directory. Still write the index from section 5.3.
- Gating: wrap the route in `if Rails.env.development?` in `config/routes.rb`.

**Laravel (Blade)**
- Component: `resources/views/components/atoms/button.blade.php`, used as `<x-atoms.button>`.
- Fixture: `button.fixtures.php` returns `['Primary' => ['attributes' => [...], 'slot' => 'Save'], ...]`.
- Catalog: render with `<x-dynamic-component :component="...">`.
- Gating: register the route only when `app()->environment('local')`.

**Django**
- Component: `templates/components/atoms/button.html`, used with `{% include %}`.
- Fixture: `button_fixtures.py` with a dict of names to context dicts.
- Catalog: render with `render_to_string`.
- Gating: add the URL pattern only when `settings.DEBUG` is true.
- Tests: `SimpleTestCase` with `render_to_string` and `assertInHTML`.

**Jinja2 (Flask, FastAPI, and others)**
- Component: a macro or include in `templates/components/<level>/`.
- Fixture: a Python dict next to it.
- Gating: register the route only when debug mode or a flag is on.

**Go (`html/template`)**
- Component: `{{define "atoms/button"}}...{{end}}`.
- Fixture: a Go map from names to data, in a file with a build tag such as `//go:build catalog`.
- Gating: the catalog handler also lives behind the build tag, so production builds without `-tags catalog` do not contain it.
- Tests: `ExecuteTemplate` into a `bytes.Buffer`.

**Elixir (Phoenix, HEEx)**
- Component: a function component (`Phoenix.Component`) in one module per level, for example `lib/my_app_web/components/atoms/button.ex`. If the app keeps everything in the generated `core_components.ex`, move components out by level, or record each component's level in the registry.
- Fixture: a module such as `MyAppWeb.Catalog.ButtonFixtures` with a function that returns an ordered list of `{"Primary", %{variant: "primary"}}` pairs (fixture name and assigns). For slot content, add a small wrapper function component next to the fixtures.
- Catalog: a controller or LiveView at `/dev/catalog` that calls the component function with the fixture's assigns, inside the app's root layout.
- Gating: mount the route inside the `if Application.compile_env(:my_app, :dev_routes)` block that Phoenix generates in the router. Put the catalog and fixture modules in a directory that `elixirc_paths/1` in `mix.exs` adds only for `:dev` and `:test`, so they are not compiled into a release.
- Tests: `Phoenix.LiveViewTest.render_component/2` with each fixture's assigns.

## 10. Apps that already have a catalog tool

If the app already uses Storybook, Ladle, react-cosmos, Lookbook, Phoenix Storybook, or a similar tool, do not add a second catalog. Apply this specification inside the existing tool instead:

- Use the levels as the top of the hierarchy, for example `title: "Atoms/Button"` in Storybook.
- Keep the fixture naming rules in section 4.
- Use the tool's own search.

## 11. Checklist

A catalog meets this specification when:

- [ ] Every catalog component sits in one of the five level directories, or has its level recorded in the registry.
- [ ] Every catalog component has a fixture file next to it.
- [ ] The index has a focused search input and groups fixtures by level in the fixed order.
- [ ] `?c=<Component>&f=<Fixture>` renders only that fixture, inside the app's providers.
- [ ] A smoke test renders every fixture.
- [ ] A production build does not contain the catalog. A search for a fixture name in the output finds nothing.
- [ ] No dependency was added for the catalog itself.
