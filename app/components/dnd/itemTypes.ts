// Shared react-dnd item types and payloads for player drag-and-drop.

export const ItemTypes = {
  PLAYER: "player",
} as const;

// The payload carried while dragging any player token (sidebar, bench, or field).
export interface PlayerDragItem {
  playerId: string;
}
