// Supabase connection. The anon/publishable key is safe to expose to the browser
// (Row Level Security enforces per-user data access). Values can be overridden via
// environment variables at build time; otherwise the project defaults are used.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xmwozksnvzhxczczhzjd.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtd296a3NudnpoeGN6Y3poempkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5Mzg2NjgsImV4cCI6MjEwMDUxNDY2OH0.sLsBmUFFm-yM2pF1CX-c7MuHZrn7GnMvpRLsltHwokM";
