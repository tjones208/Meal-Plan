"use client";

import { useMemo, useState } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Card, Loading, ErrorCard, NeedImport, Money, Grid, Kpi, COLORS } from "@/components/ui";
import { HBar } from "@/components/charts";
import { perInstrument, summarize, type InstrumentRow } from "@/lib/analytics";
import { num, usd } from "@/lib/format";

type SortKey = "instrument" | "optionsNet" | "realizedStock" | "dividends" | "total" | "openShares" | "txns";

export default function StocksPage() {
  const { txns, loading, error } = useData();
  const rows = useMemo(() => perInstrument(txns), [txns]);
  const s = useMemo(() => summarize(txns), [txns]);
  const [sort, setSort] = useState<SortKey>("total");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [q, setQ] = useState("");

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length) return <Loading />;
  if (!txns.length) return <NeedImport />;

  const filtered = rows.filter((r) => r.instrument.toLowerCase().includes(q.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];
    let cmp: number;
    if (typeof av === "string" || typeof bv === "string") cmp = String(av).localeCompare(String(bv));
    else cmp = (av as number) - (bv as number);
    return dir === "asc" ? cmp : -cmp;
  });

  const topBars = [...rows]
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
    .slice(0, 12)
    .map((r) => ({ label: r.instrument, value: r.total }))
    .sort((a, b) => b.value - a.value);

  const openPositions = rows.filter((r) => r.openShares !== 0).length;
  const profitable = rows.filter((r) => r.total > 0).length;

  function head(key: SortKey, label: string) {
    const active = sort === key;
    return (
      <th
        style={{ cursor: "pointer", color: active ? "#fff" : undefined }}
        onClick={() => {
          if (active) setDir(dir === "asc" ? "desc" : "asc");
          else {
            setSort(key);
            setDir(key === "instrument" ? "asc" : "desc");
          }
        }}
      >
        {label} {active ? (dir === "asc" ? "▲" : "▼") : ""}
      </th>
    );
  }

  return (
    <>
      <PageHeader title="Stock Performance" subtitle="Total realized performance per ticker — options premium, stock P&L, and dividends combined" />

      <Grid min={200}>
        <Kpi label="Tickers traded" value={num(rows.length)} accent={COLORS.options} />
        <Kpi label="Profitable tickers" value={`${profitable} / ${rows.length}`} tone="pos" accent={COLORS.good} />
        <Kpi label="Open positions" value={num(openPositions)} accent={COLORS.dividends} sub="Tickers with shares still held" />
        <Kpi label="Realized stock P&L" value={usd(s.realizedStock, { sign: s.realizedStock > 0 })} tone={s.realizedStock >= 0 ? "pos" : "neg"} accent={COLORS.stock} />
      </Grid>

      <div style={{ height: 20 }} />

      <Card title="Total performance by ticker" subtitle="Options + realized stock P&L + dividends · top 12 by magnitude">
        <HBar data={topBars} height={360} colorBySign />
      </Card>

      <div style={{ height: 16 }} />

      <Card
        title="All tickers"
        right={
          <input
            className="input"
            style={{ width: 160, padding: "8px 12px" }}
            placeholder="Filter ticker…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        }
      >
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                {head("instrument", "Ticker")}
                {head("optionsNet", "Options")}
                {head("realizedStock", "Stock P&L")}
                {head("dividends", "Dividends")}
                {head("total", "Total")}
                {head("openShares", "Open shares")}
                {head("txns", "Txns")}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r: InstrumentRow) => (
                <tr key={r.instrument}>
                  <td className="strong">{r.instrument}</td>
                  <td><Money value={r.optionsNet} /></td>
                  <td><Money value={r.realizedStock} /></td>
                  <td><Money value={r.dividends} /></td>
                  <td className="strong"><Money value={r.total} bold /></td>
                  <td className="tabnum" style={{ color: r.openShares ? "#fff" : undefined }}>
                    {r.openShares ? num(r.openShares) : "—"}
                  </td>
                  <td className="tabnum">{r.txns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted" style={{ fontSize: 11.5, marginTop: 12, lineHeight: 1.5 }}>
          Stock P&L uses FIFO cost-basis matching on buys and sells (including option assignments, which
          settle as share transactions). Open share counts reflect net shares from this activity history.
        </p>
      </Card>
    </>
  );
}
