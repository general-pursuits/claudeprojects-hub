import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Stable anonymous user ID — persists in localStorage as identity only
function getUserId() {
  let id = localStorage.getItem("dashboard_user_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("dashboard_user_id", id); }
  return id;
}
const USER_ID = getUserId();

export function readJSON(key, fallback = null) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

export function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota or private mode — cloud copy still applies */ }
}

// Reads one column of this user's row in `table`, or null when there is no row.
export async function loadUserRow(table, column) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(table)
      .select(column)
      .eq("user_id", USER_ID)
      .maybeSingle(); // returns null instead of error when no row found
    if (error) { console.warn(`Supabase ${table} load error:`, error.message); return null; }
    return data?.[column] || null;
  } catch (e) { console.warn(`Supabase ${table} load failed:`, e); return null; }
}

export async function saveUserRow(table, column, value) {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from(table)
      .upsert({ user_id: USER_ID, [column]: value }, { onConflict: "user_id" });
    if (error) console.warn(`Supabase ${table} save error:`, error.message);
  } catch (e) { console.warn(`Supabase ${table} save failed:`, e); }
}
