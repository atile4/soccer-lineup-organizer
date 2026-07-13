import { SplitBy, Game } from "@/app/types";
import { supabase } from "@/lib/supabase";

export async function fetchGames(teamId: string) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("team_id", teamId);
  if (error) throw error;
  return data;
}

export async function createGame(
  teamId: string,
  name: string,
  notes: string,
  split_by: SplitBy,
): Promise<Game> {
  const { data, error } = await supabase
    .from("games")
    .insert({ team_id: teamId, name, notes, split_by })
    .select()
    .single();

  if (error) throw error;
  console.log("game created");
  return data as Game;
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
