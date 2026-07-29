"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataProvider } from "./DataProvider";
import { DateRangePicker } from "./DateRangePicker";

const NAV = [
  { href: "/", label: "Overview", icon: "◎" },
  { href: "/pnl", label: "P&L Statement", icon: "▦" },
  { href: "/balance", label: "Balance Sheet", icon: "⚖" },
  { href: "/income", label: "Income Sources", icon: "⛁" },
  { href: "/stocks", label: "Stocks", icon: "▤" },
  { href: "/options", label: "Options", icon: "⤢" },
  { href: "/cashflow", label: "Cash Flow", icon: "⇅" },
  { href: "/transactions", label: "Transactions", icon: "☰" },
  { href: "/import", label: "Import Data", icon: "↥" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <aside className={`rh-sidebar ${open ? "open" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 18px" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "var(--good)",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            color: "#052e05",
          }}
        >
          ↑
        </div>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>Returns Tracker</div>
      </div>

      {NAV.map((n) => {
        const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
        return (
          <Link key={n.href} href={n.href} className={`nav-link ${active ? "active" : ""}`} onClick={onClose}>
            <span className="nav-dot" />
            <span style={{ width: 18, textAlign: "center", opacity: 0.85 }}>{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="rh-topbar">
      <button className="rh-hamburger" aria-label="Open menu" onClick={onMenu}>
        <span />
        <span />
        <span />
      </button>
      <div className="rh-topbar-title">Returns Tracker</div>
      <div style={{ marginLeft: "auto" }}>
        <DateRangePicker />
      </div>
    </header>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <DataProvider>
      <div className="rh-shell">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        {menuOpen && <div className="rh-overlay" onClick={() => setMenuOpen(false)} />}
        <div className="rh-main-wrap">
          <Topbar onMenu={() => setMenuOpen(true)} />
          <main className="rh-main">{children}</main>
        </div>
      </div>
    </DataProvider>
  );
}
