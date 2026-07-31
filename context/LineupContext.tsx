"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { Player, Placement } from "@/app/types";
import { fetchPlayers } from "@/services/players";
import {
  fetchFieldPositions,
  placePlayerOnField,
  benchPlayer,
  removeFieldPosition,
  benchAllPlayers,
} from "@/services/fieldPositions";

// Placements are keyed by player_id for O(1) lookups from every surface
// (sidebar / bench / field).
type PlacementMap = Record<string, Placement>;

interface LineupContextValue {
  players: Player[];
  loading: boolean;

  // Derived player buckets for each surface.
  unplacedPlayers: Player[]; // sidebar
  benchedPlayers: Player[]; // bench
  fieldedPlayers: Player[]; // field

  // Coordinates for on-field players, keyed by player_id.
  placements: PlacementMap;

  // Mutations — each updates local state optimistically, then persists.
  placeOnField: (playerId: string, x: number, y: number) => void;
  placeOnBench: (playerId: string) => void;
  unplace: (playerId: string) => void;
  benchAll: () => void;

  // Reflect an edited player (name/position/etc.) back into the roster so
  // every surface — sidebar, bench, field — shows the new info. Persistence
  // is handled by whoever performed the edit (e.g. the info popover).
  applyPlayerUpdate: (updated: Player) => void;

  // Drop a deleted player out of the roster (and any placement) so they
  // disappear from every surface. Persistence is handled by the caller
  // (the info popover deletes the DB row before calling this).
  removePlayer: (playerId: string) => void;

  // Add a newly-created player to the roster. The caller is responsible
  // for persisting to the DB first; this only updates local state.
  addPlayer: (player: Player) => void;
}

const LineupContext = createContext<LineupContextValue | undefined>(undefined);

interface LineupProviderProps {
  teamId: string | null;
  lineupId: string | null;
  children: ReactNode;
}

export function LineupProvider({
  teamId,
  lineupId,
  children,
}: LineupProviderProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [placements, setPlacements] = useState<PlacementMap>({});
  const [loading, setLoading] = useState(true);

  // Load the roster AND hydrate placements for the active lineup together,
  // in a single effect keyed on both teamId and lineupId.
  useEffect(() => {
    if (!teamId) {
      setPlayers([]);
      setPlacements({});
      setLoading(false); // nothing to load — no team selected
      return;
    }

    let cancelled = false;
    setLoading(true);

    const rosterPromise = fetchPlayers(teamId);
    // if no lineup selected, nothing is placed. Resolve with [] instead of skipping the fetch
    const placementsPromise = lineupId
      ? fetchFieldPositions(lineupId)
      : Promise.resolve([]);

    Promise.all([rosterPromise, placementsPromise])
      .then(([playerData, positions]) => {
        if (cancelled) return;
        setPlayers(playerData);
        const map: PlacementMap = {};
        for (const p of positions) {
          map[p.player_id] = { x: p.x, y: p.y, bench: p.bench };
        }
        setPlacements(map);
      })
      .catch((err) => console.error("Failed to load lineup data:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [teamId, lineupId]);

  // Warn once per action if there's no lineup to persist to. Without a game,
  // there's no valid lineup FK, so changes stay local only.
  // @TODO Remove this guard once a lineup always exists for the active game.
  const warnNoLineup = () =>
    console.warn(
      "No active lineup — change applied locally but not persisted. " +
        "This resolves once a game/lineup is selected.",
    );

  const placeOnField = useCallback(
    (playerId: string, x: number, y: number) => {
      setPlacements((prev) => ({
        ...prev,
        [playerId]: { x, y, bench: false },
      }));
      if (!lineupId) return warnNoLineup();
      placePlayerOnField(lineupId, playerId, x, y).catch((err) =>
        console.error("Failed to persist field placement:", err),
      );
    },
    [lineupId],
  );

  const placeOnBench = useCallback(
    (playerId: string) => {
      setPlacements((prev) => ({
        ...prev,
        [playerId]: { x: null, y: null, bench: true },
      }));
      if (!lineupId) return warnNoLineup();
      benchPlayer(lineupId, playerId).catch((err) =>
        console.error("Failed to persist bench placement:", err),
      );
    },
    [lineupId],
  );

  const unplace = useCallback(
    (playerId: string) => {
      setPlacements((prev) => {
        if (!(playerId in prev)) return prev;
        const next = { ...prev };
        delete next[playerId];
        return next;
      });
      if (!lineupId) return warnNoLineup();
      removeFieldPosition(lineupId, playerId).catch((err) =>
        console.error("Failed to remove field placement:", err),
      );
    },
    [lineupId],
  );

  const benchAll = useCallback(() => {
    const ids = players.map((p) => p.id);
    setPlacements(() => {
      const next: PlacementMap = {};
      for (const id of ids) next[id] = { x: null, y: null, bench: true };
      return next;
    });
    if (!lineupId) return warnNoLineup();
    benchAllPlayers(lineupId, ids).catch((err) =>
      console.error("Failed to bench all players:", err),
    );
  }, [players, lineupId]);

  const applyPlayerUpdate = useCallback((updated: Player) => {
    setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    setPlacements((prev) => {
      if (!(playerId in prev)) return prev;
      const next = { ...prev };
      delete next[playerId];
      return next;
    });
  }, []);

  const addPlayer = useCallback((player: Player) => {
    setPlayers((prev) => [...prev, player]);
  }, []);

  const { unplacedPlayers, benchedPlayers, fieldedPlayers } = useMemo(() => {
    const unplaced: Player[] = [];
    const benched: Player[] = [];
    const fielded: Player[] = [];
    for (const player of players) {
      const placement = placements[player.id];
      if (!placement) unplaced.push(player);
      else if (placement.bench) benched.push(player);
      else fielded.push(player);
    }
    return {
      unplacedPlayers: unplaced,
      benchedPlayers: benched,
      fieldedPlayers: fielded,
    };
  }, [players, placements]);

  const value: LineupContextValue = {
    players,
    loading,
    unplacedPlayers,
    benchedPlayers,
    fieldedPlayers,
    placements,
    placeOnField,
    placeOnBench,
    unplace,
    benchAll,
    applyPlayerUpdate,
    removePlayer,
    addPlayer,
  };

  return (
    <LineupContext.Provider value={value}>{children}</LineupContext.Provider>
  );
}

export function useLineup() {
  const ctx = useContext(LineupContext);
  if (!ctx) throw new Error("useLineup must be used within a LineupProvider");
  return ctx;
}
