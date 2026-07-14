"use client";

import { ChevronDown } from "lucide-react";
import { teamSwitcherStyles as styles } from "./TeamSwitcher.styles";
import { useTeam } from "@/context/TeamContext";

export default function TeamSwitcher() {
  const { teams, currentTeamId, loading, switchTeam } = useTeam();

  if (loading || teams.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={currentTeamId ?? ""}
        aria-label="Switch team"
        onChange={(e) => switchTeam(e.target.value)}
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
