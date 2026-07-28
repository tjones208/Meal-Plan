import Papa from "papaparse";

export type ParsedTxn = {
  activity_date: string | null;
  process_date: string | null;
  settle_date: string | null;
  instrument: string | null;
  description: string | null;
  trans_code: string | null;
  quantity: number | null;
  price: number | null;
  amount: number | null;
  row_hash: string;
  source_file: string;
};

export function parseAmount(s: string | null | undefined): number | null {
  if (s == null) return null;
  let t = String(s).trim();
  if (!t) return null;
  const neg = t.startsWith("(");
  t = t.replace(/[(),$%]/g, "").trim();
  if (!t) return null;
  const v = Number(t);
  if (Number.isNaN(v)) return null;
  return neg ? -v : v;
}

export function parseDate(s: string | null | undefined): string | null {
  if (!s) return null;
  const t = String(s).trim();
  if (!t) return null;
  const parts = t.split("/");
  if (parts.length !== 3) return null;
  const [m, d, y] = parts.map((p) => parseInt(p, 10));
  if (!m || !d || !y) return null;
  return `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-${d
    .toString()
    .padStart(2, "0")}`;
}

// Stable non-cryptographic hash (FNV-1a 32-bit) rendered as hex.
function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

const COL = {
  activity: ["Activity Date", "activity date"],
  process: ["Process Date", "process date"],
  settle: ["Settle Date", "settle date"],
  instrument: ["Instrument", "instrument"],
  description: ["Description", "description"],
  code: ["Trans Code", "trans code"],
  quantity: ["Quantity", "quantity"],
  price: ["Price", "price"],
  amount: ["Amount", "amount"],
};

function pick(row: Record<string, string>, keys: string[]): string {
  for (const k of keys) {
    if (row[k] != null) return row[k];
  }
  // case-insensitive fallback
  const lower = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase().trim(), v]));
  for (const k of keys) {
    const v = lower[k.toLowerCase().trim()];
    if (v != null) return v;
  }
  return "";
}

/** Parse a Robinhood transactions CSV string into insert-ready rows. */
export function parseRobinhoodCsv(csvText: string, sourceFile: string): ParsedTxn[] {
  const res = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: "greedy",
  });
  const rows = res.data || [];
  const seen = new Map<string, number>();
  const out: ParsedTxn[] = [];

  for (const r of rows) {
    const activity = pick(r, COL.activity).trim();
    const process = pick(r, COL.process).trim();
    const settle = pick(r, COL.settle).trim();
    const instrument = pick(r, COL.instrument).trim();
    const description = pick(r, COL.description).trim();
    const code = pick(r, COL.code).trim();
    const quantity = pick(r, COL.quantity);
    const price = pick(r, COL.price);
    const amount = pick(r, COL.amount);

    // Skip fully blank rows
    if (!activity && !code && !instrument && !description && !amount) continue;

    const key = [activity, code, instrument, description, quantity, price, amount].join("|");
    const occ = seen.get(key) ?? 0;
    seen.set(key, occ + 1);

    out.push({
      activity_date: parseDate(activity),
      process_date: parseDate(process),
      settle_date: parseDate(settle),
      instrument: instrument || null,
      description: description || null,
      trans_code: code || null,
      quantity: parseAmount(quantity),
      price: parseAmount(price),
      amount: parseAmount(amount),
      row_hash: fnv1a(`${key}|${occ}`),
      source_file: sourceFile,
    });
  }
  return out;
}
