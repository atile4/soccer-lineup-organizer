import React, { useState } from "react";
import { playerSidebarStyles } from "./PlayerSidebar.styles";

// components
import { ChevronLeft, X } from "lucide-react";
import { PlayerList } from "./PlayerList";

// types
import { TempPlayer } from "../../types";

interface PlayerSidebarProps {
  title?: string;
}

const players: TempPlayer[] = [
  {
    id: 0,
    name: "John David",
    number: 4,
  },
  {
    id: 1,
    name: "Alan Gong",
    number: 67,
  },
  {
    id: 2,
    name: "Michael Chen",
    number: 12,
  },
  {
    id: 3,
    name: "Sarah Kim",
    number: 23,
  },
  {
    id: 4,
    name: "David Lee",
    number: 31,
  },
  {
    id: 5,
    name: "Emma Wilson",
    number: 45,
  },
  {
    id: 6,
    name: "Chris Martinez",
    number: 52,
  },
  {
    id: 7,
    name: "Jessica Brown",
    number: 88,
  },
];

export const PlayerSidebar: React.FC<PlayerSidebarProps> = ({
  title = "Players",
}) => {
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
        </div>
      </aside>
    </>
  );
};

export default PlayerSidebar;
