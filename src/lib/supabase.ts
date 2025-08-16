import { createClient } from "@supabase/supabase-js";
// lib/supabase.ts
console.log("SUPABASE_URL?", process.env.SUPABASE_URL);

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env.local");
}

export const supabase = createClient(url, key, { auth: { persistSession: false } });

