// ---------------------------------------------------------------------------
// Robinhood returns analytics engine
// Pure functions over a list of transactions. No React / Supabase here.
// ---------------------------------------------------------------------------

export type Txn = {
  id: string;
  activity_date: string | null;
  process_date: string | null;
  settle_date: string | null;
  instrument: string | null;
  description: string | null;
  trans_code: string | null;
  quantity: number | null;
  price: number | null;
  amount: number | null;
};

export type Category = "stock" | "option" | "dividend" | "interest" | "capital" | "fee" | "other";

export const CODE_CATEGORY: Record<string, Category> = {
  Buy: "stock",
  Sell: "stock",
  LCAP: "stock",
  STO: "option",
  BTC: "option",
  BTO: "option",
  STC: "option",
  OEXP: "option",
  OASGN: "option",
  OAREV: "option",
  CDIV: "dividend",
  MDIV: "dividend",
  DTAX: "dividend",
  INT: "interest",
  ACH: "capital",
  MINT: "fee",
  GOLD: "fee",
  DFEE: "fee",
  AFEE: "fee",
  GMPC: "fee",
  FUTSWP: "fee",
  CONV: "other",
  SLIP: "other",
  "T/A": "other",
};

export const CODE_LABEL: Record<string, string> = {
  Buy: "Buy shares",
  Sell: "Sell shares",
  STO: "Sell to open (option)",
  BTC: "Buy to close (option)",
  BTO: "Buy to open (option)",
  STC: "Sell to close (option)",
  OEXP: "Option expiration",
  OASGN: "Option assignment",
  OAREV: "Option assignment reversal",
  CDIV: "Cash dividend",
  MDIV: "Manufactured dividend",
  DTAX: "Dividend tax withheld",
  INT: "Interest earned",
  ACH: "Bank transfer",
  MINT: "Margin interest",
  GOLD: "Robinhood Gold fee",
  DFEE: "Fee",
  AFEE: "Account fee",
  GMPC: "Gold margin credit",
  FUTSWP: "Futures sweep",
  CONV: "Conversion",
  SLIP: "Adjustment",
  LCAP: "Long-term capital gain",
  "T/A": "Transfer adjustment",
};

export function categoryOf(code: string | null): Category {
  if (!code) return "other";
  return CODE_CATEGORY[code] ?? "other";
}

const A = (t: Txn) => t.amount ?? 0;
const Q = (t: Txn) => t.quantity ?? 0;
export const ym = (iso: string | null) => (iso ? iso.slice(0, 7) : "unknown");

// Robinhood exports carry only a date (no intraday time), so same-day rows can
// arrive in any order. FIFO cost-basis matching requires acquisitions to precede
// disposals, otherwise a same-day "sell before buy" matches against too few lots
// and books a bogus zero-cost-basis gain. Within a date we therefore order buys
// before sells (LCAP and non-trade rows fall in the middle; they don't affect FIFO).
function tradeRank(code: string | null): number {
  return code === "Buy" ? 0 : code === "Sell" ? 2 : 1;
}

function sortByDate(txns: Txn[]): Txn[] {
  return [...txns].sort((a, b) => {
    const da = a.activity_date ?? "";
    const db = b.activity_date ?? "";
    if (da < db) return -1;
    if (da > db) return 1;
    const r = tradeRank(a.trans_code) - tradeRank(b.trans_code);
    if (r !== 0) return r;
    return (a.id ?? "").localeCompare(b.id ?? "");
  });
}

// ---------------------------------------------------------------------------
// FIFO realized stock P&L
// Matches each Sell against prior Buys (first-in-first-out) per instrument.
// Assignments and exercises land in the feed as Buy / Sell rows, so they are
// naturally included. Returns per-instrument totals and per-sale events.
// ---------------------------------------------------------------------------
export type RealizedEvent = {
  date: string | null;
  month: string;
  instrument: string;
  quantity: number;
  proceeds: number;
  costBasis: number;
  gain: number;
};

