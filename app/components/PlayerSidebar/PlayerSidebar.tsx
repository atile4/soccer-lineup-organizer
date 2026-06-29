import React, { useEffect, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { playerSidebarStyles } from "./PlayerSidebar.styles";

//types
import { Player } from "../../types";

import { fetchPlayers } from "@/services/players";

interface PlayerSidebarProps {
  title?: string;
  teamId?: string;
}

export const PlayerSidebar: React.FC<PlayerSidebarProps> = ({
  title = "Players",
  teamId = "b7e882e5-b931-4a03-b896-bc71d140dcfe",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetchPlayers(teamId).then(setPlayers);
  }, [teamId]);

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
            <h1 className={playerSidebarStyles.title}>{title}</h1>
          </div>

          {/* Content area - customize as needed */}
          <div className="mt-6 text-gray-400 text-sm">
            Sidebar content goes here
          </div>
        </div>
      </aside>
    </>
  );
};

export default PlayerSidebar;
