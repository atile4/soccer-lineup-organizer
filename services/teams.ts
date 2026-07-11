import { supabase } from "@/lib/supabase";
import { Team, Division } from "@/app/types";

export async function fetchTeams(userId: string) {
  // @TODO include a user id to fetch
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
): Promise<Team> {
  const { data, error } = await supabase
    .from("teams")
    .insert({ user_id: userId, name, division })
    .select()
    .single();

  if (error) throw error;
  return { ...data, players: [] } as Team;
}
