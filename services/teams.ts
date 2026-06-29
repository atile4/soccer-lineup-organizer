import { supabase } from "@/lib/supabase";

export async function fetchTeams(userId: string) {
  // @TODO include a user id to fetch
  const { data, error } = await supabase.from("players").select("*").eq("userId", userId);;

  if (error) throw error;
  return data;
}