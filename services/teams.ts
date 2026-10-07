import { supabase } from "@/lib/supabase";
import { Team, Division, Gender, TeamWithPlayerCount } from "@/app/types";
import { MAX_TEAMS } from "@/app/constants/playerLimits";
import { createGameWithLineups } from "./games";
import { fetchIsPremium } from "./premium";

// Thrown when a non-premium user already owns MAX_TEAMS teams, so the UI can
// show the limit message instead of a generic failure.
export class MaxTeamsReachedError extends Error {
  constructor() {
    super(`You can have at most ${MAX_TEAMS} teams.`);
    this.name = "MaxTeamsReachedError";
  }
}

// Enforces MAX_TEAMS at the service layer.
async function assertTeamLimit(userId: string) {
  const { count, error } = await supabase
    .from("teams")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;
  if ((count ?? 0) < MAX_TEAMS) return;
  if (await fetchIsPremium(userId)) return;

  throw new MaxTeamsReachedError();
}

export async function fetchTeams(userId: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function fetchTeamsWithPlayerCount(
  userId: string,
): Promise<TeamWithPlayerCount[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("*, players(count)")
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map((team) => ({
    ...team,
    playerCount: team.players?.[0]?.count ?? 0,
  }));
}

export async function createTeam(
  userId: string,
  name: string,
  division: Division,
  gender: Gender,
  color: string,
): Promise<Team> {
  await assertTeamLimit(userId);

  const { data, error } = await supabase
    .from("teams")
    .insert({ user_id: userId, name, division, gender, color })
    .select()
    .single();

  if (error) throw error;
  return { ...data, players: [] } as Team;
}

export async function createTeamWithDefaultGame(
  userId: string,
  name: string,
  division: Division,
  gender: Gender,
  color: string,
): Promise<Team> {
  const team = await createTeam(userId, name, division, gender, color);
  await createGameWithLineups(team.id, "New Game", "none", "");
  return team;
}

export async function updateTeamName(
  teamId: string,
  name: string,
): Promise<Team> {
  const { data, error } = await supabase
    .from("teams")
    .update({ name })
    .eq("id", teamId)
    .select()
    .single();

  if (error) throw error;
  return data as Team;
}

export async function updateTeamColor(
  teamId: string,
  color: string,
): Promise<Team> {
  const { data, error } = await supabase
    .from("teams")
    .update({ color })
    .eq("id", teamId)
    .select()
    .single();

  if (error) throw error;
  return data as Team;
}

export async function deleteTeam(teamId: string) {
  // Players and games cascade-delete via their team_id FK.
  const { error } = await supabase.from("teams").delete().eq("id", teamId);
  if (error) throw error;
}

export async function setCurrentTeam(userId: string, teamId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ current_team_id: teamId })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
