"use client";

import React from "react";
import { usd } from "@/lib/format";

export const PALETTE = [
  "#3987e5", // blue
  "#d95926", // orange
  "#199e70", // aqua
  "#c98500", // yellow
  "#d55181", // magenta
  "#9085e9", // violet
  "#008300", // green
  "#e66767", // red
];

export const COLORS = {
  good: "#0ca30c",
  goodText: "#2fd06f",
  critical: "#d03b3b",
  criticalText: "#f0736f",
  grid: "#2c2c2a",
  baseline: "#383835",
  muted: "#898781",
  text: "#c3c2b7",
  surface: "#1a1a19",
  options: "#3987e5",
  stock: "#d95926",
  dividends: "#199e70",
  interest: "#9085e9",
  fees: "#e66767",
};

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{title}</h1>
      {subtitle && (
        <p className="muted" style={{ margin: "6px 0 0", fontSize: 13.5 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function signClass(n: number): string {
  return n > 0 ? "pos" : n < 0 ? "neg" : "";
}

export function Kpi({
  label,
  value,
  sub,
  tone,
  accent,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  tone?: "pos" | "neg" | "neutral";
  accent?: string;
}) {
  const valueClass = tone === "pos" ? "pos" : tone === "neg" ? "neg" : "";
  return (
    <div className="card card-tight" style={{ borderTop: accent ? `2px solid ${accent}` : undefined }}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value tabnum ${valueClass}`}>{value}</div>
      {sub != null && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export function Grid({ children, min = 220, gap = 14 }: { children: React.ReactNode; min?: number; gap?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  children,
  right,
  style,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="card" style={style}>
      {(title || right) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
          <div>
            {title && <div className="section-title">{title}</div>}
            {subtitle && <div className="card-sub">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function DeltaBadge({ value }: { value: number }) {
  const cls = value > 0 ? "pos" : value < 0 ? "neg" : "muted";
  const arrow = value > 0 ? "▲" : value < 0 ? "▼" : "•";
  return (
    <span className={`${cls} tabnum`} style={{ fontSize: 13, fontWeight: 600 }}>
      {arrow} {usd(Math.abs(value))}
    </span>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div className="muted" style={{ fontSize: 13.5, maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}

export function Money({ value, bold }: { value: number; bold?: boolean }) {
  return (
    <span className={`tabnum ${signClass(value)}`} style={{ fontWeight: bold ? 600 : undefined }}>
      {usd(value, { sign: value > 0 })}
    </span>
  );
}

export function Loading() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
      <div className="muted">Loading transactions…</div>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="card" style={{ borderColor: "rgba(208,59,59,0.4)" }}>
      <div className="section-title neg">Couldn&apos;t load your data</div>
      <div className="muted" style={{ marginTop: 6, fontSize: 13.5 }}>{message}</div>
    </div>
  );
}

export function NeedImport() {
  return (
    <div className="card" style={{ textAlign: "center", padding: "56px 24px" }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>↥</div>
      <div style={{ fontSize: 17, fontWeight: 650, marginBottom: 8 }}>No transactions yet</div>
      <div className="muted" style={{ fontSize: 14, maxWidth: 440, margin: "0 auto 20px", lineHeight: 1.6 }}>
        Load your Robinhood account activity to see returns, income sources, and per-stock
        performance.
      </div>
      <a href="/import" className="btn btn-primary">
        Go to Import
      </a>
    </div>
  );
}
