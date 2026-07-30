"use client";

import { Plus } from "lucide-react";
import { useDrop } from "react-dnd";
import PlayerCard from "./PlayerCard";
import { playerSidebarStyles } from "./PlayerSidebar.styles";
import { DraggablePlayer } from "../dnd/DraggablePlayer";
import { ItemTypes, PlayerDragItem } from "../dnd/itemTypes";
import { useLineup } from "@/context/LineupContext";
import { usePlayerInfo } from "@/context/PlayerInfoContext";
import { useTeam } from "@/context/TeamContext";

// The sidebar list shows only players that aren't yet placed for the active
// lineup. Dropping a placed player back here removes them from the lineup.
export const PlayerList = () => {
  const { unplacedPlayers, unplace, applyPlayerUpdate, removePlayer, loading } =
    useLineup();
  const { openPlayer } = usePlayerInfo();
  const { currentTeam } = useTeam();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PLAYER,
      drop: (item: PlayerDragItem) => unplace(item.playerId),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [unplace],
  );

  return (
    <aside
      ref={(node) => {
        drop(node);
      }}
      className={`${playerSidebarStyles.playerListAside} ${
        isOver ? playerSidebarStyles.playerListAsideIsOver : ""
      }`}
    >
      <div className={playerSidebarStyles.playerListGrid}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={playerSidebarStyles.playerListSkeleton} />
          ))
        ) : unplacedPlayers.length === 0 ? (
          <p className={playerSidebarStyles.playerListEmptyMessage}>
            All players are on the field or bench.
          </p>
        ) : (
          unplacedPlayers.map((player) => (
            <DraggablePlayer
              key={player.id}
              playerId={player.id}
              name={player.name}
              number={player.number}
              jerseyColor={currentTeam?.color}
              previewVariant="default"
              onClick={(e) =>
                openPlayer(
                  player,
                  e.currentTarget,
                  applyPlayerUpdate,
                  removePlayer,
                )
              }
            >
              <PlayerCard
                name={player.name}
                number={player.number}
                jerseyColor={currentTeam?.color}
              />
            </DraggablePlayer>
          ))
        )}
        <button
          type="button"
          className={playerSidebarStyles.playerListCreateButton}
          aria-label="Create player"
        >
          <Plus className={playerSidebarStyles.playerListCreateIcon} />
          <span className={playerSidebarStyles.playerListCreateLabel}>Create Player</span>
        </button>
      </div>
    </aside>
  );
};
