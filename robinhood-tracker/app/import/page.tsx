"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Card, Loading, ErrorCard, COLORS } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { parseRobinhoodCsv, type ParsedTxn } from "@/lib/csv";
import { num } from "@/lib/format";

type Status = { kind: "idle" | "working" | "done" | "error"; message: string; inserted?: number; total?: number };

const BUNDLED = "/robinhood_export.csv";

export default function ImportPage() {
  const { session, txns, loading, error, reload } = useData();
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const [bundledAvailable, setBundledAvailable] = useState<boolean | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const autoTried = useRef(false);

  const runImport = useCallback(
    async (rows: ParsedTxn[], filename: string) => {
      if (!session?.user) return;
      if (!rows.length) {
        setStatus({ kind: "error", message: "No transactions found in that file." });
        return;
      }
      setStatus({ kind: "working", message: `Importing ${num(rows.length)} transactions…`, total: rows.length });
      const userId = session.user.id;
      const withUser = rows.map((r) => ({ ...r, user_id: userId }));
      const BATCH = 500;
      let inserted = 0;
      try {
        for (let i = 0; i < withUser.length; i += BATCH) {
          const chunk = withUser.slice(i, i + BATCH);
          const { error: err, count } = await supabase
            .from("rh_transactions")
            .upsert(chunk, { onConflict: "user_id,row_hash", ignoreDuplicates: true, count: "estimated" });
          if (err) throw err;
          inserted += count ?? chunk.length;
          setStatus({ kind: "working", message: `Imported ${num(Math.min(i + BATCH, withUser.length))} / ${num(withUser.length)}…`, total: withUser.length });
        }
        await supabase.from("rh_imports").insert({ user_id: userId, filename, row_count: rows.length, inserted_count: inserted });
        await reload();
        setStatus({ kind: "done", message: `Done — ${num(rows.length)} transactions processed.`, inserted, total: rows.length });
      } catch (e: unknown) {
        setStatus({ kind: "error", message: e instanceof Error ? e.message : "Import failed." });
      }
    },
    [session, reload]
  );

  const importBundled = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setStatus({ kind: "working", message: "Loading bundled Robinhood export…" });
        const res = await fetch(BUNDLED);
        const text = res.ok ? await res.text() : "";
        // Guard against a 404 page or SPA fallback being parsed as CSV.
        if (!res.ok || !/Trans Code|Activity Date/.test(text)) {
          if (silent) {
            setStatus({ kind: "idle", message: "" });
            return;
          }
          setStatus({
            kind: "error",
            message: "No bundled dataset is included in this deployment. Upload your Robinhood CSV below.",
          });
          return;
        }
        const rows = parseRobinhoodCsv(text, "robinhood_export.csv");
        await runImport(rows, "robinhood_export.csv");
      } catch (e: unknown) {
        if (silent) setStatus({ kind: "idle", message: "" });
        else setStatus({ kind: "error", message: e instanceof Error ? e.message : "Failed to load bundled data." });
      }
    },
    [runImport]
  );

  // Detect whether a bundled dataset ships with this deployment.
  useEffect(() => {
    let alive = true;
    fetch(BUNDLED, { method: "HEAD" })
      .then((r) => alive && setBundledAvailable(r.ok))
      .catch(() => alive && setBundledAvailable(false));
    return () => {
      alive = false;
    };
  }, []);

  // Auto-seed on first login when the account has no data yet and a dataset is bundled.
  useEffect(() => {
    if (autoTried.current) return;
    if (loading || error) return;
    if (!session?.user) return;
    if (txns.length > 0) return;
    if (bundledAvailable !== true) return;
    if (localStorage.getItem("rh_seed_attempted") === "1") return;
    autoTried.current = true;
    localStorage.setItem("rh_seed_attempted", "1");
    importBundled(true);
  }, [session, txns, loading, error, bundledAvailable, importBundled]);

  async function onFile(file: File) {
    const text = await file.text();
    const rows = parseRobinhoodCsv(text, file.name);
    await runImport(rows, file.name);
  }

  async function clearAll() {
    if (!session?.user) return;
    if (!confirm("Delete ALL imported transactions for your account? This cannot be undone.")) return;
    setStatus({ kind: "working", message: "Deleting…" });
    const { error: err } = await supabase.from("rh_transactions").delete().eq("user_id", session.user.id);
    if (err) setStatus({ kind: "error", message: err.message });
    else {
      localStorage.removeItem("rh_seed_attempted");
      await reload();
      setStatus({ kind: "done", message: "All transactions deleted." });
    }
  }

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length && status.kind === "idle") return <Loading />;

  const busy = status.kind === "working";

  return (
    <>
      <PageHeader title="Import Data" subtitle="Load or refresh your Robinhood transaction history" />

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="section-title">Currently loaded</div>
            <div className="muted" style={{ fontSize: 13.5, marginTop: 2 }}>
              {num(txns.length)} transactions in your account
            </div>
          </div>
          {txns.length > 0 && (
            <button className="btn" style={{ borderColor: "rgba(208,59,59,0.5)", color: COLORS.criticalText }} onClick={clearAll} disabled={busy}>
              Clear all data
            </button>
          )}
        </div>
      </Card>

      {status.kind !== "idle" && (
        <Card style={{ marginBottom: 16, borderColor: status.kind === "error" ? "rgba(208,59,59,0.4)" : status.kind === "done" ? "rgba(12,163,12,0.4)" : "var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{status.kind === "done" ? "✓" : status.kind === "error" ? "⚠" : "⟳"}</span>
            <span className={status.kind === "error" ? "neg" : status.kind === "done" ? "pos" : ""} style={{ fontSize: 14, fontWeight: 500 }}>
              {status.message}
            </span>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }} className="rh-two-col">
        {bundledAvailable !== false && (
          <Card title="Load the provided export" subtitle="The Robinhood CSV you started with, bundled in the app">
            <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6, marginTop: 0 }}>
              Imports your full account activity. Safe to run more than once — duplicates are skipped
              automatically.
            </p>
            <button className="btn btn-primary" onClick={() => importBundled(false)} disabled={busy}>
              {busy ? "Working…" : "Load bundled data"}
            </button>
          </Card>
        )}

        <Card title="Upload a CSV" subtitle="Load or refresh from a Robinhood account activity export">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) onFile(f);
            }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `1.5px dashed ${dragOver ? COLORS.options : "var(--border-strong)"}`,
              borderRadius: 12,
              padding: "28px 16px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "rgba(57,135,229,0.06)" : "transparent",
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 6 }}>↥</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Drop a CSV here or click to browse</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Robinhood account activity export (.csv)
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
        </Card>
      </div>

      <Card style={{ marginTop: 16 }} title="How it works">
        <ul className="muted" style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
          <li>Each row is fingerprinted so re-importing the same or an overlapping export never creates duplicates.</li>
          <li>Data is stored privately in Supabase and protected by row-level security — only your login can read it.</li>
          <li>All analytics recalculate instantly from the transactions on every page.</li>
        </ul>
      </Card>
    </>
  );
}
