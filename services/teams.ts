import { supabase } from "@/lib/supabase";
import { Team, Division, Gender } from "@/app/types";
import { createGame } from "./games";

export async function fetchTeams(userId: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function createTeam(
  userId: string,
  name: string,
  division: Division,
  gender: Gender,
  color: string,
): Promise<Team> {
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
  await createGame(team.id, "New Game", "", "none");
  return team;
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
