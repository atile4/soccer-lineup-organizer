"use client";

import { useGame } from "@/context/GameContext";
import { formatPeriodTab, formatPeriodLabel } from "@/app/utils/period";
import { lineupTabsStyles as s } from "./LineupTabs.styles";

// Vertical tab strip on the left of the field for switching the game's
// active lineup. One tab per period (Q1/Q2… or H1/H2). Hidden when the game
// isn't split, since there's then only a single lineup to show.
export default function LineupTabs() {
  const { currentGame, lineups, switchLineup } = useGame();

  if (
    !currentGame ||
    currentGame.split_by === "none" ||
    lineups.length <= 1
  ) {
    return null;
  }

  return (
    <div className={s.container} role="tablist" aria-label="Lineup periods">
      {lineups.map((lineup) => {
        const active = lineup.id === currentGame.current_lineup_id;
        const fullLabel = formatPeriodLabel(lineup.period, currentGame.split_by);
        return (
          <button
            key={lineup.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={fullLabel}
            title={fullLabel}
            onClick={() => switchLineup(lineup.id)}
            className={`${s.tab} ${active ? s.tabActive : s.tabInactive}`}
          >
            {formatPeriodTab(lineup.period, currentGame.split_by)}
          </button>
        );
      })}
    </div>
  );
}
