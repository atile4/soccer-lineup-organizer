"use client";

import { Player } from "@/app/types";
import { DraggablePlayer } from "../dnd/DraggablePlayer";
import PlayerToken from "../PlayerSidebar/PlayerToken";
import { usePlayerInfo } from "@/context/PlayerInfoContext";
import { useTeam } from "@/context/TeamContext";

interface FieldPlayerProps {
  player: Player;
  x: number; // percentage from left
  y: number; // percentage from top
}

// A player standing on the field: no card background, just the shirt + name,
// absolutely positioned and centered on (x, y). Draggable to reposition, or to
// drop onto the bench / sidebar.
export function FieldPlayer({ player, x, y }: FieldPlayerProps) {
  const { openPlayer } = usePlayerInfo();
  const { currentTeam } = useTeam();
  return (
    <DraggablePlayer
      playerId={player.id}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={(e) => openPlayer(player, e.currentTarget)}
    >
      <PlayerToken
        name={player.name}
        number={player.number}
        variant="field"
        jerseyColor={currentTeam?.color}
      />
    </DraggablePlayer>
  );
}
