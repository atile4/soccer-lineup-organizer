import { supabase } from "@/lib/supabase";

export async function fetchPlayers(teamId: string) {
  // @TODO include teamId and userId as param to fetch
  const { data, error } = await supabase.from("players").select("*");
  // .eq("team_id", teamId);

  if (error) throw error;
  return data;
}