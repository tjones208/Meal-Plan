"use client";

import { useMemo } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Card, Grid, Kpi, Loading, ErrorCard, NeedImport, Money, COLORS } from "@/components/ui";
import { MonthlyIncomeChart } from "@/components/charts";
import { plStatement, monthlyIncome } from "@/lib/analytics";
import { usd, shortDate, num, pct } from "@/lib/format";

function periodLabel(range: { start: string | null; end: string | null }): string {
  if (!range.start && !range.end) return "All time";
  const s = range.start ? shortDate(range.start) : "beginning";
  const e = range.end ? shortDate(range.end) : "today";
  return `${s} – ${e}`;
}

function Line({
  label,
  value,
  indent,
  total,
  note,
}: {
  label: string;
  value: number;
  indent?: boolean;
  total?: boolean;
  note?: string;
}) {
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
          fontWeight: total ? 700 : 500,
          color: total ? "var(--text-primary)" : "var(--text-secondary)",
        }}
      >
        {label}
        {note && <span className="muted" style={{ fontSize: 11.5, marginLeft: 8 }}>{note}</span>}
      </span>
      <span style={{ fontWeight: total ? 700 : 500 }}>
        <Money value={value} bold={total} />
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", margin: "16px 0 2px" }}>
      {children}
    </div>
  );
}

export default function PnlPage() {
  const { txns, loading, error, range } = useData();
  const pl = useMemo(() => plStatement(txns, range), [txns, range]);
  const monthly = useMemo(() => monthlyIncome(txns, range), [txns, range]);

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length) return <Loading />;
  if (!txns.length) return <NeedImport />;

  const investmentIncome = pl.dividendNet + pl.interestIncome;

  return (
    <>
      <PageHeader title="Profit & Loss Statement" subtitle={`Period: ${periodLabel(range)} · change the period in the top bar to run any month`} />

      <Grid min={210}>
        <Kpi label="Net income (P&L)" value={usd(pl.netIncome, { sign: pl.netIncome > 0 })} tone={pl.netIncome >= 0 ? "pos" : "neg"} accent={COLORS.good} />
        <Kpi label="Net options premium" value={usd(pl.optionsNet, { sign: pl.optionsNet > 0 })} tone={pl.optionsNet >= 0 ? "pos" : "neg"} accent={COLORS.options} />
        <Kpi label="Net realized stock" value={usd(pl.stockNet, { sign: pl.stockNet > 0 })} tone={pl.stockNet >= 0 ? "pos" : "neg"} accent={COLORS.stock} />
        <Kpi label="Dividends + interest" value={usd(investmentIncome, { sign: investmentIncome > 0 })} tone={investmentIncome >= 0 ? "pos" : "neg"} accent={COLORS.dividends} />
      </Grid>

      <div style={{ height: 20 }} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: 16 }} className="rh-two-col">
        <Card title="Statement" subtitle={periodLabel(range)}>
          <SectionTitle>Trading — stocks</SectionTitle>
          <Line label="Realized stock gains" value={pl.stockGains} indent />
          <Line label="Realized stock losses" value={pl.stockLosses} indent />
          <Line label="Net stock P&L" value={pl.stockNet} total />

          <SectionTitle>Trading — options</SectionTitle>
          <Line label="Call options (net premium)" value={pl.callOptions} indent />
          <Line label="Put options (net premium)" value={pl.putOptions} indent />
          {Math.abs(pl.otherOptions) > 0.005 && <Line label="Other options" value={pl.otherOptions} indent />}
          <Line label="Net options premium" value={pl.optionsNet} total />

          <SectionTitle>Investment income</SectionTitle>
          <Line label="Dividend income" value={pl.dividendIncome} indent />
          {Math.abs(pl.dividendTax) > 0.005 && <Line label="Dividend tax withheld" value={pl.dividendTax} indent />}
          <Line label="Interest income" value={pl.interestIncome} indent />
          <Line label="Total investment income" value={pl.dividendNet + pl.interestIncome} total />

          <SectionTitle>Expenses</SectionTitle>
          <Line label="Margin interest" value={pl.marginInterest} indent />
          <Line label="Gold & regulatory fees" value={pl.otherFees} indent />
          <Line label="Total expenses" value={pl.feesTotal} total />

          <Line label="NET INCOME" value={pl.netIncome} total />
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Option contract outcomes" subtitle="Winners vs losers in this period (by contracts)">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <OutcomeRow label="Winners — expired worthless" value={pl.contractsWon} color={COLORS.good} hint="premium kept" />
              <OutcomeRow label="Losers — bought to close" value={pl.contractsLost} color={COLORS.critical} hint="paid to exit" />
              <OutcomeRow label="Assigned" value={pl.contractsAssigned} color={COLORS.stock} hint="shares delivered" />
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <div className="kpi-label">Win rate</div>
              <div className={`kpi-value tabnum ${(pl.winRate ?? 0) >= 0.5 ? "pos" : ""}`} style={{ fontSize: 24 }}>
                {pl.winRate != null ? pct(pl.winRate, 0) : "—"}
              </div>
              <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
                Contracts expiring worthless ÷ all resolved contracts
              </div>
            </div>
          </Card>

          <Card title="How to read this">
            <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>
              Stock P&L uses FIFO cost basis over your full history, attributed to each sale&apos;s date.
              Option premium is split into calls vs puts by the contract description. &quot;Winners&quot; are
              short contracts that expired worthless (you keep the premium); &quot;losers&quot; are positions you
              bought back to close.
            </p>
          </Card>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <Card title="Net income by month" subtitle="Each month within the selected period">
        <MonthlyIncomeChart data={monthly} height={300} />
      </Card>
    </>
  );
}

function OutcomeRow({ label, value, color, hint }: { label: string; value: number; color: string; hint: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--grid)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
        {label}
        <span className="muted" style={{ fontSize: 11 }}>· {hint}</span>
      </span>
      <span className="tabnum" style={{ fontSize: 15, fontWeight: 650 }}>{num(value)}</span>
    </div>
  );
}
