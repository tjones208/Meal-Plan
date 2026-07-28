"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setErr(error.message);
    setBusy(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "radial-gradient(1200px 600px at 50% -10%, #16211c 0%, var(--plane) 55%)",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--good)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              color: "#052e05",
            }}
          >
            ↑
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Returns Tracker</div>
            <div className="muted" style={{ fontSize: 12 }}>Robinhood portfolio analytics</div>
          </div>
        </div>

        <form onSubmit={submit}>
          <label className="kpi-label">Email</label>
          <input
            className="input"
            style={{ margin: "6px 0 14px" }}
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label className="kpi-label">Password</label>
          <input
            className="input"
            style={{ margin: "6px 0 18px" }}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && (
            <div className="neg" style={{ fontSize: 13, marginBottom: 12 }}>
              {err}
            </div>
          )}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy} type="submit">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="muted" style={{ fontSize: 11.5, marginTop: 16, lineHeight: 1.5 }}>
          Your data is private and protected by row-level security. Only your account can read these
          transactions.
        </p>
      </div>
    </div>
  );
}
