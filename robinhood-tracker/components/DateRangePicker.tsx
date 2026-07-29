"use client";

import { useMemo, useState, useEffect } from "react";
import { useData } from "./DataProvider";
import { monthLabel } from "@/lib/format";
import type { DateRange } from "@/lib/analytics";

const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const lastDay = (y: number, m1: number) => new Date(y, m1, 0).getDate(); // m1 = 1-based month

function monthRange(ym: string): DateRange {
  const [y, m] = ym.split("-").map(Number);
  return { start: `${y}-${pad(m)}-01`, end: `${y}-${pad(m)}-${pad(lastDay(y, m))}` };
}

function encode(r: DateRange): string {
  if (!r.start && !r.end) return "all";
  // exact single-month?
  if (r.start && r.end && r.start.endsWith("-01")) {
    const ym = r.start.slice(0, 7);
    if (r.end === monthRange(ym).end) return `m:${ym}`;
  }
  return "custom";
}

export function DateRangePicker() {
  const { txns, range, setRange } = useData();
  const [showCustom, setShowCustom] = useState(false);

  const months = useMemo(() => {
    const set = new Set<string>();
    for (const t of txns) if (t.activity_date) set.add(t.activity_date.slice(0, 7));
    return [...set].sort((a, b) => (a < b ? 1 : -1)); // newest first
  }, [txns]);

  const sel = encode(range);
  useEffect(() => {
    if (sel === "custom") setShowCustom(true);
  }, [sel]);

  function onSelect(v: string) {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    if (v === "all") {
      setShowCustom(false);
      setRange({ start: null, end: null });
    } else if (v === "ytd") {
      setShowCustom(false);
      setRange({ start: `${y}-01-01`, end: null });
    } else if (v === "thismonth") {
      setShowCustom(false);
      setRange(monthRange(`${y}-${pad(m)}`));
    } else if (v === "lastmonth") {
      setShowCustom(false);
      const d = new Date(y, m - 2, 1);
      setRange(monthRange(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`));
    } else if (v === "3m" || v === "6m" || v === "12m") {
      setShowCustom(false);
      const n = v === "3m" ? 3 : v === "6m" ? 6 : 12;
      const d = new Date(now);
      d.setMonth(d.getMonth() - n);
      setRange({ start: isoOf(d), end: null });
    } else if (v === "custom") {
      setShowCustom(true);
      if (!range.start && !range.end) {
        setRange({ start: `${y}-01-01`, end: isoOf(now) });
      }
    } else if (v.startsWith("m:")) {
      setShowCustom(false);
      setRange(monthRange(v.slice(2)));
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Period</span>
      <select className="rh-select" value={sel} onChange={(e) => onSelect(e.target.value)}>
        <option value="all">All time</option>
        <option value="ytd">Year to date</option>
        <option value="thismonth">This month</option>
        <option value="lastmonth">Last month</option>
        <option value="3m">Last 3 months</option>
        <option value="6m">Last 6 months</option>
        <option value="12m">Last 12 months</option>
        <option value="custom">Custom range…</option>
        {months.length > 0 && (
          <optgroup label="By month">
            {months.map((ym) => (
              <option key={ym} value={`m:${ym}`}>
                {monthLabel(ym)}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      {showCustom && (
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="date"
            className="rh-select"
            value={range.start ?? ""}
            onChange={(e) => setRange({ ...range, start: e.target.value || null })}
          />
          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>–</span>
          <input
            type="date"
            className="rh-select"
            value={range.end ?? ""}
            onChange={(e) => setRange({ ...range, end: e.target.value || null })}
          />
        </span>
      )}
    </div>
  );
}