export function realizedStock(txns: Txn[]): {
  byInstrument: Record<string, number>;
  events: RealizedEvent[];
  total: number;
} {
  const lots: Record<string, Array<[number, number]>> = {}; // instrument -> [qty, unitCost]
  const byInstrument: Record<string, number> = {};
  const events: RealizedEvent[] = [];

  for (const t of sortByDate(txns)) {
    const code = t.trans_code;
    const inst = t.instrument || "?";
    if (code === "Buy") {
      const qty = Q(t);
      const cost = Math.abs(A(t));
      if (qty > 0) {
        (lots[inst] ||= []).push([qty, cost / qty]);
      }
    } else if (code === "Sell") {
      const qty = Q(t);
      const proceeds = A(t);
      if (qty <= 0) continue;
      const unitP = proceeds / qty;
      let remaining = qty;
      let costBasis = 0;
      const dq = (lots[inst] ||= []);
      while (remaining > 1e-9 && dq.length) {
        const lot = dq[0];
        const take = Math.min(remaining, lot[0]);
        costBasis += take * lot[1];
        lot[0] -= take;
        remaining -= take;
        if (lot[0] <= 1e-9) dq.shift();
      }
      // If selling more than held (short / basis unknown), treat basis of the
      // uncovered portion as 0 so proceeds count as gain.
      const gain = proceeds - costBasis;
      byInstrument[inst] = (byInstrument[inst] || 0) + gain;
      events.push({
        date: t.activity_date,
        month: ym(t.activity_date),
        instrument: inst,
        quantity: qty,
        proceeds,
        costBasis,
        gain,
      });
    } else if (code === "LCAP") {
      byInstrument[inst] = (byInstrument[inst] || 0) + A(t);
      events.push({
        date: t.activity_date,
        month: ym(t.activity_date),
        instrument: inst,
        quantity: 0,
        proceeds: A(t),
        costBasis: 0,
        gain: A(t),
      });
    }
  }
  const total = Object.values(byInstrument).reduce((s, v) => s + v, 0);
  return { byInstrument, events, total };
}

// ---------------------------------------------------------------------------
// Top-line summary
// ---------------------------------------------------------------------------
export type Summary = {
  optionsNet: number;
  optionPremiumCollected: number;
  optionPremiumPaid: number;
  dividendsGross: number;
  dividendTax: number;
  dividendsNet: number;
  interest: number;
  fees: number;
  realizedStock: number;
  totalRealizedReturn: number;
  deposits: number;
  withdrawals: number;
  netContributions: number;
  totalReturnOnContributions: number | null;
  firstDate: string | null;
  lastDate: string | null;
  txnCount: number;
};

export function summarize(txns: Txn[]): Summary {
  let optionsNet = 0,
    optionPremiumCollected = 0,
    optionPremiumPaid = 0,
    dividendsGross = 0,
    dividendTax = 0,
    interest = 0,
    fees = 0,
    deposits = 0,
    withdrawals = 0;

  for (const t of txns) {
    const code = t.trans_code || "";
    const amt = A(t);
    switch (code) {
      case "STO":
      case "STC":
        optionsNet += amt;
        optionPremiumCollected += amt;
        break;
      case "BTC":
      case "BTO":
        optionsNet += amt;
        optionPremiumPaid += amt;
        break;
      case "CDIV":
      case "MDIV":
        dividendsGross += amt;
        break;
      case "DTAX":
        dividendTax += amt;
        break;
      case "INT":
        interest += amt;
        break;
      case "MINT":
      case "GOLD":
      case "DFEE":
      case "AFEE":
      case "GMPC":
      case "FUTSWP":
        fees += amt;
        break;
      case "ACH":
        if (amt >= 0) deposits += amt;
        else withdrawals += amt;
        break;
    }
  }

  const realizedStock = realizedStock_total(txns);
  const dividendsNet = dividendsGross + dividendTax;
  const totalRealizedReturn = optionsNet + dividendsGross + dividendTax + interest + fees + realizedStock;
  const netContributions = deposits + withdrawals;

  const dates = txns.map((t) => t.activity_date).filter(Boolean) as string[];
  dates.sort();

  return {
    optionsNet,
    optionPremiumCollected,
    optionPremiumPaid,
    dividendsGross,
    dividendTax,
    dividendsNet,
    interest,
    fees,
    realizedStock,
    totalRealizedReturn,
    deposits,
    withdrawals,
    netContributions,
    totalReturnOnContributions: netContributions !== 0 ? totalRealizedReturn / netContributions : null,
    firstDate: dates[0] ?? null,
    lastDate: dates[dates.length - 1] ?? null,
    txnCount: txns.length,
  };
}

function realizedStock_total(txns: Txn[]): number {
  return realizedStock(txns).total;
}

// ---------------------------------------------------------------------------
// Income-source breakdown (for pies / bars)
// ---------------------------------------------------------------------------
export type IncomeSource = { key: string; label: string; value: number };

export function incomeSources(s: Summary): IncomeSource[] {
  return [
    { key: "options", label: "Options premium", value: s.optionsNet },
    { key: "stock", label: "Realized stock P&L", value: s.realizedStock },
    { key: "dividends", label: "Dividends", value: s.dividendsNet },
    { key: "interest", label: "Interest", value: s.interest },
    { key: "fees", label: "Fees & margin", value: s.fees },
  ];
}

