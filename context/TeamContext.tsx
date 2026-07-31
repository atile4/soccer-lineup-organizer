"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  fetchTeamsWithPlayerCount,
  setCurrentTeam as persistCurrentTeam,
  deleteTeam as deleteTeamService,
} from "@/services/teams";
import { fetchCurrentIDs } from "@/services/profiles";
import { TeamWithPlayerCount } from "@/app/types";

interface TeamContextValue {
  teams: TeamWithPlayerCount[];
  currentTeamId: string | null;
  currentTeam: TeamWithPlayerCount | null;
  loading: boolean;
  switchTeam: (teamId: string) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  refreshTeams: () => Promise<void>;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [teams, setTeams] = useState<TeamWithPlayerCount[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshTeams = useCallback(async () => {
    if (!userId) {
      setTeams([]);
      setCurrentTeamId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [teamList, current] = await Promise.all([
        fetchTeamsWithPlayerCount(userId),
        fetchCurrentIDs(userId),
      ]);
      setTeams(teamList);
      setCurrentTeamId((prev) => {
        const persisted = teamList.find((t) => t.id === current.current_team_id);
        const kept = teamList.find((t) => t.id === prev);
        // Prefer the persisted selection, then keep a still-valid in-session
        // selection, otherwise fall back to the first team.
        return persisted?.id ?? kept?.id ?? teamList[0]?.id ?? null;
      });
    } catch (err) {
      console.error("Failed to load teams:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshTeams();
  }, [refreshTeams]);

  const switchTeam = useCallback(
    async (teamId: string) => {
      if (!userId) return;
      const previous = currentTeamId;
      setCurrentTeamId(teamId);
      try {
        await persistCurrentTeam(userId, teamId);
      } catch (err) {
        console.error("Failed to switch teams:", err);
        setCurrentTeamId(previous);
      }
    },
    [userId, currentTeamId],
  );

  const deleteTeam = useCallback(
    async (teamId: string) => {
      // Guard: the active team must never be deleted.
      if (teamId === currentTeamId) return;
      await deleteTeamService(teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
    },
    [currentTeamId],
  );

  const currentTeam = teams.find((t) => t.id === currentTeamId) ?? null;

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeamId,
        currentTeam,
        loading,
        switchTeam,
        deleteTeam,
        refreshTeams,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within a TeamProvider");
  return ctx;
}
