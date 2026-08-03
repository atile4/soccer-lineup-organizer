"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { sidebarStyles } from "./ManageSidebar.styles";
import { Game } from "@/app/types";

interface GameSelectDropdownProps {
  games: Game[];
  currentGameId: string | null;
  onSelect: (gameId: string) => void;
  onRequestDelete: (game: Game) => void;
}

// Custom game picker that mimics the native <select> but lets each game (except
// the currently selected one) carry a delete button.
export default function GameSelectDropdown({
  games,
  currentGameId,
  onSelect,
  onRequestDelete,
}: GameSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentGame = games.find((g) => g.id === currentGameId) ?? null;

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (gameId: string) => {
    onSelect(gameId);
    setOpen(false);
  };

  return (
    <div className={sidebarStyles.selectWrapper} ref={wrapperRef}>
      <button
        type="button"
        className={sidebarStyles.gameSelectButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select game"
      >
        <span className={sidebarStyles.gameSelectButtonLabel}>
          {currentGame?.name ?? "No games"}
        </span>
        <ChevronDown
          className={sidebarStyles.gameSelectButtonIcon}
          aria-hidden="true"
        />
      </button>

      {open && games.length > 0 && (
        <ul className={sidebarStyles.gameSelectMenu} role="listbox">
          {games.map((g) => {
            const isCurrent = g.id === currentGameId;
            return (
              <li
                key={g.id}
                role="option"
                aria-selected={isCurrent}
                className={`${sidebarStyles.gameSelectOption} ${
                  isCurrent ? sidebarStyles.gameSelectOptionActive : ""
                }`}
              >
                <button
                  type="button"
                  className={sidebarStyles.gameSelectOptionLabel}
                  onClick={() => handleSelect(g.id)}
                >
                  {g.name}
                </button>

                {/* Currently selected game can't be deleted. */}
                {!isCurrent && (
                  <button
                    type="button"
                    className={sidebarStyles.gameSelectDeleteButton}
                    onClick={() => {
                      onRequestDelete(g);
                      setOpen(false);
                    }}
                    aria-label={`Delete ${g.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
