"use client";

import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { OWNER_ID } from "@/lib/config";
import type { Txn, DateRange } from "@/lib/analytics";
import { ALL_TIME } from "@/lib/analytics";

type DataState = {
  txns: Txn[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  range: DateRange;
  setRange: (r: DateRange) => void;
};

const Ctx = createContext<DataState | null>(null);

export function useData(): DataState {
  const c = useContext(Ctx);
  if (!c) throw new Error("useData must be used within DataProvider");
  return c;
}

async function fetchAllTxns(): Promise<Txn[]> {
  const out: Txn[] = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error } = await supabase
      .from("rh_transactions")
      .select("id, activity_date, process_date, settle_date, instrument, description, trans_code, quantity, price, amount")
      .eq("user_id", OWNER_ID)
      .order("activity_date", { ascending: true })
      .range(from, from + page - 1);
    if (error) throw error;
    const rows = (data ?? []) as Txn[];
    out.push(...rows);
    if (rows.length < page) break;
  }
  return out;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [txns, setTxns] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<DateRange>(ALL_TIME);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchAllTxns();
      setTxns(rows);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<DataState>(
    () => ({ txns, loading, error, reload, range, setRange }),
    [txns, loading, error, reload, range]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
