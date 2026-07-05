import { supabase } from "@/lib/supabase";

export async function fetchPlayers(teamId: string) {
  const { data, error } = await supabase.from("players")
                                        .select("*")
                                        .eq("team_id", teamId);

  if (error) throw error;
  return data;
}