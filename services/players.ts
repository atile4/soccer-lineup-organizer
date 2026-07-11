import { supabase } from "@/lib/supabase";
import { Player } from "@/app/types";

export async function fetchPlayers(teamId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId);

  if (error) throw error;
  return data;
}

export type NewPlayer = {
  name: string;
  number: number;
  position: string;
};

export async function createPlayers(
  teamId: string,
  players: NewPlayer[],
): Promise<Player[]> {
  const rows = players.map((p) => ({ ...p, team_id: teamId }));

  const { data, error } = await supabase.from("players").insert(rows).select();

  if (error) throw error;
  return data as Player[];
}

export async function deletePlayer(playerId: string): Promise<void> {
  const { error } = await supabase.from("players").delete().eq("id", playerId);
  if (error) throw error;
}
