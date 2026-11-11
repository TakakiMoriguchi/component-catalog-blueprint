# Component Catalog Specification

This document defines what a component catalog is and how it behaves, independent of framework or language. It applies to JavaScript UI frameworks (React, Vue, Svelte, Angular, and others) and to server-side templates (Rails, Laravel, Django, Jinja, Go templates, Phoenix, and others).

The key words MUST, MUST NOT, SHOULD, and MAY are used as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

A working reference implementation for Bun + React is in [`examples/bun-react`](examples/bun-react). The stack guide in section 9 was verified by building the same catalog in each listed stack.

## 1. Terms

- **Component**: a reusable piece of UI. In a JS framework, a component. In a server app, a partial, include, macro, or view component.
- **Fixture**: one named example state of one component, with all inputs fixed. For example, `Button / Loading`.
- **Catalog**: a development-only page that lists all fixtures and renders any one of them by URL.
- **Level**: the atomic design level of a component. One of `atoms`, `molecules`, `organisms`, `templates`, `pages`.

## 2. Principles

1. **No new dependencies for the catalog.** The catalog is a small page that you write in the app. Do not install a catalog tool for it. Test libraries are a separate concern.
2. **Fixtures are the single source of example states.** The catalog renders them, and tests import them. Do not write the same example twice.
3. **Same environment as the app.** The catalog renders fixtures inside the same providers, layout, and stylesheets as the app. Otherwise the catalog shows something different from production.
4. **Development only.** The catalog MUST NOT be reachable in production. Where the stack has a build step, its code SHOULD NOT be in the production build output (section 7).
5. **Every component has exactly one level.** The level decides where the component lives and where it appears in the catalog index.
6. **Copy, do not install.** This repository is a blueprint. Each app writes its own catalog by following this specification.

## 3. Atomic levels

Every catalog uses the same five levels, with the same names, in the same order. This keeps catalogs consistent between apps and between the people or AI agents who add components.

| Level | What it is | May use | Examples |
| --- | --- | --- | --- |
| `atoms` | The smallest UI unit. Usually wraps one native element. Has no meaning on its own. | No other project components | Button, TextInput, Icon, Badge, Spinner |
| `molecules` | A few atoms combined for one purpose. Holds only UI state (open, focused). | atoms | FormField, SearchBox, Pagination, MenuItem |
| `organisms` | A distinct section of a screen. May know domain field names, but receives all data through props. Does not fetch data. | atoms, molecules | LoginForm, Header, ProductCard, CommentList |
| `templates` | A page layout with slots. Contains no real content. | atoms, molecules, organisms | CenteredLayout, TwoColumnLayout, DashboardShell |
| `pages` | A template filled with representative content. Receives data through props. Data fetching, routing, and session handling stay outside, in the route or controller. | all lower levels | LoginPage, ProductDetailPage |

Rules:

- A component MUST use only components from lower levels. "Use" means import in a JS framework, and render or include in a server template. If it uses a component from the same or a higher level, move it up.
- When unsure, classify by what it uses first, then by role. Pick the lower level if both still fit.
- Level names MUST be exactly the lowercase plural English words above, in every language and framework. A directory named `templates/` inside a server app's own `templates/` directory is expected.
- Components SHOULD live in one directory per level: `components/atoms/`, `components/molecules/`, and so on. If the app cannot move existing files, record the level in the fixture registry instead (section 6).
- The **component name** shown in the catalog is the file name without extension, in PascalCase: `Button.tsx` → `Button`, `text_input.html.erb` → `TextInput`, `text-input.blade.php` → `TextInput`.
- Component names MUST be unique across all levels, because the catalog URL uses the name alone.

## 4. Fixtures

- Each component that appears in the catalog MUST have a fixture file. Put it next to the component, named `<Component>.fixture.<ext>` or the closest convention of the stack.
  - Exception: if a file next to the component would be compiled or shipped into production and the stack cannot exclude it, put fixtures in a development-only directory that mirrors the level directories (for example `dev/catalog/fixtures/atoms/`). Section 9 says where this applies.
