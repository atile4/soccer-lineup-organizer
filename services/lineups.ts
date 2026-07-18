import { supabase } from "@/lib/supabase";
import { Game, Lineup } from "@/app/types";

export async function createLineup(
  gameId: string,
  period: number,
  formation: string,
): Promise<Lineup> {
  const { data, error } = await supabase
    .from("lineups")
    .insert({ game_id: gameId, period, formation })
    .select()
    .single();

  if (error) throw error;
  return data as Lineup;
}

export async function fetchLineups(gameId: string): Promise<Lineup[]> {
  const { data, error } = await supabase
    .from("lineups")
    .select()
    .eq("game_id", gameId);

  if (error) throw error;
  return data as Lineup[];
}

export async function switchLineup(
  gameId: string,
  lineupId: string,
): Promise<Game> {
  const { data: lineup, error: lineupError } = await supabase
    .from("lineups")
    .select("id, game_id")
    .eq("id", lineupId)
    .single();

  if (lineupError) throw lineupError;
  if (lineup.game_id !== gameId) {
    throw new Error(`Lineup ${lineupId} does not belong to game ${gameId}`);
  }

  const { data, error } = await supabase
    .from("games")
    .update({ current_lineup_id: lineupId })
    .eq("id", gameId)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}
