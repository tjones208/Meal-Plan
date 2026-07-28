"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataProvider } from "./DataProvider";

const NAV = [
  { href: "/", label: "Overview", icon: "◎" },
  { href: "/income", label: "Income Sources", icon: "⛁" },
  { href: "/stocks", label: "Stocks", icon: "▤" },
  { href: "/options", label: "Options", icon: "⤢" },
  { href: "/cashflow", label: "Cash Flow", icon: "⇅" },
  { href: "/transactions", label: "Transactions", icon: "☰" },
  { href: "/import", label: "Import Data", icon: "↥" },
];

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      style={{
        width: 236,
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
      className="rh-sidebar"
    >
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
          <Link key={n.href} href={n.href} className={`nav-link ${active ? "active" : ""}`}>
            <span className="nav-dot" />
            <span style={{ width: 18, textAlign: "center", opacity: 0.85 }}>{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <div className="rh-shell" style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main className="rh-main" style={{ flex: 1, minWidth: 0, padding: "28px clamp(16px, 3vw, 40px)", maxWidth: 1280 }}>
          {children}
        </main>
      </div>
    </DataProvider>
  );
}