// ---------------------------------------------------------------------------
// Monthly time series of income by source
// ---------------------------------------------------------------------------
export type MonthlyRow = {
  month: string;
  options: number;
  stock: number;
  dividends: number;
  interest: number;
  fees: number;
  total: number;
};

export function monthlyIncome(txns: Txn[]): MonthlyRow[] {
  const map = new Map<string, MonthlyRow>();
  const get = (m: string) => {
    let r = map.get(m);
    if (!r) {
      r = { month: m, options: 0, stock: 0, dividends: 0, interest: 0, fees: 0, total: 0 };
      map.set(m, r);
    }
    return r;
  };

  for (const t of txns) {
    const code = t.trans_code || "";
    const m = ym(t.activity_date);
    const amt = A(t);
    const cat = categoryOf(code);
    if (code === "ACH") continue;
    if (cat === "option") get(m).options += amt;
    else if (cat === "dividend") get(m).dividends += amt;
    else if (cat === "interest") get(m).interest += amt;
    else if (cat === "fee") get(m).fees += amt;
  }

  // realized stock attributed to the month of each sale
  for (const e of realizedStock(txns).events) {
    get(e.month).stock += e.gain;
  }

  const rows = [...map.values()].filter((r) => r.month !== "unknown");
  for (const r of rows) r.total = r.options + r.stock + r.dividends + r.interest + r.fees;
  rows.sort((a, b) => (a.month < b.month ? -1 : 1));
  return rows;
}

export function cumulative(rows: MonthlyRow[]): Array<{ month: string; cumulative: number; monthly: number }> {
  let acc = 0;
  return rows.map((r) => {
    acc += r.total;
    return { month: r.month, cumulative: acc, monthly: r.total };
  });
}

// ---------------------------------------------------------------------------
// Per-instrument performance
// ---------------------------------------------------------------------------
export type InstrumentRow = {
  instrument: string;
  optionsNet: number;
  realizedStock: number;
  dividends: number;
  total: number;
  openShares: number;
  txns: number;
};

export function perInstrument(txns: Txn[]): InstrumentRow[] {
  const realized = realizedStock(txns).byInstrument;
  const map = new Map<string, InstrumentRow>();
  const get = (i: string) => {
    let r = map.get(i);
    if (!r) {
      r = { instrument: i, optionsNet: 0, realizedStock: 0, dividends: 0, total: 0, openShares: 0, txns: 0 };
      map.set(i, r);
    }
    return r;
  };

  for (const t of txns) {
    const inst = (t.instrument || "").trim();
    if (!inst) continue;
    const code = t.trans_code || "";
    const amt = A(t);
    const r = get(inst);
    r.txns++;
    const cat = categoryOf(code);
    if (cat === "option") r.optionsNet += amt;
    else if (cat === "dividend") r.dividends += amt;
    if (code === "Buy") r.openShares += Q(t);
    else if (code === "Sell") r.openShares -= Q(t);
  }

  for (const [inst, gain] of Object.entries(realized)) {
    get(inst).realizedStock += gain;
  }

  const rows = [...map.values()];
  for (const r of rows) {
    r.total = r.optionsNet + r.realizedStock + r.dividends;
    if (Math.abs(r.openShares) < 1e-6) r.openShares = 0;
  }
  rows.sort((a, b) => b.total - a.total);
  return rows;
}

// ---------------------------------------------------------------------------
// Options analytics
// ---------------------------------------------------------------------------
export type OptionType = "call" | "put" | "unknown";

export function optionType(desc: string | null): OptionType {
  if (!desc) return "unknown";
  if (/\bCall\b/i.test(desc)) return "call";
  if (/\bPut\b/i.test(desc)) return "put";
  return "unknown";
}

export type OptionsAnalytics = {
  premiumCollected: number; // STO + STC credits
  premiumPaid: number; // BTC + BTO debits (negative)
  net: number;
  contractsOpened: number; // STO + BTO quantity
  contractsSTO: number;
  contractsExpired: number; // OEXP quantity
  contractsAssigned: number; // OASGN quantity
  contractsBoughtToClose: number; // BTC quantity
  expirationRate: number | null; // expired / (expired + assigned + bought-to-close)
  callPremium: number;
  putPremium: number;
  byTicker: Array<{ instrument: string; net: number; collected: number; paid: number; contracts: number }>;
  monthly: Array<{ month: string; net: number }>;
};

