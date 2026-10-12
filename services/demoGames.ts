// Client-only game mutations for demo mode. Everything here is a pure
// function: it takes the current demo state (held by context/DemoContext.tsx)
// and returns the next one — no supabase, no React — so it is unit-testable
// on its own.
//
// Each function mirrors its real counterpart in services/games.ts and the
// create_game_with_lineups / set_game_split RPCs, so demo behaviour matches
// production: same period math, same cascade, same MAX_GAMES error.

import { Game, Lineup, SplitBy } from "@/app/types";
import { MAX_GAMES } from "@/app/constants/playerLimits";
import { SPLIT_PERIOD_COUNTS } from "@/app/utils/period";
import { MaxGamesReachedError } from "./errors";

// The slice of demo state these functions read and write.
export interface DemoGameState {
  games: Game[];
  lineups: Lineup[];
}

// Ids stay namespaced (`demo-g1`, `demo-l5`) so they can never collide with
// real rows, and continue the sequence instead of reusing a suffix.
const GAME_ID_PREFIX = "demo-g";
const LINEUP_ID_PREFIX = "demo-l";

// Highest numeric suffix among ids with the given prefix, + 1.
function nextSuffix(prefix: string, ids: string[]): number {
  let max = 0;
  for (const id of ids) {
    if (!id.startsWith(prefix)) continue;
    const suffix = Number(id.slice(prefix.length));
    if (Number.isInteger(suffix) && suffix > max) max = suffix;
  }
  return max + 1;
}

// SPLIT_PERIOD_COUNTS[split] with a runtime guard — split values arrive
// cast from a <select>, so an unknown split must fail loudly rather than
// silently produce zero periods (mirrors the RPC's "Invalid split type").
function periodCount(split: SplitBy): number {
  const count = SPLIT_PERIOD_COUNTS[split];
  if (!count) throw new Error(`Invalid split type: ${String(split)}`);
  return count;
}

// Patches one game by id, returning a new games array. Throws when the game
// doesn't exist, so a stale demo screen fails visibly instead of silently.
function patchGame(
  state: DemoGameState,
  gameId: string,
  patch: Partial<Game>,
): Game[] {
  const index = state.games.findIndex((g) => g.id === gameId);
  if (index === -1) throw new Error(`Demo game not found: ${gameId}`);
  const games = [...state.games];
  games[index] = { ...games[index], ...patch };
  return games;
}

function requireGame(state: DemoGameState, gameId: string): Game {
  const game = state.games.find((g) => g.id === gameId);
  if (!game) throw new Error(`Demo game not found: ${gameId}`);
  return game;
}

// Demo is logged-out only, so there is no premium tier to exempt anyone:
// MAX_GAMES is a hard cap. Throws the same error the real service does, so
// the existing limit-warning UI is reused unchanged.
export function assertDemoGameLimit(state: DemoGameState): void {
  if (state.games.length >= MAX_GAMES) throw new MaxGamesReachedError();
}

// Mirrors create_game_with_lineups: one game plus one lineup per period
// (period 0..n-1), with current_lineup_id pointing at period 0.
export function createDemoGame(
  state: DemoGameState,
  {
    teamId,
    name,
    split = "none",
    notes = "",
  }: {
    teamId: string;
    name: string;
    split?: SplitBy;
    notes?: string;
  },
): DemoGameState & { game: Game } {
  assertDemoGameLimit(state);
  const count = periodCount(split);

  let lineupSuffix = nextSuffix(
    LINEUP_ID_PREFIX,
    state.lineups.map((l) => l.id),
  );
  const gameSuffix = nextSuffix(GAME_ID_PREFIX, state.games.map((g) => g.id));
  const gameId = `${GAME_ID_PREFIX}${gameSuffix}`;

  const created: Lineup[] = [];
  for (let period = 0; period < count; period++) {
    created.push({
      id: `${LINEUP_ID_PREFIX}${lineupSuffix++}`,
      game_id: gameId,
      period,
      formation: null,
    });
  }

  const game: Game = {
    id: gameId,
    team_id: teamId,
    name,
    split_by: split,
    notes,
    current_lineup_id: created[0].id,
  };

  return {
    game,
    games: [...state.games, game],
    lineups: [...state.lineups, ...created],
  };
}

export function renameDemoGame(
  state: DemoGameState,
  gameId: string,
  name: string,
): DemoGameState {
  return { ...state, games: patchGame(state, gameId, { name }) };
}

export function updateDemoNotes(
  state: DemoGameState,
  gameId: string,
  notes: string,
): DemoGameState {
  return { ...state, games: patchGame(state, gameId, { notes }) };
}

// Mirrors the game row's current_lineup_id pointer — used by GameContext's
// switchLineup so the selected period survives later demo mutations.
export function setDemoCurrentLineup(
  state: DemoGameState,
  gameId: string,
  lineupId: string,
): DemoGameState {
  const lineup = state.lineups.find((l) => l.id === lineupId);
  if (!lineup || lineup.game_id !== gameId) {
    throw new Error(`Demo lineup not found: ${lineupId}`);
  }
  return { ...state, games: patchGame(state, gameId, { current_lineup_id: lineupId }) };
}

// Mirrors deleteGame plus its ON DELETE CASCADE FK: the game's lineups go
// with it. Placements live in GameLineupContext keyed by lineup id, so they
// drop out on the next render the same way the DB rows would.
export function deleteDemoGame(
  state: DemoGameState,
  gameId: string,
): DemoGameState {
  requireGame(state, gameId);
  return {
    games: state.games.filter((g) => g.id !== gameId),
    lineups: state.lineups.filter((l) => l.game_id !== gameId),
  };
}

// Mirrors set_game_split: add the periods that don't exist yet, remove the
// periods beyond the new count, then leave current_lineup_id pointing at a
// lineup that still exists — keeping it if it survived, otherwise restoring
// period 0 (never null, exactly like the RPC).
export function setDemoSplit(
  state: DemoGameState,
  gameId: string,
  split: SplitBy,
): DemoGameState {
  const count = periodCount(split);
  const game = requireGame(state, gameId);

  const gameLineups = state.lineups.filter((l) => l.game_id === gameId);
  const keptPeriods = new Set(
    gameLineups.filter((l) => l.period < count).map((l) => l.period),
  );

  // Add missing periods (e.g. none -> quarter adds 1,2,3).
  let suffix = nextSuffix(LINEUP_ID_PREFIX, state.lineups.map((l) => l.id));
  const added: Lineup[] = [];
  for (let period = 0; period < count; period++) {
    if (keptPeriods.has(period)) continue;
    added.push({
      id: `${LINEUP_ID_PREFIX}${suffix++}`,
      game_id: gameId,
      period,
      formation: null,
    });
  }

  // Remove periods beyond the new count (e.g. quarter -> half removes 2,3).
  const removedIds = new Set(
    gameLineups.filter((l) => l.period >= count).map((l) => l.id),
  );

  const survivingPeriodZero =
    gameLineups.find((l) => l.period === 0 && l.period < count) ??
    added.find((l) => l.period === 0);

  const currentSurvives =
    game.current_lineup_id !== null &&
    !removedIds.has(game.current_lineup_id);

  return {
    games: patchGame(state, gameId, {
      split_by: split,
      current_lineup_id: currentSurvives
        ? game.current_lineup_id
        : survivingPeriodZero!.id,
    }),
    lineups: [
      ...state.lineups.filter((l) => !removedIds.has(l.id)),
      ...added,
    ],
  };
}
