"use client";

import { useMemo, useState, useEffect } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Kpi, Grid, Card, Loading, ErrorCard, NeedImport, COLORS, Money } from "@/components/ui";
import { CumulativeChart, Donut, MonthlyIncomeChart } from "@/components/charts";
import {
  summarize,
  monthlyIncome,
  cumulative,
  incomeSources,
  perInstrument,
} from "@/lib/analytics";
import { usd, pct, shortDate } from "@/lib/format";

export default function OverviewPage() {
  const { txns, loading, error, range } = useData();
  const [marketValue, setMarketValue] = useState<string>("");

  useEffect(() => {
    const v = localStorage.getItem("rh_market_value");
    if (v) setMarketValue(v);
  }, []);

  const s = useMemo(() => summarize(txns, range), [txns, range]);
  const monthly = useMemo(() => monthlyIncome(txns, range), [txns, range]);
  const cum = useMemo(() => cumulative(monthly), [monthly]);
  const instruments = useMemo(() => perInstrument(txns, range), [txns, range]);

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length) return <Loading />;
  if (!txns.length) return <NeedImport />;

  const donutData = incomeSources(s)
    .filter((d) => d.value > 0)
    .map((d, i) => ({ name: d.label, value: d.value, color: [COLORS.options, COLORS.stock, COLORS.dividends, COLORS.interest][i % 4] }));

  const mv = parseFloat(marketValue.replace(/[^0-9.]/g, ""));
  const hasMv = !Number.isNaN(mv) && mv > 0;
  const totalPnl = hasMv ? mv - s.netContributions : null;
  const totalReturnPct = hasMv && s.netContributions > 0 ? (mv - s.netContributions) / s.netContributions : null;

  const winners = instruments.filter((r) => r.total > 0).slice(0, 5);
  const losers = [...instruments].filter((r) => r.total < 0).sort((a, b) => a.total - b.total).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Portfolio Overview"
        subtitle={`${s.txnCount.toLocaleString()} transactions · ${shortDate(s.firstDate)} – ${shortDate(s.lastDate)}`}
      />

      <Grid min={210}>
        <Kpi
          label="Total realized return"
          value={usd(s.totalRealizedReturn, { sign: s.totalRealizedReturn > 0 })}
          tone={s.totalRealizedReturn >= 0 ? "pos" : "neg"}
          accent={COLORS.good}
          sub="Options + dividends + interest + stock P&L − fees"
        />
        <Kpi
          label="Net contributions"
          value={usd(s.netContributions)}
          accent={COLORS.options}
          sub={`${usd(s.deposits)} in · ${usd(s.withdrawals)} out`}
        />
        <Kpi
          label="Return on net contributions"
          value={s.totalReturnOnContributions != null ? pct(s.totalReturnOnContributions) : "—"}
          tone={(s.totalReturnOnContributions ?? 0) >= 0 ? "pos" : "neg"}
          accent={COLORS.dividends}
          sub="Realized return ÷ net cash invested"
        />
        <Kpi
          label="Options premium (net)"
          value={usd(s.optionsNet, { sign: true })}
          tone="pos"
          accent={COLORS.options}
          sub="Your #1 performance driver"
        />
      </Grid>

      <div style={{ height: 14 }} />

      <Grid min={170}>
        <Kpi label="Dividends" value={usd(s.dividendsNet, { sign: true })} tone="pos" />
        <Kpi label="Interest earned" value={usd(s.interest, { sign: true })} tone="pos" />
        <Kpi label="Realized stock P&L" value={usd(s.realizedStock, { sign: s.realizedStock > 0 })} tone={s.realizedStock >= 0 ? "pos" : "neg"} />
        <Kpi label="Fees & margin" value={usd(s.fees)} tone="neg" />
      </Grid>

      <div style={{ height: 20 }} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 16 }} className="rh-two-col">
        <Card title="Cumulative realized return" subtitle="Running total of all income & realized P&L">
          <CumulativeChart data={cum} />
        </Card>
        <Card title="What's driving returns" subtitle="Share of positive income sources">
          <Donut data={donutData} />
        </Card>
      </div>

      <div style={{ height: 16 }} />

      <Card title="Monthly income by source" subtitle="Options, stock P&L, dividends, interest & fees per month">
        <MonthlyIncomeChart data={monthly} />
      </Card>

      <div style={{ height: 16 }} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }} className="rh-two-col">
        <Card title="Top contributors" subtitle="Best total performance by ticker">
          <MiniTable rows={winners} />
        </Card>
        <Card title="Biggest drags" subtitle="Worst total performance by ticker">
          <MiniTable rows={losers} />
        </Card>
      </div>

      <div style={{ height: 16 }} />

      <Card
        title="Estimate total return (incl. unrealized)"
        subtitle="Enter your current Robinhood account value to include open positions"
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ maxWidth: 240 }}>
            <input
              className="input"
              inputMode="decimal"
              placeholder="e.g. 145000"
              value={marketValue}
              onChange={(e) => {
                setMarketValue(e.target.value);
                localStorage.setItem("rh_market_value", e.target.value);
              }}
            />
          </div>
          {hasMv ? (
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              <div>
                <div className="kpi-label">Total gain over contributions</div>
                <div className="kpi-value tabnum">
                  <Money value={totalPnl as number} bold />
                </div>
              </div>
              <div>
                <div className="kpi-label">Total return</div>
                <div className={`kpi-value tabnum ${(totalReturnPct ?? 0) >= 0 ? "pos" : "neg"}`}>
                  {totalReturnPct != null ? pct(totalReturnPct) : "—"}
                </div>
              </div>
            </div>
          ) : (
            <div className="muted" style={{ fontSize: 13 }}>
              Current value − net contributions ({usd(s.netContributions)}) = total gain including unrealized
              positions.
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

function MiniTable({ rows }: { rows: Array<{ instrument: string; total: number; optionsNet: number; realizedStock: number; dividends: number }> }) {
  if (!rows.length) return <div className="muted" style={{ fontSize: 13 }}>No data.</div>;
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Options</th>
          <th>Stock P&L</th>
          <th>Dividends</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.instrument}>
            <td className="strong">{r.instrument}</td>
            <td><Money value={r.optionsNet} /></td>
            <td><Money value={r.realizedStock} /></td>
            <td><Money value={r.dividends} /></td>
            <td className="strong"><Money value={r.total} bold /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
