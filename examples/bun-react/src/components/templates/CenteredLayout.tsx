import type { ReactNode } from "react";

export interface CenteredLayoutProps {
  title: string;
  children: ReactNode;
}

/** Page skeleton: a titled card centered in the viewport. Content comes from slots. */
export function CenteredLayout({ title, children }: CenteredLayoutProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f5f5",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
        }}
      >
        <h1 style={{ margin: "0 0 16px", fontSize: 20 }}>{title}</h1>
        {children}
      </section>
    </main>
  );
}
