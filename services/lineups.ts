import { supabase } from "@/lib/supabase";
import { Lineup } from "@/app/types";

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