export function optionsAnalytics(txns: Txn[]): OptionsAnalytics {
  let premiumCollected = 0,
    premiumPaid = 0,
    contractsSTO = 0,
    contractsBTO = 0,
    contractsExpired = 0,
    contractsAssigned = 0,
    contractsBoughtToClose = 0,
    callPremium = 0,
    putPremium = 0;

  const tickerMap = new Map<string, { net: number; collected: number; paid: number; contracts: number }>();
  const monthMap = new Map<string, number>();
  const tGet = (i: string) => {
    let r = tickerMap.get(i);
    if (!r) {
      r = { net: 0, collected: 0, paid: 0, contracts: 0 };
      tickerMap.set(i, r);
    }
    return r;
  };

  for (const t of txns) {
    const code = t.trans_code || "";
    if (categoryOf(code) !== "option") continue;
    const amt = A(t);
    const qty = Q(t);
    const inst = (t.instrument || "?").trim();
    const ot = optionType(t.description);

    if (code === "STO" || code === "STC") {
      premiumCollected += amt;
      tGet(inst).collected += amt;
      if (ot === "call") callPremium += amt;
      else if (ot === "put") putPremium += amt;
    } else if (code === "BTC" || code === "BTO") {
      premiumPaid += amt;
      tGet(inst).paid += amt;
      if (ot === "call") callPremium += amt;
      else if (ot === "put") putPremium += amt;
    }

    if (code === "STO") contractsSTO += qty;
    if (code === "BTO") contractsBTO += qty;
    if (code === "OEXP") contractsExpired += qty;
    if (code === "OASGN") contractsAssigned += qty;
    if (code === "BTC") contractsBoughtToClose += qty;

    if (amt !== 0) {
      tGet(inst).net += amt;
      monthMap.set(ym(t.activity_date), (monthMap.get(ym(t.activity_date)) || 0) + amt);
    }
  }

  for (const [, r] of tickerMap) r.contracts = 0;
  // contracts per ticker = STO+BTO opened
  for (const t of txns) {
    const code = t.trans_code || "";
    if (code === "STO" || code === "BTO") {
      const inst = (t.instrument || "?").trim();
      tGet(inst).contracts += Q(t);
    }
  }

  const byTicker = [...tickerMap.entries()]
    .map(([instrument, v]) => ({ instrument, ...v }))
    .filter((r) => Math.abs(r.net) > 1e-6 || r.contracts > 0)
    .sort((a, b) => b.net - a.net);

  const monthly = [...monthMap.entries()]
    .filter(([m]) => m !== "unknown")
    .map(([month, net]) => ({ month, net }))
    .sort((a, b) => (a.month < b.month ? -1 : 1));

  const outcomes = contractsExpired + contractsAssigned + contractsBoughtToClose;

  return {
    premiumCollected,
    premiumPaid,
    net: premiumCollected + premiumPaid,
    contractsOpened: contractsSTO + contractsBTO,
    contractsSTO,
    contractsExpired,
    contractsAssigned,
    contractsBoughtToClose,
    expirationRate: outcomes > 0 ? contractsExpired / outcomes : null,
    callPremium,
    putPremium,
    byTicker,
    monthly,
  };
}

// ---------------------------------------------------------------------------
// Capital flows (contributions & distributions)
// ---------------------------------------------------------------------------
export type CashFlowRow = { date: string | null; month: string; amount: number };
export function capitalFlows(txns: Txn[]): {
  events: CashFlowRow[];
  monthly: Array<{ month: string; deposits: number; withdrawals: number; net: number }>;
  cumulative: Array<{ month: string; netInvested: number }>;
} {
  const events: CashFlowRow[] = [];
  const monthMap = new Map<string, { deposits: number; withdrawals: number }>();
  for (const t of txns) {
    if (t.trans_code !== "ACH") continue;
    const amt = A(t);
    events.push({ date: t.activity_date, month: ym(t.activity_date), amount: amt });
    const m = ym(t.activity_date);
    const r = monthMap.get(m) || { deposits: 0, withdrawals: 0 };
    if (amt >= 0) r.deposits += amt;
    else r.withdrawals += amt;
    monthMap.set(m, r);
  }
  const monthly = [...monthMap.entries()]
    .filter(([m]) => m !== "unknown")
    .map(([month, v]) => ({ month, deposits: v.deposits, withdrawals: v.withdrawals, net: v.deposits + v.withdrawals }))
    .sort((a, b) => (a.month < b.month ? -1 : 1));
  let acc = 0;
  const cumulative = monthly.map((r) => {
    acc += r.net;
    return { month: r.month, netInvested: acc };
  });
  events.sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));
  return { events, monthly, cumulative };
}
