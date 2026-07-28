# Robinhood Returns Tracker

A private dashboard for analyzing Robinhood transaction history — returns, capital
contributions & distributions, per-stock performance, and what's actually driving
performance (options premium, dividends, interest, and realized stock gains).

Built with **Next.js** (App Router) + **Supabase** (Postgres + Auth) and deployed on
**Vercel**.

## What it shows

- **Overview** — total realized return, net contributions, return on capital, and the
  income drivers at a glance; cumulative return, income-source mix, and monthly income.
- **Income Sources** — every dollar of realized performance categorized: options
  premium, realized stock P&L (FIFO), dividends, interest, and fees, with a monthly
  stacked breakdown.
- **Stocks** — per-ticker performance combining options premium, FIFO realized stock
  P&L, and dividends, plus open share positions. Sortable and filterable.
- **Options** — premium collected vs. paid to close, contract outcomes (expired /
  assigned / bought-to-close), calls vs. puts, monthly income, and premium by underlying.
- **Cash Flow** — contributions vs. distributions over time and full transfer history.
- **Transactions** — the full, searchable, filterable activity ledger.
- **Import** — one-click load of the bundled export, plus drag-and-drop CSV upload to
  refresh with newer Robinhood exports. Re-imports are de-duplicated automatically.

## How returns are calculated

All figures are **realized** and derived directly from account activity:

- **Options premium (net)** = credits from `STO`/`STC` minus debits from `BTC`/`BTO`.
- **Realized stock P&L** = FIFO cost-basis matching of `Buy`/`Sell` rows (option
  assignments settle as share transactions and are included).
- **Dividends** = `CDIV` + `MDIV`, net of `DTAX` withholding.
- **Interest** = `INT`. **Fees** = Gold, margin interest, and regulatory fees.
- **Net contributions** = `ACH` deposits minus withdrawals.

To include unrealized gains from open positions, enter your current account value on the
Overview page — total return is then `current value − net contributions`.

## Architecture

- Transactions live in Supabase Postgres (`public.rh_transactions`) with **row-level
  security** so only the signed-in user can read their own rows.
- Auth is Supabase email/password; the anon key is public by design (RLS enforces access).
- All analytics are computed client-side from the transaction set in `lib/analytics.ts`
  (pure, unit-checkable functions).

## Local development

```bash
npm install
npm run dev
```

Optionally override the Supabase connection via environment variables (defaults point at
the provisioned project):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Deploy

Deploys to Vercel as a standard Next.js app (root directory: `robinhood-tracker`).
