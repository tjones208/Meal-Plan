"use client";

import { useMemo, useState } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Card, Loading, ErrorCard, NeedImport, Money, COLORS } from "@/components/ui";
import { categoryOf, CODE_LABEL, inRange, type Category } from "@/lib/analytics";
import { shortDate, num } from "@/lib/format";

const CATEGORIES: Array<{ key: Category | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "option", label: "Options" },
  { key: "stock", label: "Stocks" },
  { key: "dividend", label: "Dividends" },
  { key: "interest", label: "Interest" },
  { key: "capital", label: "Transfers" },
  { key: "fee", label: "Fees" },
  { key: "other", label: "Other" },
];

const CAT_COLOR: Record<string, string> = {
  option: COLORS.options,
  stock: COLORS.stock,
  dividend: COLORS.dividends,
  interest: COLORS.interest,
  capital: "#9085e9",
  fee: COLORS.fees,
  other: COLORS.muted,
};

const PAGE = 50;

export default function TransactionsPage() {
  const { txns, loading, error, range } = useData();
  const [cat, setCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const sorted = useMemo(
    () =>
      [...txns]
        .filter((t) => inRange(t.activity_date, range))
        .sort((a, b) => ((a.activity_date ?? "") < (b.activity_date ?? "") ? 1 : -1)),
    [txns, range]
  );

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return sorted.filter((t) => {
      if (cat !== "all" && categoryOf(t.trans_code) !== cat) return false;
      if (ql) {
        const hay = `${t.instrument ?? ""} ${t.description ?? ""} ${t.trans_code ?? ""}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [sorted, cat, q]);

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length) return <Loading />;
  if (!txns.length) return <NeedImport />;

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const clampedPage = Math.min(page, pages - 1);
  const slice = filtered.slice(clampedPage * PAGE, clampedPage * PAGE + PAGE);

  return (
    <>
      <PageHeader title="Transactions" subtitle={`${num(txns.length)} total records from your Robinhood activity`} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className="pill"
            style={{
              cursor: "pointer",
              padding: "6px 12px",
              background: cat === c.key ? COLORS.options : undefined,
              color: cat === c.key ? "#fff" : undefined,
              borderColor: cat === c.key ? COLORS.options : undefined,
            }}
            onClick={() => {
              setCat(c.key);
              setPage(0);
            }}
          >
            {c.label}
          </button>
        ))}
        <input
          className="input"
          style={{ width: 200, marginLeft: "auto", padding: "8px 12px" }}
          placeholder="Search ticker / description…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Date</th>
                <th>Ticker</th>
                <th>Activity</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((t) => {
                const c = categoryOf(t.trans_code);
                return (
                  <tr key={t.id}>
                    <td className="strong">{shortDate(t.activity_date)}</td>
                    <td className="strong">{t.instrument || "—"}</td>
                    <td>
                      <span className="pill" style={{ color: CAT_COLOR[c], borderColor: "var(--border)" }}>
                        {CODE_LABEL[t.trans_code ?? ""] ?? t.trans_code ?? "—"}
                      </span>
                    </td>
                    <td className="muted" style={{ whiteSpace: "normal", maxWidth: 320, fontSize: 12.5 }}>
                      {t.description || "—"}
                    </td>
                    <td className="tabnum">{t.quantity != null ? num(t.quantity, t.quantity % 1 ? 4 : 0) : "—"}</td>
                    <td className="tabnum">{t.price != null ? `$${t.price.toFixed(2)}` : "—"}</td>
                    <td>{t.amount != null ? <Money value={t.amount} /> : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <span className="muted" style={{ fontSize: 13 }}>
          {filtered.length ? `Showing ${clampedPage * PAGE + 1}–${Math.min((clampedPage + 1) * PAGE, filtered.length)} of ${num(filtered.length)}` : "No matches"}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" disabled={clampedPage === 0} onClick={() => setPage(clampedPage - 1)}>
            ← Prev
          </button>
          <span className="muted" style={{ fontSize: 13, alignSelf: "center" }}>
            {clampedPage + 1} / {pages}
          </span>
          <button className="btn" disabled={clampedPage >= pages - 1} onClick={() => setPage(clampedPage + 1)}>
            Next →
          </button>
        </div>
      </div>
    </>
  );
}
