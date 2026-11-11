import type { ReactElement } from "react";
import button from "@/components/atoms/Button.fixture";
import textInput from "@/components/atoms/TextInput.fixture";
import formField from "@/components/molecules/FormField.fixture";
import loginForm from "@/components/organisms/LoginForm.fixture";
import loginPage from "@/components/pages/LoginPage.fixture";
import centeredLayout from "@/components/templates/CenteredLayout.fixture";

/** Atomic design levels, in the order the catalog index shows them. */
export const LEVELS = ["atoms", "molecules", "organisms", "templates", "pages"] as const;
export type Level = (typeof LEVELS)[number];

/** fixture name -> element */
export type Fixtures = Record<string, ReactElement>;
/** level -> component name -> fixtures. Component names are unique across levels. */
export type Registry = Record<Level, Record<string, Fixtures>>;

// Add one line here when you add a `*.fixture.tsx`.
// Bun has no import.meta.glob, so fixtures cannot be collected automatically.
// The level must match the directory the component lives in.
export const registry: Registry = {
  atoms: { Button: button, TextInput: textInput },
  molecules: { FormField: formField },
  organisms: { LoginForm: loginForm },
  templates: { CenteredLayout: centeredLayout },
  pages: { LoginPage: loginPage },
};
