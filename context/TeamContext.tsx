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
} from "@/services/teams";
import { fetchCurrentIDs } from "@/services/profiles";
import { TeamWithPlayerCount } from "@/app/types";

interface TeamContextValue {
  teams: TeamWithPlayerCount[];
  currentTeamId: string | null;
  loading: boolean;
  switchTeam: (teamId: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [teams, setTeams] = useState<TeamWithPlayerCount[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTeams([]);
      setCurrentTeamId(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([fetchTeamsWithPlayerCount(userId), fetchCurrentIDs(userId)])
      .then(([teamList, current]) => {
        if (cancelled) return;
        setTeams(teamList);
        const valid = teamList.find((t) => t.id === current.current_team_id);
        setCurrentTeamId(valid?.id ?? teamList[0]?.id ?? null);
      })
      .catch((err) => console.error("Failed to load teams:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

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

  return (
    <TeamContext.Provider value={{ teams, currentTeamId, loading, switchTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within a TeamProvider");
  return ctx;
}
