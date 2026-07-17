"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { teamSwitcherStyles as styles } from "./TeamSwitcher.styles";
import { useTeam } from "@/context/TeamContext";
import { TeamWithPlayerCount } from "@/app/types";

// One line of "division · gender · player count" text
const teamMeta = (team: TeamWithPlayerCount) =>
  [
    team.division,
    team.gender,
    `${team.playerCount} ${team.playerCount === 1 ? "player" : "players"}`,
  ]
    .filter(Boolean)
    .join(" · ");

export default function TeamSwitcher() {
  const { teams, currentTeamId, loading, switchTeam } = useTeam();
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Same outside-click pattern as ProfileMenu.tsx
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (loading || teams.length === 0) return null;

  const currentTeam = teams.find((t) => t.id === currentTeamId) ?? teams[0];

  const handleSelect = (teamId: string) => {
    switchTeam(teamId);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      {/* Trigger — shows the currently selected team */}
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={styles.swatch}
          style={{ backgroundColor: currentTeam.color }}
          aria-hidden="true"
        />
        <span className={styles.triggerText}>
          <span className={styles.triggerName}>{currentTeam.name}</span>
          <span className={styles.triggerMeta}>{teamMeta(currentTeam)}</span>
        </span>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown — every team, same detail layout */}
      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown} role="listbox">
          {teams.map((team) => {
            const isSelected = team.id === currentTeam.id;
            return (
              <button
                key={team.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(team.id)}
                className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
              >
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: team.color }}
                  aria-hidden="true"
                />
                <span className={styles.optionText}>
                  <span className={styles.optionName}>{team.name}</span>
                  <span className={styles.optionMeta}>{teamMeta(team)}</span>
                </span>
                {isSelected && (
                  <Check className={styles.checkIcon} aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
