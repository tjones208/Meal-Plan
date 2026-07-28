"use client";

import { useMemo } from "react";
import { useData } from "@/components/DataProvider";
import { PageHeader, Card, Loading, ErrorCard, NeedImport, Money, Grid, Kpi, COLORS } from "@/components/ui";
import { HBar, Donut } from "@/components/charts";
import { optionsAnalytics } from "@/lib/analytics";
import { usd, num, pct, monthLabel } from "@/lib/format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function OptionsPage() {
  const { txns, loading, error } = useData();
  const o = useMemo(() => optionsAnalytics(txns), [txns]);

  if (error) return <ErrorCard message={error} />;
  if (loading && !txns.length) return <Loading />;
  if (!txns.length) return <NeedImport />;

  const outcomeData = [
    { name: "Expired worthless", value: o.contractsExpired, color: COLORS.good },
    { name: "Bought to close", value: o.contractsBoughtToClose, color: COLORS.options },
    { name: "Assigned", value: o.contractsAssigned, color: COLORS.stock },
  ].filter((d) => d.value > 0);

  const tickerBars = o.byTicker.slice(0, 12).map((t) => ({ label: t.instrument, value: t.net }));

  return (
    <>
      <PageHeader
        title="Options Analytics"
        subtitle="Premium selling is the core strategy here — this is where it's working (and where it isn't)"
      />

      <Grid min={200}>
        <Kpi label="Net options income" value={usd(o.net, { sign: o.net > 0 })} tone={o.net >= 0 ? "pos" : "neg"} accent={COLORS.good} />
        <Kpi label="Premium collected" value={usd(o.premiumCollected, { sign: true })} tone="pos" accent={COLORS.options} sub="From selling to open / close" />
        <Kpi label="Paid to close" value={usd(o.premiumPaid)} tone="neg" accent={COLORS.stock} sub="Buying back positions" />
        <Kpi
          label="Expiration rate"
          value={o.expirationRate != null ? pct(o.expirationRate) : "—"}
          accent={COLORS.dividends}
          sub="Contracts expiring worthless (kept premium)"
        />
      </Grid>

      <div style={{ height: 20 }} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }} className="rh-two-col">
        <Card title="Contract outcomes" subtitle="How your options positions resolved (by contract count)">
          <Donut data={outcomeData} />
          <p className="muted" style={{ fontSize: 11.5, marginTop: 10, lineHeight: 1.5 }}>
            Expired worthless = full premium kept. Assigned = shares put to / called from you (normal in a
            wheel strategy). Bought to close = exited early.
          </p>
        </Card>
        <Card title="Calls vs puts" subtitle="Net premium by option type">
          <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 8 }}>
            <PremiumBar label="Calls" value={o.callPremium} max={Math.max(Math.abs(o.callPremium), Math.abs(o.putPremium))} color={COLORS.options} />
            <PremiumBar label="Puts" value={o.putPremium} max={Math.max(Math.abs(o.callPremium), Math.abs(o.putPremium))} color={COLORS.dividends} />
            <div style={{ display: "flex", gap: 28, marginTop: 6 }}>
              <Stat label="Contracts sold to open" value={num(o.contractsSTO)} />
              <Stat label="Total opened" value={num(o.contractsOpened)} />
              <Stat label="Bought to close" value={num(o.contractsBoughtToClose)} />
            </div>
          </div>
        </Card>
      </div>

      <div style={{ height: 16 }} />

      <Card title="Net options income by month" subtitle="Premium collected minus cost to close, per month">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={o.monthly} margin={{ top: 8, right: 6, left: 6, bottom: 0 }}>
            <CartesianGrid stroke={COLORS.grid} vertical={false} />
            <XAxis dataKey="month" tickFormatter={monthLabel} stroke={COLORS.muted} fontSize={11} tickLine={false} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tickFormatter={(v) => usd(v, { cents: false })} stroke={COLORS.muted} fontSize={11} tickLine={false} width={56} />
            <ReferenceLine y={0} stroke={COLORS.baseline} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const v = Number(payload[0].value);
                return (
                  <div style={{ background: COLORS.surface, border: "1px solid rgba(255,255,255,0.16)", borderRadius: 10, padding: "9px 12px", fontSize: 12.5 }}>
                    <div style={{ color: "#fff", fontWeight: 600 }}>{monthLabel(String(label))}</div>
                    <div className="tabnum" style={{ color: v < 0 ? COLORS.criticalText : COLORS.goodText }}>{usd(v, { sign: v > 0 })}</div>
                  </div>
                );
              }}
            />
            <Bar dataKey="net" radius={[2, 2, 0, 0]} maxBarSize={26} fill={COLORS.options} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ height: 16 }} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }} className="rh-two-col">
        <Card title="Net premium by underlying" subtitle="Top 12 tickers by net options income">
          <HBar data={tickerBars} height={360} colorBySign />
        </Card>
        <Card title="Options P&L by ticker">
          <div style={{ overflowX: "auto", maxHeight: 380, overflowY: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Contracts</th>
                  <th>Collected</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {o.byTicker.map((t) => (
                  <tr key={t.instrument}>
                    <td className="strong">{t.instrument}</td>
                    <td className="tabnum">{num(t.contracts)}</td>
                    <td><Money value={t.collected} /></td>
                    <td className="strong"><Money value={t.net} bold /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

function PremiumBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const w = max > 0 ? (Math.abs(value) / max) * 100 : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
        <span style={{ color: COLORS.text }}>{label}</span>
        <span className="tabnum" style={{ color: value < 0 ? COLORS.criticalText : "#fff" }}>{usd(value, { sign: value > 0 })}</span>
      </div>
      <div style={{ height: 10, background: COLORS.grid, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${w}%`, height: "100%", background: value < 0 ? COLORS.critical : color, borderRadius: 6 }} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="kpi-label" style={{ fontSize: 11.5 }}>{label}</div>
      <div className="tabnum" style={{ fontSize: 18, fontWeight: 650, marginTop: 2 }}>{value}</div>
    </div>
  );
}
