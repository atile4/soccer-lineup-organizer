"use client";

import { useState } from "react";
import { useDrop } from "react-dnd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { benchStyles as styles } from "./Bench.styles";
import { DraggablePlayer } from "../dnd/DraggablePlayer";
import { ItemTypes, PlayerDragItem } from "../dnd/itemTypes";
import PlayerToken from "../PlayerSidebar/PlayerToken";
import { useLineup } from "@/context/LineupContext";
import { usePlayerInfo } from "@/context/PlayerInfoContext";
import { useTeam } from "@/context/TeamContext";

export const Bench = () => {
  const [open, setOpen] = useState(true);
  const { benchedPlayers, placeOnBench, applyPlayerUpdate, removePlayer } =
    useLineup();
  const { openPlayer } = usePlayerInfo();
  const { currentTeam } = useTeam();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PLAYER,
      drop: (item: PlayerDragItem) => placeOnBench(item.playerId),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [placeOnBench],
  );

  return (
    <div className={styles.wrapper}>
      <div
        ref={(node) => {
          drop(node);
        }}
        className={`${styles.benchArea} ${
          open ? styles.benchAreaOpen : styles.benchAreaClosed
        } ${isOver ? styles.benchAreaOver : ""}`}
      >
        <div className={styles.innerWrapper}>
          <h2 className={styles.title}>Bench</h2>

          <div className={styles.list}>
            {benchedPlayers.length === 0 ? (
              <p className={styles.emptyText}>No players benched</p>
            ) : (
              benchedPlayers.map((player) => (
                <DraggablePlayer
                  key={player.id}
                  playerId={player.id}
                  name={player.name}
                  number={player.number}
                  jerseyColor={currentTeam?.color}
                  previewVariant="bench"
                  onClick={(e) =>
                    openPlayer(
                      player,
                      e.currentTarget,
                      applyPlayerUpdate,
                      removePlayer,
                    )
                  }
                  className={styles.playerWrapper}
                >
                  <PlayerToken
                    name={player.name}
                    number={player.number}
                    variant="bench"
                    jerseyColor={currentTeam?.color}
                  />
                </DraggablePlayer>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={styles.gripButton}
        aria-label={open ? "Collapse bench" : "Expand bench"}
      >
        {open ? (
          <ChevronLeft className={styles.gripIcon} />
        ) : (
          <ChevronRight className={styles.gripIcon} />
        )}
      </button>
    </div>
  );
};

export default Bench;
