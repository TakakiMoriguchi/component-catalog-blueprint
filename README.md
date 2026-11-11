# component-catalog-blueprint

English | [日本語](README.ja.md) | [Español](README.es.md) | [简体中文](README.zh-CN.md)

<h1 align="center">0 packages. 0 MB.</h1>

<p align="center"><b>Zero dependencies for the catalog. Your app's own build. Nothing else.</b></p>

<p align="center">
  <img src="https://img.shields.io/badge/catalog_dependencies-0-00b894?style=for-the-badge" alt="catalog dependencies: 0">
  <img src="https://img.shields.io/badge/catalog_footprint-0_MB-3d6bff?style=for-the-badge" alt="catalog footprint: 0 MB">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0f1630?style=for-the-badge" alt="license: MIT"></a>
</p>

A blueprint for component catalogs: one set of rules that works for any front-end framework or server-side template engine, plus a working reference implementation.

This is **not a library**. There is nothing to install. Each app writes its own small catalog by following [SPEC.md](SPEC.md).

## Preview

**The same catalog in 10 stacks: fixtures grouped by atomic level, with a search input on top**

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="Svelte">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun">
  <img src="https://img.shields.io/badge/Ruby_on_Rails-D30001?style=for-the-badge&logo=rubyonrails&logoColor=white" alt="Ruby on Rails">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Phoenix-FD4F00?style=for-the-badge&logo=phoenixframework&logoColor=white" alt="Phoenix">
  <img src="https://img.shields.io/badge/Elixir-4B275F?style=for-the-badge&logo=elixir&logoColor=white" alt="Elixir">
</p>

<img src="docs/images/stacks.png" alt="The same catalog index built in React, Vue, Svelte, Next.js, Angular, Rails, Laravel, Django, Go, and Phoenix">

**Search: `button load` finds `Button / Loading`**

<img src="docs/images/catalog-search.png" alt="Catalog search filtered to Button / Loading" width="480">

**One fixture per URL: `?c=LoginPage&f=Server error`**

<img src="docs/images/catalog-fixture.png" alt="LoginPage fixture in the Server error state" width="480">

## Use it

Give this repository's URL to your AI coding agent in the app where you want a catalog:

> Read https://github.com/TakakiMoriguchi/component-catalog-blueprint and build a component catalog for this app that follows its SPEC.md.

The agent reads [SPEC.md](SPEC.md), checks your stack, and uses the [stack guide](SPEC.md#9-stack-guide) to write the catalog. You can also follow the spec by hand.

## What you get

- **Every component grouped by atomic design level**: `atoms`, `molecules`, `organisms`, `templates`, `pages`. The same structure in every app, no matter who added the component.
- **A search input on the catalog index by default.** Type `button load` to find `Button / Loading`.
- **One URL per example state**: `/catalog.html?c=Button&f=Loading`. Useful for reviews, screenshots, and visual regression tests.
- **Fixtures shared with tests.** Each example state is written once, next to its component, and used by both the catalog and the tests.
- **Development only.** The catalog never ships to production.
- **No new dependencies** for the catalog itself.

## Why not Storybook?

Catalog tools are good when you want a rich UI with controls, docs pages, and add-ons. Many apps only need to open one component in one state. For that, a page of about 100 lines is enough, and it uses the app's own build, aliases, and environment variables instead of a second build pipeline.

Measured in a clean environment (macOS arm64, number of `package.json` files under `node_modules`):

| Setup | Packages | Size |
| --- | --- | --- |
| This blueprint | 0 | 0 |
| react-cosmos + vite + plugin | 174 | 60 MB |
| Storybook + @storybook/react-vite + vite | 199 | 146 MB |
| Ladle | 428 | 121 MB |

Test libraries (for example `@testing-library/*`) are needed with any of these, so they are not counted.

If your app already uses a catalog tool, keep it and apply the spec inside it. See [SPEC.md section 10](SPEC.md#10-apps-that-already-have-a-catalog-tool).

## Repository layout

```
component-catalog-blueprint/
├── SPEC.md               # The rules. Framework and language independent.
├── examples/
│   └── bun-react/        # Reference implementation. Runs on its own.
└── LICENSE
```

To run the example, see [examples/bun-react/README.md](examples/bun-react/README.md).

## Contributing

Issues and pull requests are welcome, especially:

- Corrections or additions to the [stack guide](SPEC.md#9-stack-guide) for stacks you use.
- Cases where the atomic level rules give an unclear answer.

## License

[MIT](LICENSE)
