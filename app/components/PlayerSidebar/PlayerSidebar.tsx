import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { playerSidebarStyles } from "./PlayerSidebar.styles";

//types
import { Player } from "../../types";

import { PlayerList } from "./PlayerList";

import { fetchPlayers } from "@/services/players";
import { fetchFieldPositions } from "@/services/fieldPositions";
import { useGame } from "@/context/GameContext";

interface PlayerSidebarProps {
  teamId: string | null;
}

export const PlayerSidebar: React.FC<PlayerSidebarProps> = ({ teamId }) => {
  const { currentGame } = useGame();
  const lineupId = currentGame?.current_lineup_id ?? null;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [roster, setRoster] = useState<Player[]>([]);
  // Player ids already placed on the field or bench for the active lineup.
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());

  // The full team roster.
  useEffect(() => {
    if (teamId) {
      fetchPlayers(teamId).then(setRoster);
    }
  }, [teamId]);

  // Which players are already fielded/benched — scoped to the active lineup,
  // so switching lineups re-scopes the sidebar. A player with a
  // field_positions row (on field or bench) is excluded here; players with no
  // row for this lineup remain available in the sidebar.
  useEffect(() => {
    if (!lineupId) {
      setAssignedIds(new Set());
      return;
    }

    let cancelled = false;
    fetchFieldPositions(lineupId)
      .then((positions) => {
        if (!cancelled) {
          setAssignedIds(new Set(positions.map((p) => p.player_id)));
        }
      })
      .catch((err) => console.error("Failed to load field positions:", err));

    return () => {
      cancelled = true;
    };
  }, [lineupId]);

  const players = useMemo(
    () => roster.filter((p) => !assignedIds.has(p.id)),
    [roster, assignedIds],
  );

  return (
    <>
      {/* Open-sidebar arrow button (visible only when sidebar is collapsed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={playerSidebarStyles.openButton}
          aria-label="Open sidebar"
        >
          <ChevronLeft className={playerSidebarStyles.openButtonIcon} />
        </button>
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`${playerSidebarStyles.sidebar} ${
          sidebarOpen
            ? playerSidebarStyles.sidebarOpen
            : playerSidebarStyles.sidebarClosed
        }`}
      >
        <div className={playerSidebarStyles.innerWrapper}>
          {/* Header row with title + close (X) button */}
          <div className={playerSidebarStyles.header}>
            <button
              onClick={() => setSidebarOpen(false)}
              className={playerSidebarStyles.closeButton}
              aria-label="Close sidebar"
            >
              <X className={playerSidebarStyles.closeButtonIcon} />
            </button>
            <h1 className={playerSidebarStyles.title}>{"Players"}</h1>
          </div>

          {/* Content area*/}
          <PlayerList players={players} />

          <button type="button" className={playerSidebarStyles.sendAllButton}>
            Send All Players to Bench
          </button>
        </div>
      </aside>
    </>
  );
};

export default PlayerSidebar;
