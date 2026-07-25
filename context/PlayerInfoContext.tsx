"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

import { Player } from "@/app/types";
import PlayerInfoPopover from "@/app/components/PlayerInfo/PlayerInfoPopover";

interface PlayerInfoContextValue {
  // Open the info popover for a player, anchored to the clicked element.
  openPlayer: (player: Player, anchor: HTMLElement) => void;
}

const PlayerInfoContext = createContext<PlayerInfoContextValue | undefined>(
  undefined,
);

interface SelectedPlayer {
  player: Player;
  anchor: HTMLElement;
}

// Holds the single "which player's info is showing" state and renders the
// popover. Any player surface (sidebar, bench, field) can open it via
// usePlayerInfo(), so there's exactly one popover shared across the app.
export function PlayerInfoProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedPlayer | null>(null);

  const openPlayer = useCallback((player: Player, anchor: HTMLElement) => {
    setSelected({ player, anchor });
  }, []);

  const close = useCallback(() => setSelected(null), []);

  return (
    <PlayerInfoContext.Provider value={{ openPlayer }}>
      {children}
      {selected && (
        <PlayerInfoPopover
          player={selected.player}
          anchor={selected.anchor}
          onClose={close}
        />
      )}
    </PlayerInfoContext.Provider>
  );
}

export function usePlayerInfo() {
  const ctx = useContext(PlayerInfoContext);
  if (!ctx)
    throw new Error("usePlayerInfo must be used within a PlayerInfoProvider");
  return ctx;
}
