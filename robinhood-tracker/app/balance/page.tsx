"use client";

import { useEffect, useMemo, useState } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Card, Grid, Kpi, Loading, ErrorCard, NeedImport, Money, COLORS } from "@/components/ui";
import { balanceSheet } from "@/lib/analytics";
import { usd, shortDate } from "@/lib/format";

function todayIso(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function Line({ label, value, indent, total, strong }: { label: string; value: number; indent?: boolean; total?: boolean; strong?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 16,
        padding: total ? "12px 0 2px" : "7px 0",
        borderTop: total ? "1px solid var(--border-strong)" : undefined,
        marginTop: total ? 6 : 0,
      }}
    >
      <span
        style={{
          paddingLeft: indent ? 16 : 0,
          fontSize: total ? 14.5 : 13.5,
          fontWeight: total || strong ? 700 : 500,
          color: total || strong ? "var(--text-primary)" : "var(--text-secondary)",
        }}
      >
        {label}
      </span>
      <span>
        <Money value={value} bold={total || strong} />
      </span>
    </div>
  );
}

export default function BalancePage() {
  const { txns, loading, error, range } = useData();
  const [mv, setMv] = useState("");
  const [margin, setMargin] = useState("");

  useEffect(() => {
    setMv(localStorage.getItem("rh_market_value") || "");
    setMargin(localStorage.getItem("rh_margin_balance") || "");
  }, []);

  const asOf = range.end || todayIso();
  const marketValue = parseFloat(mv.replace(/[^0-9.]/g, "")) || 0;
  const marginBalance = parseFloat(margin.replace(/[^0-9.]/g, "")) || 0;

  const bs = useMemo(
    () => balanceSheet(txns, asOf, marketValue, marginBalance),
    [txns, asOf, marketValue, marginBalance]
  );

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length) return <Loading />;
  if (!txns.length) return <NeedImport />;

  const hasMv = marketValue > 0;

  return (
    <>
      <PageHeader title="Balance Sheet" subtitle={`As of ${shortDate(asOf)} · set the period in the top bar to run month-end`} />

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ maxWidth: 220 }}>
            <div className="kpi-label" style={{ marginBottom: 6 }}>Portfolio market value</div>
            <input
              className="input"
              inputMode="decimal"
              placeholder="e.g. 145000"
              value={mv}
              onChange={(e) => {
                setMv(e.target.value);
                localStorage.setItem("rh_market_value", e.target.value);
              }}
            />
          </div>
          <div style={{ maxWidth: 220 }}>
            <div className="kpi-label" style={{ marginBottom: 6 }}>Margin balance owed (optional)</div>
            <input
              className="input"
              inputMode="decimal"
              placeholder="0"
              value={margin}
              onChange={(e) => {
                setMargin(e.target.value);
                localStorage.setItem("rh_margin_balance", e.target.value);
              }}
            />
          </div>
          <div className="muted" style={{ fontSize: 12, maxWidth: 320, lineHeight: 1.5 }}>
            Enter your account value (and any margin owed). Everything else is derived from your
            transaction history.
          </div>
        </div>
      </Card>

      <Grid min={210}>
        <Kpi label="Total assets" value={usd(bs.totalAssets)} accent={COLORS.good} sub="Portfolio market value" />
        <Kpi label="Total liabilities" value={usd(bs.totalLiabilities)} accent={COLORS.critical} sub="Margin owed" />
        <Kpi label="Total equity" value={usd(bs.totalEquity)} accent={COLORS.options} sub="Assets − liabilities" />
        <Kpi
          label="Unrealized gain/loss"
          value={hasMv ? usd(bs.unrealized, { sign: bs.unrealized > 0 }) : "—"}
          tone={bs.unrealized >= 0 ? "pos" : "neg"}
          accent={COLORS.dividends}
          sub="Equity above cost basis"
        />
      </Grid>

      <div style={{ height: 20 }} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }} className="rh-two-col">
        <Card title="Assets & liabilities" subtitle={`As of ${shortDate(asOf)}`}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 2 }}>
            Assets
          </div>
          <Line label="Investment portfolio (market value)" value={bs.marketValue} indent />
          <Line label="Total assets" value={bs.totalAssets} total />

          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", margin: "18px 0 2px" }}>
            Liabilities
          </div>
          <Line label="Margin loan" value={-Math.abs(bs.marginBalance)} indent />
          <Line label="Total liabilities" value={-Math.abs(bs.totalLiabilities)} total />
        </Card>

        <Card title="Equity" subtitle="Your ownership in the account">
          <Line label="Contributed capital (net deposits)" value={bs.contributedCapital} indent />
          <Line label="Realized earnings (to date)" value={bs.realizedEarnings} indent />
          <Line label="Book equity (cost basis)" value={bs.bookEquity} strong />
          <Line label="Unrealized gain/loss on positions" value={bs.unrealized} indent />
          <Line label="Total equity" value={bs.totalEquity} total />
          <p className="muted" style={{ fontSize: 11.5, lineHeight: 1.6, marginTop: 14 }}>
            Book equity = what you put in plus realized profits. Total equity is your account value less
            margin owed; the difference is unrealized gain/loss on open positions.
          </p>
        </Card>
      </div>

      <div style={{ height: 16 }} />

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>Balance check — Assets = Liabilities + Equity</span>
          <span className="tabnum" style={{ fontSize: 14 }}>
            {usd(bs.totalAssets)} = {usd(bs.totalLiabilities)} + {usd(bs.totalEquity)}
          </span>
        </div>
      </Card>
    </>
  );
}
