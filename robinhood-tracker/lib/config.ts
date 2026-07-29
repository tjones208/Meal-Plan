// Supabase connection. The anon/publishable key is safe to expose to the browser
// (Row Level Security enforces per-user data access). Values can be overridden via
// environment variables at build time; otherwise the project defaults are used.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xmwozksnvzhxczczhzjd.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_WVRgWKc9NNd_ibYirc6gyw_KPblnLDZ";

// Single fixed owner tag for all transactions. There is no login; data is stored
// under this id and read back with it. (RLS on the table is open to anonymous.)
export const OWNER_ID =
  process.env.NEXT_PUBLIC_OWNER_ID || "be5e902f-99c7-4881-ad6b-f293e5157cbe";
