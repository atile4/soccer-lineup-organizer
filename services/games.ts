import { SplitBy, Game, Lineup } from "@/app/types";
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
  return data as Game;
}

export async function createGameWithLineups(
  teamId: string,
  name: string,
  split: SplitBy = "none",
  notes?: string,
): Promise<Game> {
  const { data, error } = await supabase.rpc("create_game_with_lineups", {
    p_team_id: teamId,
    p_name: name,
    p_split: split,
    p_notes: notes ?? null,
  });
  if (error) throw error;
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

// Resizes the game's lineups to match the new split type
export async function updateSplit(
  gameId: string,
  splitType: SplitBy,
): Promise<Lineup[]> {
  const { data, error } = await supabase.rpc("set_game_split", {
    p_game_id: gameId,
    p_split: splitType,
  });

  if (error) throw error;
  return data as Lineup[];
}

export async function updateNotes(
  gameId: string,
  notes: string,
): Promise<Game> {
  const { data, error } = await supabase
    .from("games")
    .update({ notes })
    .eq("id", gameId)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}
