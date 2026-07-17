"use client";

import React, { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { playerSidebarStyles } from "./PlayerSidebar.styles";

import { PlayerList } from "./PlayerList";
import { useLineup } from "@/context/LineupContext";

// Roster/availability list for the active lineup. Players are sourced from
// LineupContext so the sidebar, field, and bench stay in sync.
//
// @TODO The list is currently team-wide. Once lineup switching exists, the set
//       of available players should be scoped per lineup (see LineupContext).
export const PlayerSidebar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { benchAll } = useLineup();

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
          <PlayerList />

          <button
            type="button"
            onClick={benchAll}
            className={playerSidebarStyles.sendAllButton}
          >
            Send All Players to Bench
          </button>
        </div>
      </aside>
    </>
  );
};

export default PlayerSidebar;
