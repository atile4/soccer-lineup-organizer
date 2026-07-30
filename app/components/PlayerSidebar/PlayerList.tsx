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
      className={`${playerSidebarStyles.playerList} ${
        isOver ? "ring-2 ring-[#318e2a] rounded-lg" : ""
      }`}
    >
      <div className="grid grid-cols-2 gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-gray-100 animate-pulse"
            />
          ))
        ) : unplacedPlayers.length === 0 ? (
          <p className="col-span-2 text-sm text-gray-400 text-center py-8">
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
          className="bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-1 aspect-square hover:bg-gray-200 transition-colors"
          aria-label="Create player"
        >
          <Plus className="h-8 w-8 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Create Player</span>
        </button>
      </div>
    </aside>
  );
};
