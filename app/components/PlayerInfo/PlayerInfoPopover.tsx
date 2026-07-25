"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Player } from "@/app/types";
import { playerInfoPopoverStyles as s } from "./PlayerInfoPopover.styles";
import { useTeam } from "@/context/TeamContext";

interface PlayerInfoPopoverProps {
  player: Player;
  anchor: HTMLElement;
  onClose: () => void;
}

const GAP = 8; // space between the anchor and the popover
const MARGIN = 8; // keep the popover this far from the viewport edges

// A small popover that displays a player's information, positioned just
// below the clicked player (or above, if there isn't room below).
export default function PlayerInfoPopover({
  player,
  anchor,
  onClose,
}: PlayerInfoPopoverProps) {
  const { currentTeam } = useTeam();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );

  // Position the popover relative to the anchor once we can measure both.
  // Prefer below the player; flip above when it would overflow the bottom.
  useLayoutEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;

    const anchorRect = anchor.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = popover;

    const fitsBelow =
      anchorRect.bottom + GAP + height + MARGIN <= window.innerHeight;
    const top = fitsBelow
      ? anchorRect.bottom + GAP
      : Math.max(MARGIN, anchorRect.top - GAP - height);

    // Prefer bottom-right: popover's left edge starts at the anchor's left edge.
    // Flip to bottom-left (popover's right edge ends at the anchor's right edge)
    // if it would overflow the right side of the viewport.
    const fitsRight = anchorRect.left + width + MARGIN <= window.innerWidth;
    const left = fitsRight
      ? anchorRect.left
      : Math.max(MARGIN, anchorRect.right - width);

    setCoords({ top, left });
  }, [anchor]);

  // Close on Escape, matching the rest of the app's modals.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    // Transparent full-screen layer to catch outside clicks.
    <div className={s.overlay} onClick={onClose}>
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        className={s.popover}
        style={{
          top: coords?.top ?? 0,
          left: coords?.left ?? 0,
          visibility: coords ? "visible" : "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.headerRow}>
          <div className={s.identitySection}>
            <div className={s.nameRow}>
              <h3 className={s.name}>{player.name}</h3>
              {/* Edit handler not implemented yet — visual only */}
              <span className={s.editIconButton} aria-hidden="true">
                <Pencil size={13} />
              </span>
            </div>

            <div className={s.positionRow}>
              <span className={s.position}>{player.position || "—"}</span>
              <span className={s.editIconButton} aria-hidden="true">
                <Pencil size={11} />
              </span>
            </div>
          </div>

          {/* Jersey badge — same shape as PlayerToken, sized down */}
          <div className={s.jerseyWrapper}>
            <svg viewBox="0 0 100 90" width="44" height="40">
              <path
                d="M25 10 L10 30 L25 35 L25 80 L75 80 L75 35 L90 30 L75 10 C70 18 60 22 50 22 C40 22 30 18 25 10Z"
                fill={currentTeam?.color ?? "#7C3AED"}
                stroke="#1a1a1a"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <text
                x="50"
                y="58"
                textAnchor="middle"
                fontSize="26"
                fontWeight="bold"
                fill="white"
                fontFamily="Arial, sans-serif"
              >
                {player.number}
              </text>
            </svg>
          </div>
        </div>

        {/* Player notes — not wired to a save handler yet */}
        <textarea
          readOnly
          placeholder="Player Notes..."
          className={s.notesTextarea}
        />
      </div>
    </div>
  );
}
