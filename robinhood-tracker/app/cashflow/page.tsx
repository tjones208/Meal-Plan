"use client";

import { useMemo } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Card, Loading, ErrorCard, NeedImport, Money, Grid, Kpi, COLORS } from "@/components/ui";
import { ContributionChart } from "@/components/charts";
import { capitalFlows, summarize } from "@/lib/analytics";
import { usd, shortDate, num } from "@/lib/format";

export default function CashFlowPage() {
  const { txns, loading, error } = useData();
  const s = useMemo(() => summarize(txns), [txns]);
  const cf = useMemo(() => capitalFlows(txns), [txns]);

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length) return <Loading />;
  if (!txns.length) return <NeedImport />;

  // merge monthly + cumulative for the chart
  const chartData = cf.monthly.map((m) => {
    const cum = cf.cumulative.find((c) => c.month === m.month);
    return { month: m.month, deposits: m.deposits, withdrawals: m.withdrawals, netInvested: cum?.netInvested ?? 0 };
  });

  const depositCount = cf.events.filter((e) => e.amount > 0).length;
  const withdrawalCount = cf.events.filter((e) => e.amount < 0).length;

  return (
    <>
      <PageHeader
        title="Capital Contributions & Distributions"
        subtitle="Money you've moved in and out — the base your returns are measured against"
      />

      <Grid min={210}>
        <Kpi label="Total contributed" value={usd(s.deposits)} tone="pos" accent={COLORS.good} sub={`${num(depositCount)} deposits`} />
        <Kpi label="Total distributed" value={usd(s.withdrawals)} tone="neg" accent={COLORS.critical} sub={`${num(withdrawalCount)} withdrawals`} />
        <Kpi label="Net invested" value={usd(s.netContributions)} accent={COLORS.options} sub="Contributions − distributions" />
        <Kpi
          label="Realized return on capital"
          value={s.totalReturnOnContributions != null ? `${(s.totalReturnOnContributions * 100).toFixed(0)}%` : "—"}
          tone={(s.totalReturnOnContributions ?? 0) >= 0 ? "pos" : "neg"}
          accent={COLORS.dividends}
        />
      </Grid>

      <div style={{ height: 20 }} />

      <Card title="Contributions & distributions over time" subtitle="Monthly deposits (green) and withdrawals (red) with cumulative net invested (line)">
        <ContributionChart data={chartData} height={340} />
      </Card>

      <div style={{ height: 16 }} />

      <Card title="Transfer history" subtitle={`${cf.events.length} bank transfers`}>
        <div style={{ overflowX: "auto", maxHeight: 460, overflowY: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {cf.events.map((e, i) => (
                <tr key={i}>
                  <td className="strong">{shortDate(e.date)}</td>
                  <td>
                    <span className="pill" style={{ color: e.amount >= 0 ? COLORS.goodText : COLORS.criticalText }}>
                      {e.amount >= 0 ? "Contribution" : "Distribution"}
                    </span>
                  </td>
                  <td><Money value={e.amount} bold /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
