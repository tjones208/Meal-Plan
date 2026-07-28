"use client";

import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Txn } from "@/lib/analytics";

type DataState = {
  session: Session | null;
  authReady: boolean;
  txns: Txn[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

const Ctx = createContext<DataState | null>(null);

export function useData(): DataState {
  const c = useContext(Ctx);
  if (!c) throw new Error("useData must be used within DataProvider");
  return c;
}

async function fetchAllTxns(userId: string): Promise<Txn[]> {
  const out: Txn[] = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error } = await supabase
      .from("rh_transactions")
      .select("id, activity_date, process_date, settle_date, instrument, description, trans_code, quantity, price, amount")
      .eq("user_id", userId)
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
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setAuthReady(true);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const reload = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchAllTxns(session.user.id);
      setTxns(rows);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) reload();
    else setTxns([]);
  }, [session, reload]);

  const value = useMemo<DataState>(
    () => ({ session, authReady, txns, loading, error, reload }),
    [session, authReady, txns, loading, error, reload]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
