import { describe, it, expect } from "vitest";
import {
  assertDemoGameLimit,
  createDemoGame,
  deleteDemoGame,
  renameDemoGame,
  setDemoCurrentLineup,
  setDemoSplit,
  updateDemoNotes,
  type DemoGameState,
} from "./demoGames";
import { MaxGamesReachedError } from "./errors";
import { MAX_GAMES } from "@/app/constants/playerLimits";
import { SPLIT_PERIOD_COUNTS } from "@/app/utils/period";
import { DEMO_GAMES, DEMO_LINEUPS } from "@/app/data/demoFixtures";
import type { SplitBy } from "@/app/types";

// Fresh copies of the fixtures for every test — the functions under test must
// never mutate the state they are handed (fixtures are frozen in prod).
const freshState = (): DemoGameState => ({
  games: DEMO_GAMES.map((g) => ({ ...g })),
  lineups: DEMO_LINEUPS.map((l) => ({ ...l })),
});

const lineupsOf = (state: DemoGameState, gameId: string) =>
  state.lineups
    .filter((l) => l.game_id === gameId)
    .sort((a, b) => a.period - b.period);

describe("assertDemoGameLimit", () => {
  it("passes while under MAX_GAMES", () => {
    const state = freshState();
    expect(() => assertDemoGameLimit(state)).not.toThrow();
  });

  it("throws MaxGamesReachedError at the cap", () => {
    const games = Array.from({ length: MAX_GAMES }, (_, i) => ({
      ...DEMO_GAMES[0],
      id: `demo-g${i + 1}`,
    }));
    expect(() => assertDemoGameLimit({ games, lineups: [] })).toThrow(
      MaxGamesReachedError,
    );
  });
});

describe("createDemoGame", () => {
  it.each(Object.entries(SPLIT_PERIOD_COUNTS))(
    "creates one lineup per period for split %s",
    (split, count) => {
      const state = freshState();
      const created = createDemoGame(state, {
        teamId: "demo-team",
        name: "Sunday vs. Falcons",
        split: split as SplitBy,
      });

      const lineups = lineupsOf(created, created.game.id);
      expect(lineups).toHaveLength(count);
      expect(lineups.map((l) => l.period)).toEqual(
        Array.from({ length: count }, (_, i) => i),
      );
      // Mirrors the RPC: current lineup points at period 0.
      expect(created.game.current_lineup_id).toBe(lineups[0].id);
      expect(created.game.split_by).toBe(split);
      expect(created.games).toHaveLength(state.games.length + 1);
      expect(created.game.id).toMatch(/^demo-g\d+$/);
      expect(lineups.every((l) => /^demo-l\d+$/.test(l.id))).toBe(true);
    },
  );

  it("keeps ids unique against the existing state", () => {
    const state = freshState();
    const created = createDemoGame(state, { teamId: "demo-team", name: "G2" });

    const gameIds = created.games.map((g) => g.id);
    const lineupIds = created.lineups.map((l) => l.id);
    expect(new Set(gameIds).size).toBe(gameIds.length);
    expect(new Set(lineupIds).size).toBe(lineupIds.length);
  });

  it("does not mutate the input state", () => {
    const state = freshState();
    const snapshot = JSON.parse(JSON.stringify(state));
    createDemoGame(state, { teamId: "demo-team", name: "G2" });
    expect(state).toEqual(snapshot);
  });

  it("throws MaxGamesReachedError at MAX_GAMES without adding anything", () => {
    const state = freshState();
    state.games = Array.from({ length: MAX_GAMES }, (_, i) => ({
      ...DEMO_GAMES[0],
      id: `demo-g${i + 1}`,
    }));

    expect(() =>
      createDemoGame(state, { teamId: "demo-team", name: "One too many" }),
    ).toThrow(MaxGamesReachedError);
    expect(state.games).toHaveLength(MAX_GAMES);
  });

  it("throws on an invalid split instead of creating zero periods", () => {
    const state = freshState();
    expect(() =>
      createDemoGame(state, {
        teamId: "demo-team",
        name: "Bad split",
        split: "third" as SplitBy,
      }),
    ).toThrow("Invalid split type");
  });
});

