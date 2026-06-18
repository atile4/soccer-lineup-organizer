import React, { useState } from "react";
import { playerSidebarStyles } from "./PlayerSidebar.styles";

// components
import { ChevronLeft, X } from "lucide-react";
import { PlayerList } from "./PlayerList";

// types
import { TempPlayer } from "../../types";

// mock data import
import playersData from "../../../data/mockPlayers.json";

const players: TempPlayer[] = playersData;

export const PlayerSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

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
