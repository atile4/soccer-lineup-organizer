"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { teamSwitcherStyles as styles } from "./TeamSwitcher.styles";
import { fetchTeams, setCurrentTeam } from "@/services/teams";
import { fetchCurrentIDs } from "@/services/profiles";
import { Team } from "@/app/types";

interface TeamSwitcherProps {
  userId: string;
}

export default function TeamSwitcher({ userId }: TeamSwitcherProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  // Load the coach's teams
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [teamList, current] = await Promise.all([
          fetchTeams(userId),
          fetchCurrentIDs(userId),
        ]);

        if (cancelled) return;

        setTeams(teamList);
        // Fall back to the first team if there's no saved selection yet,
        // or if the saved id no longer matches a real team (e.g. deleted).
        const validCurrent = teamList.find(
          (t) => t.id === current.current_team_id,
        );
        setCurrentTeamId(validCurrent?.id ?? teamList[0]?.id ?? "");
      } catch (err) {
        console.error("Failed to load teams:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleChange = async (teamId: string) => {
    const previous = currentTeamId;
    setCurrentTeamId(teamId); // optimistic update — feels instant
    setSwitching(true);
    try {
      await setCurrentTeam(userId, teamId);
    } catch (err) {
      console.error("Failed to switch teams:", err);
      setCurrentTeamId(previous); // roll back on failure
    } finally {
      setSwitching(false);
    }
  };

  if (loading || teams.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={currentTeamId}
        disabled={switching}
        aria-label="Switch team"
        onChange={(e) => handleChange(e.target.value)}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id} className="text-gray-900">
            {team.name}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.chevron} aria-hidden="true" />
    </div>
  );
}
