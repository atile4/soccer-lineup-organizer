// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { auth } from "./firebase";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Unauthenticated client — for public data or pre-login use
export const supabase = createClient(supabaseURL, supabaseAnonKey);

// Authenticated client — used for user data
export async function getSupabaseClient() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not logged in');

  const firebaseToken = await user.getIdToken();

  const res = await fetch('/api/supabase-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firebaseToken }),
  });

  if (!res.ok) throw new Error('Failed to get Supabase token');

  const { supabaseToken } = await res.json();

  return createClient(supabaseURL, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${supabaseToken}` },
    },
  });
}