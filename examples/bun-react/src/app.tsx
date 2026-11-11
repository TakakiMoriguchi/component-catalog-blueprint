import { useState } from "react";
import { createRoot } from "react-dom/client";
import { LoginPage } from "@/components/pages/LoginPage";
import { AppProviders } from "@/providers";

// The "real app" that the catalog sits next to. It has its own entry, separate from catalog.html.
// Data handling lives here; components only receive props.
function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = ({ email }: { email: string; password: string }) => {
    setLoading(true);
    setError(undefined);
    setTimeout(() => {
      setLoading(false);
      setError(`No account found for ${email}. (This sample has no backend.)`);
    }, 1000);
  };

  return <LoginPage onSubmit={handleSubmit} loading={loading} error={error} />;
}

const elem = document.getElementById("root")!;
createRoot(elem).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