- A fixture file defines an **ordered** list of **fixture name → example**. Use a structure that keeps order: an object literal in JS, a list of pairs where the language's map is unordered (Go, Elixir). The example uses the native form of the stack (section 9).
- The first fixture is the most common state. Following fixtures cover variants and edge states: disabled, loading, error, empty, long text.
- Fixture names describe the state, not the data: `Loading`, `With error`, `Empty`. Use short English words in Title case.
- Fixtures MUST be static and deterministic. No network, no timers, no randomness, no current time. In JS, callbacks are no-ops.
- Generated values MUST be deterministic too. Where the stack has no stable id helper (like React's `useId`), derive ids from fixture data, for example from the field label.
- `templates` fixtures fill slots with visible placeholders. `pages` fixtures use realistic but fake data.
- **Slots and children.** When the stack cannot put child content into plain data, give the fixture a small wrapper (a component, function, or template next to the fixture) that renders the component with its content. Section 9 shows the form per stack.

## 5. The catalog page

### 5.1 URLs

| URL | Shows |
| --- | --- |
| `<catalog>` | The index |
| `<catalog>?q=<query>` | The index, filtered by the query |
| `<catalog>?c=<Component>&f=<Fixture>` | One fixture |

`<catalog>` is `/catalog.html` for static front-ends, and `/catalog` (or the stack's dev-tools prefix, such as `/dev/catalog` in Phoenix) for apps with a router or server. If `c` and `f` do not match a fixture, show the index.

### 5.2 Single fixture view

- MUST render only the fixture, inside the app's providers, layout, and stylesheets. No catalog chrome around it. This makes the URL useful for screenshots and visual regression tests.
- Development servers may add invisible markup (live-reload scripts, template annotation comments). That is acceptable, but HTML-based snapshot tests should strip it.

### 5.3 Index

The index MUST have:

- **A search input at the top**, focused on load. Its accessible name is `Search fixtures`. Where the `autofocus` attribute does not fire (views inserted by a client-side router), call `focus()` after the view renders.
- **Filtering** that is case-insensitive and matches each whitespace-separated term as a substring of `"<level> <Component> <Fixture>"`. All terms must match. For example, `button load` finds `Button / Loading`, and `organisms` finds every organism.
- **Grouping by level**, in the order `atoms`, `molecules`, `organisms`, `templates`, `pages`, with the level name as a heading. Hide empty groups.
- **Ordering** inside a group: components by name in plain code-point order, fixtures in the order of the fixture file.
- **Links** as plain anchors to the single fixture URL, with the text `<Component> / <Fixture>`.

The index SHOULD have:

- The query kept in the `q` URL parameter, so reload and shared links keep the filter. Client-side pages update it with `history.replaceState`, or the router's equivalent (for example `Location.replaceState` in Angular).
- A `/` keyboard shortcut that focuses the search input.
- A visible count of matching fixtures (`1 fixture`, `21 fixtures`). Client-side pages announce it with `aria-live="polite"`.

For server-rendered apps, the search input MAY be a plain `<form method="get">` with an input named `q`, filtered on the server. This works without JavaScript and uses the same URL.

## 6. Registration

- If the build tool can collect files by pattern, collect fixture files automatically. Examples: `import.meta.glob` in Vite and Turbopack, a directory glob in a server app. Derive the level from the directory.
- If not, keep one registry file that maps **level → component → fixtures**. Adding a fixture file then means adding one line there. A test (section 8) catches a mismatch between the registry and the files.

## 7. Development-only gating

Every stack MUST:

- Register the catalog route or entry only when development mode or an explicit flag (such as `USE_CATALOG=true`) is on.
- **Include the test environment.** Tests in section 8 request the catalog, so the condition must also be true under test. Many stacks run tests in their own environment (`test`, `testing`, or with debug off) where a "development only" check is false.

Stacks with a build step (front-end bundlers, compiled languages) MUST also:

- Keep the catalog out of the production build, not only hide it at runtime. Section 9 lists one mechanism per stack.
- Verify by building for production and searching the output for a fixture name. It MUST NOT be found.

Stacks without a build step (Rails, Laravel, Django, and similar) ship their source as is, so route gating is the control. They MUST also:

- Guard the catalog handler itself, and return 404 when not in development or test. This protects against stale route or config caches.
- Build route and config caches only in the target environment.
- Verify by starting the app in production mode and requesting the catalog. It MUST return 404. Exclude fixture files at deploy time if shipping them is not acceptable.

For static single-page apps, the HTTP status depends on the host. Verify that the route renders the app's not-found view and that the build output contains no catalog code. A development server that answers every path with 200 proves nothing.

## 8. Tests

- A smoke test MUST render every registered fixture, inside the app's providers, and fail if any rendering fails. Where the template engine renders a missing variable as empty text instead of failing (Django, Jinja, Go with `map` data), make missing values fail in tests, or assert on the output.
- A test SHOULD check that component names are unique across levels. Check the list of fixture files, not a registry merged by name, because merging silently drops duplicates.
- A test SHOULD check that the registry and the fixture files match, when the registry is manual.
- Behavior tests SHOULD import fixtures instead of rebuilding the same props.
- The index behavior in section 5.3 SHOULD be tested: grouping order, filtering, and the single fixture view.

## 9. Stack guide

The rules above do not change between stacks. This section shows how to express them in each one. Every entry was verified with the version shown. Use the closest entry when your stack is not listed.

### JavaScript UI frameworks

**React (Bun, Vite, and others)** — verified with React 19.3, Bun 1.4, Vite 8.3
- Fixture: `Button.fixture.tsx` default-exports `{ "Primary": <Button>Save</Button>, ... }`. This is the react-cosmos format, so the files stay usable if you adopt react-cosmos later.
- Catalog: a separate `catalog.html` entry. See [`examples/bun-react`](examples/bun-react).
- Collection: in Vite, `import.meta.glob("../components/**/*.fixture.tsx", { eager: true, import: "default" })`. The path is relative to the file that calls it. In Bun, a manual registry.
- Gating: Vite builds only the entries in `build.rolldownOptions.input` (`build.rollupOptions.input` before Vite 8), default `index.html`, so leave `catalog.html` out. In Bun, register the route only when a flag is set and build only `index.html`.

**Next.js (App Router)** — verified with Next.js 16.4 and Turbopack
- Fixture: same as React.
- Catalog: `app/catalog/page.dev.tsx`. Fixtures hold functions, which cannot pass from a server component to a client component, so the `"use client"` catalog module imports the registry itself. Wrap the part that reads `searchParams` in `<Suspense>`. Write the page props type by hand, because the route is absent from the generated route types in production builds.
- Collection: `import.meta.glob` works with Turbopack. With `--webpack`, use a manual registry.
- Gating: in `next.config`, use the `phase` argument and add `"dev.tsx"` to `pageExtensions` only for `PHASE_DEVELOPMENT_SERVER` (and your test setup). In the App Router, `pageExtensions` applies to every route file. As a second guard, call `notFound()` when not in development.

**Vue (Vite)** — verified with Vue 3.5, Vite 8.3
- Fixture: `Button.fixture.ts` default-exports `{ "Primary": () => h(Button, { variant: "primary" }, () => "Save"), ... }`. A fixture function works directly with `<component :is>`.
- Catalog: a separate `catalog.html` entry that mounts a small Vue app. Focus the search input in `onMounted`. In Nuxt, add a dev-only page (for example with the `pages:extend` hook).
- Collection: `import.meta.glob`, as for React.
- Gating: same as React with Vite.

**Svelte (Vite)** — verified with Svelte 5.57, Vite 8.3
- Fixture: `Button.fixture.ts` default-exports `{ "Primary": { component: Button, props: { variant: "primary" } }, ... }`. For content, use `createRawSnippet` for a single element, and a small wrapper component next to the fixture for text or more markup.
- Catalog: render with `<fixture.component {...fixture.props} />`. `<svelte:component>` is deprecated in Svelte 5. Mount a root `.svelte` file that wraps the catalog in the app's providers. Focus the search input in `onMount`.
- Collection: `import.meta.glob`, as for React.
- Gating: same as React with Vite. In SvelteKit, a route that returns 404 unless `dev` from `$app/environment` is true.

**Angular** — verified with Angular 22.2 (standalone, zoneless)
- Fixture: `button.fixture.ts` default-exports `{ "Primary": { component: Button, inputs: { variant: "primary" }, content: "Save" }, ... }`. Pass `content` as `projectableNodes`. For markup slots, add a wrapper component in the fixture file.
- Catalog: a component that uses `ViewContainerRef.createComponent()` and `setInput()`. Keep `q` in the URL with `Location.replaceState`. Focus the search input in `afterNextRender`.
- Collection: a manual registry. The application builder has no `import.meta.glob`.
- Gating: `catalog.routes.ts` exports `[]`, and `catalog.routes.development.ts` holds a lazy `loadComponent` route. Swap them with `fileReplacements` in `build.configurations.development`, which `ng serve` uses by default.

**Web Components and plain JS**
- Fixture: `button.fixture.js` default-exports `{ "Primary": () => element, ... }`.
- Catalog and gating: a separate HTML entry, as for React with Vite.

### Server-side templates

The pattern is the same in every server stack:

- **Component**: a partial, include, macro, or view component, in a directory per level, such as `views/components/atoms/`.
- **Fixture**: data that maps fixture names to the template's context (locals, props, slot content).
- **Catalog**: a controller or handler, registered only in development and test (section 7). The index is server-rendered with a `GET` search form (section 5.3). The single fixture view renders the template with the fixture's context inside the app's base layout, so the app's CSS applies.
- **Tests**: render each template with each fixture's context to a string and assert that it succeeds. Behavior tests parse the HTML.
- **Composition**: templates have no children prop. Pass slot content as safe HTML (or a template name) in the fixture's context, and isolate includes so a parent's variables do not leak into children.

**Ruby on Rails** — verified with Rails 8.1, plain ERB partials
- Component: `app/views/components/atoms/_button.html.erb`.
- Fixture: `button.fixtures.rb` next to the partial, a Ruby file whose last expression is a Hash of name → locals. `app/views` is not autoloaded, so the catalog loads it with `eval(File.read(path), TOPLEVEL_BINDING, path)`, or use YAML with `YAML.load_file`. Put slot content in a `:slot` key as an `html_safe` string.
- ViewComponent: if the app already uses it, its previews are the fixtures (one preview method per fixture). Group previews by level directory and still write the index from section 5.3.
- Gating: wrap the route in `if Rails.env.local?` (development or test, Rails 7.1+), and return 404 from the controller unless `Rails.env.local?`.

**Laravel (Blade)** — verified with Laravel 13.42
- Component: `resources/views/components/atoms/text-input.blade.php`, used as `<x-atoms.text-input>`.
- Fixture: `text-input.fixtures.php` next to the component returns `['Primary' => ['attributes' => [...], 'slot' => 'Save'], ...]`. Blade never resolves it as a view, because dots in view names become slashes. Attribute keys are kebab-case (`loading-label`). Wrap HTML slot content in `HtmlString`.
- Catalog: render with `<x-dynamic-component :component="..." :attributes="new ComponentAttributeBag($attributes)">`. Derive the catalog name with `Str::studly()`.
- Gating: register the route only when `app()->environment('local', 'testing')`, and call `abort_unless(app()->environment('local', 'testing'), 404)` in the controller. Run `route:cache` and `config:cache` only in the target environment: caches built locally keep the catalog route alive in production.

**Django** — verified with Django 6.1
- Component: `templates/components/atoms/button.html`, used with `{% include "..." with ... only %}`. Use `only` so a parent's context does not leak into the child.
- Fixture: `button_fixtures.py` next to the template, with a dict of names to context dicts. `templates/` is not a Python package, so load the files by path with `importlib.util.spec_from_file_location`, or keep them in a `catalog/fixtures/<level>/` package.
- Catalog: render with `render_to_string(template, context, request=request)`. Without `request`, `{% csrf_token %}` and context processors render nothing.
- Gating: add the URL pattern only when `settings.DEBUG` is true. The test runner forces `DEBUG=False`, so in tests call the view with `RequestFactory`, or reload the URLconf under `override_settings(DEBUG=True)`. Return 404 from the view unless `settings.DEBUG`.
- Tests: `SimpleTestCase` with `render_to_string` and `assertInHTML`. Set `string_if_invalid` in test settings so missing variables are visible.

**Jinja2 (Flask, FastAPI, and others)** — not verified
- Component: a macro or include in `templates/components/<level>/`.
- Fixture: a Python dict next to it, loaded by path as for Django.
- Gating: register the route only when debug mode, a flag, or the test config is on. Use `StrictUndefined` in tests.

**Go (`html/template`)** — verified with Go 1.27, standard library only
- Component: `components/atoms/button.html` with `{{define "atoms/button"}}...{{end}}`. Use a struct per component, not `map[string]any`, so a misspelled field fails execution.
- Fixture: an ordered slice of `Fixture{Name: ..., Data: ...}` (Go maps are unordered), in a file with `//go:build catalog`. Go cannot import every package in a directory, so the registry is manual. Put the data types in an untagged package that both the app and the fixtures can import.
- Composition: `{{template}}` needs a constant name. Add a `render` template func, or pass slot content as `template.HTML`.
- Catalog: a handler behind the same build tag. It must add its templates and routes before the first `Execute`, because `html/template` cannot parse after execution.
- Gating: production builds without `-tags catalog` do not contain the catalog. Embed only `//go:embed components/*/*.html`: embedding the whole directory also embeds the fixture source files. Route the home page as `GET /{$}`, because a catch-all `/` answers `/catalog` with 200 in production.
- Tests: `go test -tags catalog`, executing every template with every fixture into a `bytes.Buffer`.

**Elixir (Phoenix, HEEx)** — verified with Phoenix 1.8.16
- Component: a function component (`Phoenix.Component`) in one module per level, for example `lib/my_app_web/components/atoms/button.ex`. If the app keeps everything in the generated `core_components.ex`, move components out by level, or record each component's level in the registry.
- Fixture: modules in a development-only directory that mirrors the levels, such as `dev/my_app_web/catalog/fixtures/atoms/`, added by `elixirc_paths/1` in `mix.exs` only for `:dev` and `:test`. Each returns an ordered list of `{"Primary", %{variant: "primary"}}` pairs. Give each fixture module a `render/1`, which wraps the component when it needs slots.
- Catalog: a controller at `/dev/catalog` that calls the component with the fixture's assigns, inside the root layout. A direct call needs `Map.put(assigns, :__changed__, nil)`.
- Gating: mount the route inside an `if Application.compile_env(:my_app, :dev_routes)` block. Phoenix generates it only with the dashboard or mailer; otherwise write it yourself. Set `config :my_app, dev_routes: true` in `config/test.exs` too. Add `"dev"` to the inputs in `.formatter.exs`. Tailwind does not scan `dev/` unless you add a `@source`.
- Tests: `Phoenix.LiveViewTest.render_component/2` for every fixture. It is a macro, so look fixtures up at runtime inside the test instead of generating tests from escaped assigns.

## 10. Apps that already have a catalog tool

If the app already uses Storybook, Ladle, react-cosmos, Lookbook, Phoenix Storybook, or a similar tool, do not add a second catalog. Apply this specification inside the existing tool instead:

- Use the levels as the top of the hierarchy, for example `title: "Atoms/Button"` in Storybook.
- Keep the fixture naming rules in section 4.
- Use the tool's own search.

## 11. Checklist

A catalog meets this specification when:

- [ ] Every catalog component sits in one of the five level directories, or has its level recorded in the registry.
- [ ] Every catalog component has a fixture file, next to it or in the mirrored dev-only directory.
- [ ] The index has a focused search input and groups fixtures by level in the fixed order.
- [ ] `?c=<Component>&f=<Fixture>` renders only that fixture, inside the app's providers and layout.
- [ ] A smoke test renders every fixture, and the catalog is reachable in the test environment.
- [ ] Production does not serve the catalog: a build-step stack has no fixture name in its output; a no-build stack returns 404 in production mode.
- [ ] No dependency was added for the catalog itself.
