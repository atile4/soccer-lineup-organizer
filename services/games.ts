import { SplitBy } from "@/app/types";
import { supabase } from "@/lib/supabase";

export async function fetchGames(teamId: string) {
  // @TODO include a user id to fetch
  const { data, error } = await supabase.from("games").select("*").eq("team_id", teamId);
  if (error) throw error;
  return data;
}

export async function fetchSplit(gameId: string) {
  const { data, error } = await supabase
    .from("games")
    .select("split_by")
    .eq("id", gameId)
    .single();

  if (error) throw error;
  return data.split_by;
}

export async function updateSplit(gameId: string, splitType: SplitBy) {
  const { data, error } = await supabase
    .from("games")
    .update({ split_by: splitType })
    .eq("id", gameId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

