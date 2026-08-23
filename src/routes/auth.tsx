import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { ARCHIVE_NAME } from "@/lib/archive";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Curator sign in — ${ARCHIVE_NAME}` },
      { name: "description", content: "Private sign in for archive curators." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Curator sign in — ${ARCHIVE_NAME}` },
      { property: "og:description", content: "Private sign in for archive curators." },
    ],
  }),
  component: AuthPage,
});

/** Email + password sign in for the two administrator accounts. */
function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);
    if (signInError) {
      setError("Those details were not recognised.");
      return;
    }
    void navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display text-xl tracking-[0.35em]">
          {ARCHIVE_NAME}
        </Link>
        <h1 className="display mt-8 text-4xl">Curator access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This area is restricted to the archive's two authorised administrators.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="email" className="eyebrow">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="eyebrow">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-accent"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="eyebrow w-full border border-accent py-3 text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link to="/" className="eyebrow mt-10 inline-block hover:text-foreground">
          ← Back to the archive
        </Link>
      </div>
    </div>
  );
}
