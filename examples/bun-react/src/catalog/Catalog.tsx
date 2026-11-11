import { type ReactElement, useEffect, useRef, useState } from "react";
import { LEVELS, type Level, type Registry } from "./registry";

interface Entry {
  level: Level;
  component: string;
  fixture: string;
}

export function fixtureUrl(component: string, fixture: string): string {
  return `/catalog.html?c=${encodeURIComponent(component)}&f=${encodeURIComponent(fixture)}`;
}

function flatten(registry: Registry): Entry[] {
  return LEVELS.flatMap((level) =>
    Object.entries(registry[level])
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([component, fixtures]) =>
      Object.keys(fixtures).map((fixture) => ({ level, component, fixture })),
    ),
  );
}

/** Every whitespace-separated term must appear in "level component fixture" (case-insensitive). */
export function matches(entry: Entry, query: string): boolean {
  const haystack = `${entry.level} ${entry.component} ${entry.fixture}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function findFixture(registry: Registry, component: string, fixture: string): ReactElement | undefined {
  for (const level of LEVELS) {
    const element = registry[level][component]?.[fixture];
    if (element) return element;
  }
  return undefined;
}

/** Index of all fixtures: search input on top, grouped by atomic level. */
function CatalogIndex({ registry, initialQuery }: { registry: Registry; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the query in the URL so reload and shared links keep the filter.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [query]);

  // "/" focuses the search input, like many documentation sites.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || document.activeElement === inputRef.current) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visible = flatten(registry).filter((entry) => matches(entry, query));

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 720 }}>
      <input
        ref={inputRef}
        type="search"
        aria-label="Search fixtures"
        placeholder="Search (press /)"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        // biome-ignore lint/a11y/noAutofocus: the index page exists to be searched.
        autoFocus
        style={{ width: "100%", padding: "8px 10px", fontSize: 15, boxSizing: "border-box" }}
      />
      <p aria-live="polite" style={{ color: "#666", fontSize: 13 }}>
        {visible.length} fixtures
      </p>
      {LEVELS.map((level) => {
        const items = visible.filter((entry) => entry.level === level);
        if (items.length === 0) return null;
        return (
          <section key={level} aria-labelledby={`level-${level}`}>
            <h2 id={`level-${level}`} style={{ fontSize: 14, textTransform: "uppercase", color: "#666" }}>
              {level}
            </h2>
            <ul style={{ lineHeight: 1.8, marginTop: 0 }}>
              {items.map(({ component, fixture }) => (
                <li key={fixtureUrl(component, fixture)}>
                  <a href={fixtureUrl(component, fixture)}>
                    {component} / {fixture}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/** Renders one fixture when `c` and `f` match, otherwise the index. */
export function Catalog({ registry, search }: { registry: Registry; search: string }) {
  const params = new URLSearchParams(search);
  const component = params.get("c");
  const fixture = params.get("f");
  const selected = component && fixture ? findFixture(registry, component, fixture) : undefined;

  return selected ?? <CatalogIndex registry={registry} initialQuery={params.get("q") ?? ""} />;
}
