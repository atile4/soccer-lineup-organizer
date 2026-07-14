import { supabase } from "@/lib/supabase";

export async function fetchCurrentIDs(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("current_team_id, current_game_id")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  if (!data) throw new Error(`No profile found for user ${userId}`);

  return data;
}
