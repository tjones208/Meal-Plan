"use client";

import { useMemo } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Grid, Card, Loading, ErrorCard, NeedImport, COLORS, Money, Kpi } from "@/components/ui";
import { MonthlyIncomeChart, HBar } from "@/components/charts";
import { summarize, monthlyIncome, incomeSources } from "@/lib/analytics";
import { usd, pct } from "@/lib/format";

export default function IncomePage() {
  const { txns, loading, error } = useData();
  const s = useMemo(() => summarize(txns), [txns]);
  const monthly = useMemo(() => monthlyIncome(txns), [txns]);

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length) return <Loading />;
  if (!txns.length) return <NeedImport />;

  const sources = incomeSources(s);
  const gross = sources.filter((x) => x.value > 0).reduce((a, b) => a + b.value, 0);
  const bars = sources.map((x) => ({ label: x.label.split(" ")[0], value: x.value }));

  const rows = [
    { label: "Options premium", value: s.optionsNet, note: `${usd(s.optionPremiumCollected)} collected − ${usd(Math.abs(s.optionPremiumPaid))} to close`, color: COLORS.options },
    { label: "Dividends (net of tax)", value: s.dividendsNet, note: `${usd(s.dividendsGross)} gross · ${usd(s.dividendTax)} tax`, color: COLORS.dividends },
    { label: "Interest earned", value: s.interest, note: "Cash & margin interest credited", color: COLORS.interest },
    { label: "Realized stock P&L", value: s.realizedStock, note: "FIFO cost-basis matched", color: COLORS.stock },
    { label: "Fees & margin", value: s.fees, note: "Gold, margin interest, regulatory fees", color: COLORS.fees },
  ];

  return (
    <>
      <PageHeader
        title="Income Sources"
        subtitle="What's actually driving your returns — every dollar of realized performance, categorized"
      />

      <Grid min={210}>
        <Kpi label="Total realized return" value={usd(s.totalRealizedReturn, { sign: s.totalRealizedReturn > 0 })} tone={s.totalRealizedReturn >= 0 ? "pos" : "neg"} accent={COLORS.good} />
        <Kpi label="Options premium" value={usd(s.optionsNet, { sign: true })} tone="pos" accent={COLORS.options} sub={`${pct(s.optionsNet / (gross || 1))} of gross income`} />
        <Kpi label="Dividends + interest" value={usd(s.dividendsNet + s.interest, { sign: true })} tone="pos" accent={COLORS.dividends} />
        <Kpi label="Stock trading" value={usd(s.realizedStock, { sign: s.realizedStock > 0 })} tone={s.realizedStock >= 0 ? "pos" : "neg"} accent={COLORS.stock} />
      </Grid>

      <div style={{ height: 20 }} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }} className="rh-two-col">
        <Card title="Net contribution by source" subtitle="Positive = added to returns, negative = subtracted">
          <HBar data={bars} height={280} colorBySign />
        </Card>
        <Card title="The story" subtitle="How the pieces fit together">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13.5, color: COLORS.text, lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              Options premium of <b className="pos">{usd(s.optionsNet, { sign: true })}</b> is the dominant engine
              of this portfolio — a systematic premium-selling strategy.
            </p>
            <p style={{ margin: 0 }}>
              That income more than offsets realized stock trading of{" "}
              <b className={s.realizedStock >= 0 ? "pos" : "neg"}>{usd(s.realizedStock, { sign: s.realizedStock > 0 })}</b>,
              plus <b className="pos">{usd(s.dividendsNet + s.interest, { sign: true })}</b> from dividends and interest.
            </p>
            <p style={{ margin: 0 }}>
              After <b className="neg">{usd(s.fees)}</b> in fees and margin costs, net realized return lands at{" "}
              <b className={s.totalRealizedReturn >= 0 ? "pos" : "neg"}>{usd(s.totalRealizedReturn, { sign: s.totalRealizedReturn > 0 })}</b>.
            </p>
          </div>
        </Card>
      </div>

      <div style={{ height: 16 }} />

      <Card title="Monthly income by source" subtitle="Stacked contribution of each source, month by month">
        <MonthlyIncomeChart data={monthly} height={360} />
      </Card>

      <div style={{ height: 16 }} />

      <Card title="Source detail">
        <table className="tbl">
          <thead>
            <tr>
              <th>Source</th>
              <th>Detail</th>
              <th>Net amount</th>
              <th>% of gross income</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="strong">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: r.color, display: "inline-block" }} />
                    {r.label}
                  </span>
                </td>
                <td className="muted" style={{ whiteSpace: "normal" }}>{r.note}</td>
                <td><Money value={r.value} bold /></td>
                <td className="tabnum">{r.value > 0 ? pct(r.value / (gross || 1)) : "—"}</td>
              </tr>
            ))}
            <tr>
              <td className="strong">Total realized return</td>
              <td className="muted"></td>
              <td className="strong"><Money value={s.totalRealizedReturn} bold /></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </>
  );
}
