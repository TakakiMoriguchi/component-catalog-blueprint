import { FormField } from "./FormField";

export default {
  Default: <FormField label="Email" type="email" placeholder="you@example.com" />,
  "With hint": <FormField label="Password" type="password" hint="At least 12 characters." />,
  "With error": (
    <FormField label="Email" type="email" defaultValue="not-an-email" error="Enter a valid email address." />
  ),
};
