"use client";

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
  const { unplacedPlayers, unplace, applyPlayerUpdate } = useLineup();
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
      className={`${playerSidebarStyles.playerList} ${
        isOver ? "ring-2 ring-[#318e2a] rounded-lg" : ""
      }`}
    >
      {unplacedPlayers.length === 0 ? (
        <p className="text-sm text-gray-400">
          All players are on the field or bench.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {unplacedPlayers.map((player) => (
            <DraggablePlayer
              key={player.id}
              playerId={player.id}
              onClick={(e) =>
                openPlayer(player, e.currentTarget, applyPlayerUpdate)
              }
            >
              <PlayerCard
                name={player.name}
                number={player.number}
                jerseyColor={currentTeam?.color}
              />
            </DraggablePlayer>
          ))}
        </div>
      )}
    </aside>
  );
};
