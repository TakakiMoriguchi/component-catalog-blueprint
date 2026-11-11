import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppProviders } from "@/providers";
import { Catalog } from "./Catalog";
import { LEVELS, registry } from "./registry";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/catalog.html");
});

describe("registry", () => {
  const entries = LEVELS.flatMap((level) =>
    Object.entries(registry[level]).flatMap(([component, fixtures]) =>
      Object.entries(fixtures).map(([fixture, element]) => [level, component, fixture, element] as const),
    ),
  );

  // Smoke test: every fixture in the catalog renders inside the app providers.
  test.each(entries)("%s / %s / %s renders", (_level, _component, _fixture, element) => {
    const { container } = render(<AppProviders>{element}</AppProviders>);
    expect(container.firstChild).not.toBeNull();
  });

  test("component names are unique across levels", () => {
    const names = LEVELS.flatMap((level) => Object.keys(registry[level]));
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("catalog index", () => {
  test("groups fixtures by atomic level in a fixed order", () => {
    render(<Catalog registry={registry} search="" />);

    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([...LEVELS]);
  });

  test("filters by component, fixture, and level with AND-ed terms", async () => {
    render(<Catalog registry={registry} search="" />);
    const search = screen.getByRole("searchbox", { name: "Search fixtures" });

    await userEvent.type(search, "button load");
    expect(screen.getAllByRole("link").map((a) => a.textContent)).toEqual(["Button / Loading"]);

    await userEvent.clear(search);
    await userEvent.type(search, "organisms");
    const section = screen.getByRole("region", { name: "organisms" });
    expect(within(section).getAllByRole("link").length).toBe(Object.keys(registry.organisms.LoginForm).length);
    expect(screen.queryByRole("region", { name: "atoms" })).toBeNull();
  });

  test("keeps the query in the URL and restores it", async () => {
    render(<Catalog registry={registry} search="" />);
    await userEvent.type(screen.getByRole("searchbox"), "login");
    expect(new URL(window.location.href).searchParams.get("q")).toBe("login");

    cleanup();
    render(<Catalog registry={registry} search="?q=login" />);
    expect(screen.getByRole("searchbox")).toHaveValue("login");
  });

  test("renders only the selected fixture when c and f match", () => {
    render(<Catalog registry={registry} search="?c=Button&f=Danger" />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).toBeNull();
  });
});
