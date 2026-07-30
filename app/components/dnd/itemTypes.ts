// Shared react-dnd item types and payloads for player drag-and-drop.

import type { PlayerTokenVariant } from "../PlayerSidebar/PlayerToken";

export const ItemTypes = {
  PLAYER: "player",
} as const;

// The payload carried while dragging any player token (sidebar, bench, or field).
// The optional preview fields let the CustomDragLayer render a live preview of
// the dragged player, since the touch backend shows no native drag image.
export interface PlayerDragItem {
  playerId: string;
  name?: string;
  number?: number;
  jerseyColor?: string;
  previewVariant?: PlayerTokenVariant;
}
