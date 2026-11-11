import type { FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";

export interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => void;
  /** Busy state while the request is in flight. */
  loading?: boolean;
  /** Error from the server, shown above the button. */
  error?: string;
}

/** Email + password form. Knows its fields, not where the data goes. */
export function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({ email: String(data.get("email") ?? ""), password: String(data.get("password") ?? "") });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormField label="Email" name="email" type="email" autoComplete="email" required />
      <FormField label="Password" name="password" type="password" autoComplete="current-password" required />
      {error && (
        <p role="alert" style={{ margin: 0, fontSize: 13, color: "#c0392b" }}>
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} loadingLabel="Signing in..." fullWidth>
        Sign in
      </Button>
    </form>
  );
}
