"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Player } from "@/app/types";

interface PlayerInfoPopoverProps {
  player: Player;
  anchor: HTMLElement;
  onClose: () => void;
}

const GAP = 8; // space between the anchor and the popover
const MARGIN = 8; // keep the popover this far from the viewport edges

// A small popover that displays a player's information, positioned just
// below the clicked player (or above, if there isn't room below). It is
// deliberately compact — it floats near the player rather than filling the
// screen. Styling is intentionally minimal.
export default function PlayerInfoPopover({
  player,
  anchor,
  onClose,
}: PlayerInfoPopoverProps) {
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

    const centered = anchorRect.left + anchorRect.width / 2 - width / 2;
    const left = Math.max(
      MARGIN,
      Math.min(centered, window.innerWidth - width - MARGIN),
    );

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
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        className="absolute w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
        style={{
          top: coords?.top ?? 0,
          left: coords?.left ?? 0,
          visibility: coords ? "visible" : "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="pr-5">
          <h3 className="text-base font-semibold text-gray-900">
            {player.name}
          </h3>
          <dl className="mt-2 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between gap-2">
              <dt className="text-gray-400">Number</dt>
              <dd className="font-medium text-gray-800">#{player.number}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-400">Position</dt>
              <dd className="font-medium text-gray-800">
                {player.position || "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
