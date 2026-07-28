"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Area,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { COLORS, PALETTE } from "./ui";
import { compactUsd, usd, monthLabel } from "@/lib/format";

const axis = { stroke: COLORS.muted, fontSize: 11, tickLine: false };
const gridProps = { stroke: COLORS.grid, strokeDasharray: "0", vertical: false };

function TipBox({ label, rows }: { label?: string; rows: Array<{ name: string; value: number; color: string }> }) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: 10,
        padding: "10px 12px",
        fontSize: 12.5,
        minWidth: 150,
      }}
    >
      {label && <div style={{ color: "#fff", fontWeight: 600, marginBottom: 6 }}>{label}</div>}
      {rows.map((r) => (
        <div key={r.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: COLORS.text }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color, display: "inline-block" }} />
            {r.name}
          </span>
          <span className="tabnum" style={{ color: r.value < 0 ? COLORS.criticalText : "#fff" }}>
            {usd(r.value, { sign: r.value > 0 })}
          </span>
        </div>
      ))}
    </div>
  );
}

const INCOME_SERIES = [
  { key: "options", name: "Options premium", color: COLORS.options },
  { key: "stock", name: "Realized stock P&L", color: COLORS.stock },
  { key: "dividends", name: "Dividends", color: COLORS.dividends },
  { key: "interest", name: "Interest", color: COLORS.interest },
  { key: "fees", name: "Fees & margin", color: COLORS.fees },
];

type MonthlyDatum = {
  month: string;
  options: number;
  stock: number;
  dividends: number;
  interest: number;
  fees: number;
  total: number;
};

export function MonthlyIncomeChart({ data, height = 320 }: { data: MonthlyDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 6, left: 6, bottom: 0 }} stackOffset="sign">
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tickFormatter={compactUsd} {...axis} width={52} />
        <ReferenceLine y={0} stroke={COLORS.baseline} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          content={({ active, payload, label }) => {
            if (!active || !payload) return null;
            const rows = INCOME_SERIES.map((s) => ({
              name: s.name,
              color: s.color,
              value: Number(payload.find((p) => p.dataKey === s.key)?.value ?? 0),
            })).filter((r) => Math.abs(r.value) > 0.005);
            return <TipBox label={monthLabel(String(label))} rows={rows} />;
          }}
        />
        {INCOME_SERIES.map((s) => (
          <Bar key={s.key} dataKey={s.key} stackId="a" fill={s.color} radius={[2, 2, 0, 0]} maxBarSize={26} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CumulativeChart({
  data,
  height = 300,
}: {
  data: Array<{ month: string; cumulative: number; monthly: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 6, left: 6, bottom: 0 }}>
        <defs>
          <linearGradient id="cumFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.good} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLORS.good} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tickFormatter={compactUsd} {...axis} width={52} />
        <ReferenceLine y={0} stroke={COLORS.baseline} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload || !payload.length) return null;
            const d = payload[0].payload as { cumulative: number; monthly: number };
            return (
              <TipBox
                label={monthLabel(String(label))}
                rows={[
                  { name: "Cumulative", color: COLORS.goodText, value: d.cumulative },
                  { name: "This month", color: COLORS.options, value: d.monthly },
                ]}
              />
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke={COLORS.good}
          strokeWidth={2}
          fill="url(#cumFill)"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function HBar({
  data,
  height = 320,
  colorBySign = true,
  color = COLORS.options,
}: {
  data: Array<{ label: string; value: number }>;
  height?: number;
  colorBySign?: boolean;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 6, bottom: 0 }}>
        <CartesianGrid stroke={COLORS.grid} horizontal={false} />
        <XAxis type="number" tickFormatter={compactUsd} {...axis} />
        <YAxis type="category" dataKey="label" {...axis} width={64} />
        <ReferenceLine x={0} stroke={COLORS.baseline} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;
            const d = payload[0].payload as { label: string; value: number };
            return <TipBox rows={[{ name: d.label, color: d.value < 0 ? COLORS.critical : color, value: d.value }]} />;
          }}
        />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={30}>
          {data.map((d, i) => (
            <Cell key={i} fill={colorBySign ? (d.value < 0 ? COLORS.critical : COLORS.good) : PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({
  data,
  height = 260,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <ResponsiveContainer width={height} height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={height * 0.28}
            outerRadius={height * 0.42}
            paddingAngle={2}
            stroke={COLORS.surface}
            strokeWidth={2}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const d = payload[0].payload as { name: string; value: number; color: string };
              return <TipBox rows={[{ name: d.name, color: d.color, value: d.value }]} />;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((d) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: COLORS.text }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
              {d.name}
            </span>
            <span className="tabnum" style={{ fontSize: 13, color: "#fff" }}>
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContributionChart({
  data,
  height = 300,
}: {
  data: Array<{ month: string; deposits: number; withdrawals: number; netInvested: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 6, left: 6, bottom: 0 }} stackOffset="sign">
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tickFormatter={compactUsd} {...axis} width={52} />
        <ReferenceLine y={0} stroke={COLORS.baseline} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          content={({ active, payload, label }) => {
            if (!active || !payload || !payload.length) return null;
            const d = payload[0].payload as { deposits: number; withdrawals: number; netInvested: number };
            return (
              <TipBox
                label={monthLabel(String(label))}
                rows={[
                  { name: "Deposits", color: COLORS.good, value: d.deposits },
                  { name: "Withdrawals", color: COLORS.critical, value: d.withdrawals },
                  { name: "Net invested", color: COLORS.options, value: d.netInvested },
                ]}
              />
            );
          }}
        />
        <Bar dataKey="deposits" stackId="a" fill={COLORS.good} radius={[2, 2, 0, 0]} maxBarSize={26} />
        <Bar dataKey="withdrawals" stackId="a" fill={COLORS.critical} radius={[2, 2, 0, 0]} maxBarSize={26} />
        <Line type="monotone" dataKey="netInvested" stroke={COLORS.options} strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
