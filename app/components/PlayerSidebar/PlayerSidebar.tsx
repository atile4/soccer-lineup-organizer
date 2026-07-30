"use client";

import React from "react";
import { ChevronLeft, X } from "lucide-react";
import { playerSidebarStyles } from "./PlayerSidebar.styles";

import { PlayerList } from "./PlayerList";
import { useLineup } from "@/context/LineupContext";

interface PlayerSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDesktop: boolean;
}

export const PlayerSidebar = ({
  open: sidebarOpen,
  onOpenChange: setSidebarOpen,
  isDesktop,
}: PlayerSidebarProps) => {
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

      {/* Backdrop — closes the drawer on tap (mobile only) */}
      {sidebarOpen && !isDesktop && (
        <div
          className={playerSidebarStyles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Collapsible sidebar (desktop column) / off-canvas drawer (mobile) */}
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
