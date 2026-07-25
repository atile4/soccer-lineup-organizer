"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";

import { Player } from "@/app/types";
import PlayerInfoPopover from "@/app/components/PlayerInfo/PlayerInfoPopover";

interface PlayerInfoContextValue {
  // Open the info popover for a player, anchored to the clicked element.
  // onUpdate is optional: pass it if the caller holds its own copy of this
  // player's data (a roster list, fieldedPlayers, etc.) that needs to stay
  // in sync after a save, without waiting for a full refetch.
  openPlayer: (
    player: Player,
    anchor: HTMLElement,
    onUpdate?: (updated: Player) => void,
  ) => void;
}

const PlayerInfoContext = createContext<PlayerInfoContextValue | undefined>(
  undefined,
);

interface SelectedPlayer {
  player: Player;
  anchor: HTMLElement;
  onUpdate?: (updated: Player) => void;
}

export function PlayerInfoProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedPlayer | null>(null);

  const openPlayer = useCallback(
    (
      player: Player,
      anchor: HTMLElement,
      onUpdate?: (updated: Player) => void,
    ) => {
      setSelected({ player, anchor, onUpdate });
    },
    [],
  );

  const close = useCallback(() => setSelected(null), []);

  // Fired by the popover after a successful save. Updates what the popover
  // itself is displaying, and tells the original caller (if it registered
  // a callback) so their list reflects the change too.
  const handlePlayerUpdate = useCallback(
    (updated: Player) => {
      setSelected((prev) => (prev ? { ...prev, player: updated } : prev));
      selected?.onUpdate?.(updated);
    },
    [selected],
  );

  return (
    <PlayerInfoContext.Provider value={{ openPlayer }}>
      {children}
      {selected && (
        <PlayerInfoPopover
          player={selected.player}
          anchor={selected.anchor}
          onClose={close}
          onPlayerUpdate={handlePlayerUpdate}
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
