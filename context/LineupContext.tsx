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
import { getOrCreateLineup } from "@/services/lineups";
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
}

const LineupContext = createContext<LineupContextValue | undefined>(undefined);

interface LineupProviderProps {
  teamId: string | null;
  gameId: string | null;
  children: ReactNode;
}

export function LineupProvider({
  teamId,
  gameId,
  children,
}: LineupProviderProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [placements, setPlacements] = useState<PlacementMap>({});
  const [lineupId, setLineupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load the roster for the active team.
  //
  // @TODO The roster is team-wide today. Once lineup switching exists, the
  //       sidebar list should be scoped per lineup so different lineups can
  //       surface different sets of available players.
  useEffect(() => {
    if (!teamId) {
      setPlayers([]);
      return;
    }
    let cancelled = false;
    fetchPlayers(teamId)
      .then((data) => {
        if (!cancelled) setPlayers(data);
      })
      .catch((err) => console.error("Failed to load players:", err));
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  // Resolve the active lineup and hydrate existing placements from the DB.
  //
  // @TODO period is hard-coded to 1 (single-lineup assumption). This effect
  //       should re-run whenever the selected lineup/period changes.
  useEffect(() => {
    if (!gameId) {
      setLineupId(null);
      setPlacements({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    getOrCreateLineup(gameId)
      .then(async (lineup) => {
        if (cancelled) return;
        setLineupId(lineup.id);
        const positions = await fetchFieldPositions(lineup.id);
        if (cancelled) return;
        const map: PlacementMap = {};
        for (const p of positions) {
          map[p.player_id] = { x: p.x, y: p.y, bench: p.bench };
        }
        setPlacements(map);
      })
      .catch((err) => console.error("Failed to load lineup:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gameId]);

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
      setPlacements((prev) => ({ ...prev, [playerId]: { x, y, bench: false } }));
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
