"use client";

import { useCallback, useRef } from "react";
import { useDrop } from "react-dnd";
import { useLineup } from "@/context/LineupContext";
import { ItemTypes, PlayerDragItem } from "../dnd/itemTypes";
import { FieldPlayer } from "./FieldPlayer";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

// The soccer field: a drop target that converts a drop point into percentage
// coordinates, plus the on-field player tokens layered on top of the image.
export function Field() {
  const { fieldedPlayers, placements, placeOnField } = useLineup();
  const fieldRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PLAYER,
      drop: (item: PlayerDragItem, monitor) => {
        const rect = fieldRef.current?.getBoundingClientRect();
        const offset = monitor.getClientOffset();
        if (!rect || !offset) return;
        const x = clamp(((offset.x - rect.left) / rect.width) * 100);
        const y = clamp(((offset.y - rect.top) / rect.height) * 100);
        placeOnField(item.playerId, x, y);
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [placeOnField],
  );

  // Attach both the drop target and our measuring ref to the same node.
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      fieldRef.current = node;
      drop(node);
    },
    [drop],
  );

  return (
    <div
      ref={setRefs}
      className={`relative flex-shrink-0 rounded-lg ${
        isOver ? "ring-2 ring-[#318e2a]" : ""
      }`}
    >
      <img
        src="/images/soccer_field.png"
        alt="Soccer field"
        className="rounded-lg block select-none pointer-events-none"
        draggable={false}
        style={{
          maxHeight: "calc(100vh - 6rem)",
          maxWidth: "900px",
          width: "auto",
          height: "auto",
        }}
      />

      {fieldedPlayers.map((player) => {
        const placement = placements[player.id];
        if (!placement || placement.x == null || placement.y == null)
          return null;
        return (
          <FieldPlayer
            key={player.id}
            player={player}
            x={placement.x}
            y={placement.y}
          />
        );
      })}
    </div>
  );
}

export default Field;
