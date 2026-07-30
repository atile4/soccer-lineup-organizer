"use client";

import { useDragLayer, XYCoord } from "react-dnd";
import PlayerToken from "../PlayerSidebar/PlayerToken";
import { PlayerDragItem } from "./itemTypes";

// Renders the dragged player following the pointer/touch. Required because we
// suppress the native HTML5 drag image (see DraggablePlayer) and the touch
// backend produces no drag image at all — without this layer, drags would be
// invisible on touch devices.
export function CustomDragLayer() {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem() as PlayerDragItem | null,
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset() as XYCoord | null,
  }));

  if (!isDragging || !currentOffset || !item) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      }}
    >
      {/* Center the token on the pointer, matching where a field drop lands. */}
      <div style={{ transform: "translate(-50%, -50%)" }} className="opacity-90">
        <PlayerToken
          name={item.name ?? ""}
          number={item.number ?? 0}
          variant={item.previewVariant ?? "bench"}
          jerseyColor={item.jerseyColor}
        />
      </div>
    </div>
  );
}

export default CustomDragLayer;
