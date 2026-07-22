"use client";

import { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes, PlayerDragItem } from "./itemTypes";

interface DraggablePlayerProps {
  playerId: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Reusable drag source for a player. Wraps any content (sidebar card, bench
// chip, or field token) so it can be dropped onto the field, bench, or sidebar.
export function DraggablePlayer({
  playerId,
  children,
  className,
  style,
}: DraggablePlayerProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.PLAYER,
      item: { playerId } as PlayerDragItem,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [playerId],
  );

  return (
    <div
      ref={(node) => {
        drag(node);
      }}
      className={className}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab", ...style }}
    >
      {children}
    </div>
  );
}
