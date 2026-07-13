import { supabase } from "@/lib/supabase";

export async function fetchCurrentIDs(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("current_team_id, current_game_id")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}
