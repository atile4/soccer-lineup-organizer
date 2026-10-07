import { SplitBy, Game, Lineup } from "@/app/types";
import { MAX_GAMES } from "@/app/constants/playerLimits";
import { supabase } from "@/lib/supabase";
import { fetchIsPremium } from "./premium";

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

// Thrown when a non-premium user is already at MAX_GAMES on a team, so the
// UI can shows a limit message.
export class MaxGamesReachedError extends Error {
  constructor() {
    super(`You can have at most ${MAX_GAMES} games per team.`);
    this.name = "MaxGamesReachedError";
  }
}

// Enforces MAX_GAMES at the service layer
async function assertGameLimit(teamId: string) {
  const { count, error } = await supabase
    .from("games")
    .select("id", { count: "exact", head: true })
    .eq("team_id", teamId);

  if (error) throw error;
  if ((count ?? 0) < MAX_GAMES) return;

  // At the limit — resolve the owner, since only that user could be exempt.
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("user_id")
    .eq("id", teamId)
    .single();

  if (teamError) throw teamError;
  if (await fetchIsPremium(team.user_id)) return;

  throw new MaxGamesReachedError();
}

export async function createGameWithLineups(
  teamId: string,
  name: string,
  split: SplitBy = "none",
  notes?: string,
): Promise<Game> {
  await assertGameLimit(teamId);

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

// Deletes a game. Its lineups are removed via the ON DELETE CASCADE FK.
export async function deleteGame(gameId: string): Promise<void> {
  const { error } = await supabase.from("games").delete().eq("id", gameId);
  if (error) throw error;
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

export async function updateGameName(
  gameId: string,
  name: string,
): Promise<Game> {
  const { data, error } = await supabase
    .from("games")
    .update({ name })
    .eq("id", gameId)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}
