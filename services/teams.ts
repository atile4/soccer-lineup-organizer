import { supabase } from "@/lib/supabase";
import { Team, Division, Gender } from "@/app/types";

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
