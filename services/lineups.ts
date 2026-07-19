import { supabase } from "@/lib/supabase";
import { Lineup, Game } from "@/app/types";

/**
 * Returns the lineup row for a game/period, creating it if it doesn't exist.
 *
 * @TODO Lineup switching isn't built yet, so `period` defaults to 1 and callers
 *       treat a game as having a single lineup. Once switching lands, `period`
 *       should be driven by the active lineup selector, derived from the game's
 *       split_by (none = 1 period, half = 2, quarter = 4).
 */
export async function getOrCreateLineup(
  gameId: string,
  period = 1,
): Promise<Lineup> {
  const { data: existing, error: fetchError } = await supabase
    .from("lineups")
    .select("*")
    .eq("game_id", gameId)
    .eq("period", period)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existing) return existing as Lineup;

  const { data, error } = await supabase
    .from("lineups")
    .insert({ game_id: gameId, period })
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
