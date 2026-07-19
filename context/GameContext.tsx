"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useTeam } from "./TeamContext";
import { fetchGames } from "@/services/games";
import {
  fetchLineups,
  switchLineup as persistSwitchLineup,
} from "@/services/lineups";
import { fetchCurrentIDs } from "@/services/profiles";
import { Game, Lineup } from "@/app/types";

interface GameContextValue {
  games: Game[];
  currentGame: Game | null;
  lineups: Lineup[]; // ordered by period
  loading: boolean;
  switchGame: (gameId: string) => void;
  switchLineup: (lineupId: string) => Promise<void>;
  refreshGameData: () => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

const byPeriod = (list: Lineup[]) =>
  [...list].sort((a, b) => a.period - b.period);

export function GameProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const { currentTeamId } = useTeam();
  const userId = session?.user?.id ?? null;

  const [games, setGames] = useState<Game[]>([]);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [loading, setLoading] = useState(true);

  const currentGame = games.find((g) => g.id === currentGameId) ?? null;

  // Load games whenever the active team changes. The initial game is taken
  // from the profile's current_game_id when present, mirroring how
  // TeamContext resolves the current team.
  useEffect(() => {
    if (!currentTeamId) {
      setGames([]);
      setCurrentGameId(null);
      setLineups([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      fetchGames(currentTeamId),
      userId ? fetchCurrentIDs(userId) : Promise.resolve(null),
    ])
      .then(([gameList, current]) => {
        if (cancelled) return;
        const list = gameList as Game[];
        setGames(list);
        const preferred = list.find((g) => g.id === current?.current_game_id);
        setCurrentGameId(preferred?.id ?? list[0]?.id ?? null);
      })
      .catch((err) => console.error("Failed to load games:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentTeamId, userId]);

  // Load lineups whenever the active game changes.
  useEffect(() => {
    if (!currentGameId) {
      setLineups([]);
      return;
    }

    let cancelled = false;
    fetchLineups(currentGameId)
      .then((data) => {
        if (!cancelled) setLineups(byPeriod(data));
      })
      .catch((err) => console.error("Failed to load lineups:", err));

    return () => {
      cancelled = true;
    };
  }, [currentGameId]);

  const switchGame = useCallback((gameId: string) => {
    setCurrentGameId(gameId);
  }, []);

  // Optimistically point the game at the chosen lineup, then persist.
  // Reverts on failure — same pattern as TeamContext.switchTeam.
  const switchLineup = useCallback(
    async (lineupId: string) => {
      if (!currentGame || currentGame.current_lineup_id === lineupId) return;

      const gameId = currentGame.id;
      const previous = currentGame.current_lineup_id;

      setGames((prev) =>
        prev.map((g) =>
          g.id === gameId ? { ...g, current_lineup_id: lineupId } : g,
        ),
      );

      try {
        await persistSwitchLineup(gameId, lineupId);
      } catch (err) {
        console.error("Failed to switch lineup:", err);
        setGames((prev) =>
          prev.map((g) =>
            g.id === gameId ? { ...g, current_lineup_id: previous } : g,
          ),
        );
      }
    },
    [currentGame],
  );

  // Re-pull games + lineups for the active game. Used after a split change,
  // which resizes lineups and may re-point current_lineup_id server-side.
  const refreshGameData = useCallback(async () => {
    if (!currentTeamId || !currentGameId) return;
    try {
      const [gameList, lineupList] = await Promise.all([
        fetchGames(currentTeamId),
        fetchLineups(currentGameId),
      ]);
      setGames(gameList as Game[]);
      setLineups(byPeriod(lineupList));
    } catch (err) {
      console.error("Failed to refresh game data:", err);
    }
  }, [currentTeamId, currentGameId]);

  return (
    <GameContext.Provider
      value={{
        games,
        currentGame,
        lineups,
        loading,
        switchGame,
        switchLineup,
        refreshGameData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