describe("setDemoSplit", () => {
  it("grows by adding the missing periods and keeps existing lineup ids", () => {
    const state = freshState();
    const game = state.games[0];
    const originalPeriodZero = lineupsOf(state, game.id)[0].id;

    const next = setDemoSplit(state, game.id, "quarter");

    const lineups = lineupsOf(next, game.id);
    expect(lineups.map((l) => l.period)).toEqual([0, 1, 2, 3]);
    expect(lineups[0].id).toBe(originalPeriodZero);
    expect(next.games[0].split_by).toBe("quarter");
    // The selected lineup survived, so it stays selected.
    expect(next.games[0].current_lineup_id).toBe(originalPeriodZero);
  });

  it("shrinks by dropping periods beyond the new count", () => {
    const state = freshState(); // fixture game is split into quarters
    const game = state.games[0];

    const next = setDemoSplit(state, game.id, "none");

    const lineups = lineupsOf(next, game.id);
    expect(lineups.map((l) => l.period)).toEqual([0]);
    expect(next.games[0].split_by).toBe("none");
    // Other games' lineups (there are none here) are never touched.
    expect(next.lineups).toHaveLength(lineups.length);
  });

  it("restores current_lineup_id to period 0 when the current lineup is removed", () => {
    const state = freshState();
    const game = state.games[0];
    // Select Q4 (period 3), then shrink to half — periods 2 and 3 go away.
    const periodThree = lineupsOf(state, game.id)[3];
    const withSelection = {
      ...state,
      games: [{ ...game, current_lineup_id: periodThree.id }],
    };

    const next = setDemoSplit(withSelection, game.id, "half");

    const lineups = lineupsOf(next, game.id);
    expect(lineups.map((l) => l.period)).toEqual([0, 1]);
    expect(lineups.some((l) => l.id === periodThree.id)).toBe(false);
    expect(next.games[0].current_lineup_id).toBe(lineups[0].id);
  });

  it("keeps the current lineup when it survives the shrink", () => {
    const state = freshState();
    const game = state.games[0];
    const periodOne = lineupsOf(state, game.id)[1];
    const withSelection = {
      ...state,
      games: [{ ...game, current_lineup_id: periodOne.id }],
    };

    const next = setDemoSplit(withSelection, game.id, "half");

    expect(next.games[0].current_lineup_id).toBe(periodOne.id);
  });

  it("throws when the game does not exist", () => {
    expect(() => setDemoSplit(freshState(), "demo-g999", "half")).toThrow(
      "Demo game not found",
    );
  });
});

describe("deleteDemoGame", () => {
  it("drops the game and cascades to its lineups only", () => {
    const state = freshState();
    const other = {
      ...state.games[0],
      id: "demo-g2",
      name: "Other game",
    };
    const otherLineup = {
      id: "demo-l99",
      game_id: other.id,
      period: 0,
      formation: null,
    };
    const withOther: DemoGameState = {
      games: [...state.games, other],
      lineups: [...state.lineups, otherLineup],
    };

    const next = deleteDemoGame(withOther, other.id);

    expect(next.games.map((g) => g.id)).toEqual([state.games[0].id]);
    expect(next.lineups.every((l) => l.game_id !== other.id)).toBe(true);
    expect(next.lineups.some((l) => l.id === otherLineup.id)).toBe(false);
    // The surviving game's lineups are untouched.
    expect(lineupsOf(next, state.games[0].id)).toHaveLength(4);
  });

  it("throws when the game does not exist", () => {
    expect(() => deleteDemoGame(freshState(), "demo-g999")).toThrow(
      "Demo game not found",
    );
  });
});

describe("renameDemoGame / updateDemoNotes", () => {
  it("patches only the targeted game", () => {
    const state = freshState();
    const other = { ...state.games[0], id: "demo-g2", name: "Other" };
    const withOther: DemoGameState = { ...state, games: [...state.games, other] };

    const renamed = renameDemoGame(withOther, other.id, "Renamed");
    expect(renamed.games.find((g) => g.id === other.id)?.name).toBe("Renamed");
    expect(renamed.games[0].name).toBe(state.games[0].name);

    const noted = updateDemoNotes(withOther, other.id, "Bring cones");
    expect(noted.games.find((g) => g.id === other.id)?.notes).toBe(
      "Bring cones",
    );
    expect(noted.games[0].notes).toBe(state.games[0].notes);
  });

  it("throws when the game does not exist", () => {
    expect(() => renameDemoGame(freshState(), "demo-g999", "Nope")).toThrow(
      "Demo game not found",
    );
    expect(() => updateDemoNotes(freshState(), "demo-g999", "Nope")).toThrow(
      "Demo game not found",
    );
  });
});

describe("setDemoCurrentLineup", () => {
  it("points the game at the chosen lineup", () => {
    const state = freshState();
    const game = state.games[0];
    const target = lineupsOf(state, game.id)[2];

    const next = setDemoCurrentLineup(state, game.id, target.id);

    expect(next.games[0].current_lineup_id).toBe(target.id);
    // Lineups are untouched — only the pointer moves.
    expect(next.lineups).toEqual(state.lineups);
  });

  it("rejects a lineup that belongs to another game", () => {
    const state = freshState();
    // The fixture has a single game, so fake a second one to get a foreign
    // lineup: demo-l50 exists, but not under the first game.
    const withForeign: DemoGameState = {
      games: [...state.games, { ...state.games[0], id: "demo-g2" }],
      lineups: [
        ...state.lineups,
        { id: "demo-l50", game_id: "demo-g2", period: 0, formation: null },
      ],
    };

    expect(() =>
      setDemoCurrentLineup(withForeign, state.games[0].id, "demo-l50"),
    ).toThrow("Demo lineup not found");
    expect(() =>
      setDemoCurrentLineup(withForeign, state.games[0].id, "demo-l999"),
    ).toThrow("Demo lineup not found");
  });
});
