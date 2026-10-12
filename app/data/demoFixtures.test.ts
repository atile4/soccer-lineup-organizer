import { describe, it, expect } from "vitest";
import {
  DEMO_GAMES,
  DEMO_LINEUPS,
  DEMO_PLAYERS,
  DEMO_TEAM,
  DEMO_TEAM_ID,
} from "./demoFixtures";
import { MAX_PLAYERS, MAX_PLAYERS_BY_DIV } from "@/app/constants/playerLimits";
import { SPLIT_PERIOD_COUNTS } from "@/app/utils/period";

// Guards the invariants demo mode depends on: ids must be unique (contexts
// key by them), the roster must fit a legal field (ruleset evaluation runs
// against it), and every game must have exactly the periods its split implies.
describe("demo fixtures", () => {
  it("uses unique ids across every entity", () => {
    const ids = [
      DEMO_TEAM.id,
      ...DEMO_PLAYERS.map((p) => p.id),
      ...DEMO_GAMES.map((g) => g.id),
      ...DEMO_LINEUPS.map((l) => l.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps the roster within MAX_PLAYERS", () => {
    expect(DEMO_PLAYERS.length).toBeLessThanOrEqual(MAX_PLAYERS);
    expect(DEMO_PLAYERS.length).toBeGreaterThan(0);
  });

  it("wires the roster and team together", () => {
    expect(DEMO_TEAM.id).toBe(DEMO_TEAM_ID);
    expect(DEMO_TEAM.playerCount).toBe(DEMO_PLAYERS.length);
    expect(DEMO_PLAYERS.every((p) => p.team_id === DEMO_TEAM_ID)).toBe(true);
    expect(DEMO_PLAYERS.every((p) => p.number !== null)).toBe(true);
    // Division must be one ruleset evaluation knows how to score.
    expect(Object.keys(MAX_PLAYERS_BY_DIV)).toContain(DEMO_TEAM.division);
    expect(DEMO_TEAM.color).toMatch(/^#/);
  });

  it("gives every game the periods its split requires, pointing at period 0", () => {
    expect(DEMO_GAMES.length).toBeGreaterThan(0);

    for (const game of DEMO_GAMES) {
      const lineups = DEMO_LINEUPS.filter((l) => l.game_id === game.id).sort(
        (a, b) => a.period - b.period,
      );
      const expected = SPLIT_PERIOD_COUNTS[game.split_by];

      expect(lineups).toHaveLength(expected);
      expect(lineups.map((l) => l.period)).toEqual(
        Array.from({ length: expected }, (_, i) => i),
      );
      expect(game.current_lineup_id).toBe(lineups[0].id);
      expect(game.team_id).toBe(DEMO_TEAM_ID);
    }
  });

  it("never references a lineup that doesn't exist", () => {
    const gameIds = new Set(DEMO_GAMES.map((g) => g.id));
    expect(DEMO_LINEUPS.every((l) => gameIds.has(l.game_id))).toBe(true);
  });
});
