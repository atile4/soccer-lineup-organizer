"use client";

import { Player } from "@/app/types";
import { DraggablePlayer } from "../dnd/DraggablePlayer";
import PlayerToken from "../PlayerSidebar/PlayerToken";
import { fieldStyles as styles } from "./Field.styles";
import { usePlayerInfo } from "@/context/PlayerInfoContext";
import { useTeam } from "@/context/TeamContext";
import { useLineup } from "@/context/LineupContext";
import { usePlayerSize } from "@/context/PlayerSizeContext";

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
  const { applyPlayerUpdate, removePlayer } = useLineup();
  const { scale } = usePlayerSize();
  return (
    <DraggablePlayer
      playerId={player.id}
      name={player.name}
      number={player.number}
      jerseyColor={currentTeam?.color}
      previewVariant="field"
      className={styles.player}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={(e) =>
        openPlayer(player, e.currentTarget, applyPlayerUpdate, removePlayer)
      }
    >
      <PlayerToken
        name={player.name}
        number={player.number}
        variant="field"
        jerseyColor={currentTeam?.color}
        scale={scale}
      />
    </DraggablePlayer>
  );
}
