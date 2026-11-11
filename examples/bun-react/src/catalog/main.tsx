import { createRoot } from "react-dom/client";
import { AppProviders } from "@/providers";
import { Catalog } from "./Catalog";
import { registry } from "./registry";

// Wrap with the same providers as the app so fixtures look the same as in production.
const elem = document.getElementById("root")!;
createRoot(elem).render(
  <AppProviders>
    <Catalog registry={registry} search={window.location.search} />
  </AppProviders>,
);
